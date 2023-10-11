import dynamic from "next/dynamic";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { collection, doc, setDoc, getFirestore } from "firebase/firestore";
import { useDocument, useDocumentOnce } from "react-firebase-hooks/firestore";
import React, { useEffect, useState } from "react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { htmlToText } from "html-to-text";
import {
  EditorState,
  convertFromRaw,
  convertToRaw,
  SelectionState,
  ContentState,
} from "draft-js";
import { db } from "../firebase.config";
import { useSession } from "next-auth/react";
import Login from "./Login";
import { useRouter } from "next/router";
import { stateToHTML } from "draft-js-export-html";
import PDFGenerator from "../pages/PDFGenerator";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((module) => module.Editor),
  { ssr: false }
);

export const TextEditor = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const docref = doc(db, "Documents", router.query.id);
  const [pdfState, setPdfState] = useState()
  const [focused, setFocused] = React.useState(true)
const onFocus = () => setFocused(true)
const onBlur = () => setFocused(false)
document.getElementsByClassName('rdw-editor-toolbar')[0]?.addEventListener('click',onBlur)

  const convertToPDF = () => {
    const content = document.getElementsByClassName('rdw-editor-main')[0];
  
    html2canvas(content, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, 180, 160);
      pdf.save('editor-content.pdf');
    });
  };

  const [snapshot] = useDocument(docref, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  useEffect(()=>{setPdfState(convertToRaw(editorState.getCurrentContent()))}, [editorState])

  useEffect(() => {
    if (snapshot?.data()?.editorState && snapshot?.data()?.cursorData && focused) {
      const newEditorState = EditorState.createWithContent(
        convertFromRaw(snapshot?.data()?.editorState)
      );
      if (snapshot?.data()?.cursorData[`${session.user.email}`] && focused) {
        const selectionState = SelectionState.createEmpty(
          snapshot?.data().cursorData[`${session.user.email}`].startKey
        ).merge({
          anchorOffset:
            snapshot?.data().cursorData[`${session.user.email}`].startOffset,
          focusKey: snapshot?.data().cursorData[`${session.user.email}`].endKey,
          focusOffset:
            snapshot?.data().cursorData[`${session.user.email}`].endOffset,
        });
        const updatedEditorState = EditorState.forceSelection(
          newEditorState,
          selectionState
        );
        setEditorState(updatedEditorState);
      } else {
        setEditorState(newEditorState);
      }
    }
  }, [snapshot]);

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    const selectionState = editorState.getSelection();
    const cData = {
      startKey: selectionState.getStartKey(),
      endKey: selectionState.getEndKey(),
      startOffset: selectionState.getStartOffset(),
      endOffset: selectionState.getEndOffset(),
    };
    let email = session.user.email;
    let temp = {};
    temp[`${email}`] = cData;
    if (snapshot?.data()?.cursorData) {
      temp = snapshot.data().cursorData;
      temp[`${session.user.email}`] = cData;
    }
    setDoc(
      docref,
      {
        editorState: convertToRaw(editorState.getCurrentContent()),
        cursorData: temp,
      },
      { merge: true }
    );
  };

  if (!session) return <Login />;
  return (
    <>
    <div className=" bg-[#F8F9FA] min-h-screen pb-16">
      <button onClick={convertToPDF}>Convert to PDF</button>
      <span id="editor-content">
      <Editor
      onFocus={onFocus}
      onBlur={onBlur}
        onEditorStateChange={(editorState) => onEditorStateChange(editorState)}
        editorState={editorState}
        toolbarClassName="flex sticky top-0 z-50 !justify-center mx-auto"
        editorClassName="mt-6 p-10 bg-white shadow-lg max-w-5xl mx-auto mb-12  min-h-[80vh] border"
      />
      </span>
      
    </div>
    <div>
      <PDFGenerator  content={pdfState} />
    </div>
    
    </>
    
    
  );
};
