import dynamic from "next/dynamic";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { collection, doc, setDoc, getFirestore } from "firebase/firestore";
import { useDocument, useDocumentOnce } from "react-firebase-hooks/firestore";
import React, { useEffect, useState } from "react";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
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
  if (!session) return <Login />;
  const router = useRouter();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const docref = doc(
    db,
    "userDocs",
    session.user.email,
    "docs",
    router.query.id
  );

  const [snapshot] = useDocumentOnce(docref);
  useEffect(() => {
    if (snapshot?.data().editorState) {
      setEditorState(
        EditorState.createWithContent(
          convertFromRaw(snapshot?.data()?.editorState)
        )
      );
    }
  }, [snapshot]);

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    setDoc(
      docref,
      {
        editorState: convertToRaw(editorState.getCurrentContent()),
      },
      { merge: true }
    );
  };

  return (
    <div className=" bg-[#F8F9FA] min-h-screen pb-16">
      <Editor
        onEditorStateChange={onEditorStateChange}
        editorState={editorState}
        toolbarClassName="flex sticky top-0 z-50 !justify-center mx-auto"
        editorClassName="mt-6 p-10 bg-white shadow-lg max-w-5xl mx-auto mb-12  min-h-[80vh] border"
      />
    </div>
  );
};
