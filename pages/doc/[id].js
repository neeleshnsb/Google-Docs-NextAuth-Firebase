import { getSession, signOut, useSession } from "next-auth/react";
import React, { useState } from "react";
import Login from "../../components/Login";
import { FileText } from "react-feather";
import { useRouter } from "next/router";
import { useDocument, useDocumentOnce } from "react-firebase-hooks/firestore";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase.config";
import { Button, Dialog } from "@material-tailwind/react";
import { TextEditor } from "../../components/TextEditor";

const Doc = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const docsRef = doc(db, "Documents", router.query.id);
  const [docData] = useDocumentOnce(docsRef);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState();

  const handleOpen = () => setOpen(!open);
  if (
    docData?.data().hasAccess &&
    !docData?.data().hasAccess.includes(session.user.email)
  ) {
    return <p>You dont have access to the document.</p>;
  }

  async function Share() {
    const shareToData = await getDoc(doc(db, "userDocs", input));

    const temp = shareToData?.data()?.hasAccessTo || [];
    await setDoc(
      doc(db, "userDocs", input),
      {
        hasAccessTo: [router.query.id, ...temp],
      },
      { merge: true }
    );
    await setDoc(
      doc(db, "Documents", router.query.id),
      { hasAccess: [input, ...docData.data().hasAccess] },
      { merge: true }
    );
  }
  if (!session) return <Login />;

  if (open)
    return (
      <Dialog
        className=" p-4 flex flex-col gap-2 border-2 border-black max-w-md mx-auto mt-60 "
        open={open}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <p className=" text-lg font-bold">Share with...</p>
        <input
          value={input}
          placeholder="Enter Email Id"
          onChange={(e) => setInput(e.target.value)}
          className="px-2 py-1 w-full border-black border rounded-md"
        />
        <div className="flex justify-between">
          <Button onClick={Share} color="blue" className="px-3 py-2">
            Share
          </Button>
          <Button onClick={handleOpen} color="blue" className="  px-3 py-2 ">
            Cancel
          </Button>
        </div>
      </Dialog>
    );

  if (!open)
    return (
      <div>
        <header className=" flex justify-between items-center p-3 pb-1 gap-1">
          <span onClick={() => router.push("/")} className=" cursor-pointer">
            <FileText className=" text-blue-500 w-10 h-10 " />
          </span>

          <div className=" flex-grow px-2">
            <h2 className=" font-bold text-lg">{docData?.data().fileName}</h2>
            <div className="flex space-x-1 -ml-1 h-8 text-gray-600 font-light items-center text-sm">
              <p className="option">File</p>
              <p className="option">Edit </p>
              <p className="option">View</p>
              <p className="option">Insert</p>
              <p className="option">Format</p>
              <p className="option">Tools</p>
            </div>
          </div>

          <button
            onClick={handleOpen}
            className=" hidden sm:inline-flex px-5 py-2 bg-blue-400 text-white rounded-md"
          >
            SHARE
          </button>

          <img
            onClick={() => {
              signOut();
              router.push("/");
            }}
            className=" rounded-full cursor-pointer h-10 w-10 ml-2"
            src={session.user.image}
            alt="user"
          />
        </header>

        <TextEditor />
      </div>
    );
};
export default Doc;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}
