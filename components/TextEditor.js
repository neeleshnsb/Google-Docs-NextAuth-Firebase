import dynamic from "next/dynamic";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { collection, doc, setDoc, getFirestore } from "firebase/firestore";
import { useDocument, useDocumentOnce } from "react-firebase-hooks/firestore";
import React, { useEffect, useState } from "react";
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

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((module) => module.Editor),
  { ssr: false }
);

export const TextEditor = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const docref = doc(db, "Documents", router.query.id);

  const [snapshot] = useDocument(docref, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  useEffect(() => {
    if (snapshot?.data().editorState && snapshot?.data().cursorData) {
      const newEditorState = EditorState.createWithContent(
        convertFromRaw(snapshot?.data()?.editorState)
      );
      if (snapshot?.data().cursorData[`${session.user.email}`]) {
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
    if (snapshot?.data().cursorData) {
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
    <div className=" bg-[#F8F9FA] min-h-screen pb-16">
      <Editor
        onEditorStateChange={(editorState) => onEditorStateChange(editorState)}
        editorState={editorState}
        toolbarClassName="flex sticky top-0 z-50 !justify-center mx-auto"
        editorClassName="mt-6 p-10 bg-white shadow-lg max-w-5xl mx-auto mb-12  min-h-[80vh] border"
      />
    </div>
  );
};
