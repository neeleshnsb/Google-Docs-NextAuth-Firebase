import React, { useEffect, useState } from "react";
import Head from "next/head";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { Folder, MoreVertical } from "react-feather";
import Image from "next/image";
import Header from "../components/Header";
import Login from "../components/Login";
import { db } from "../firebase.config";
import {
  doc,
  collection,
  addDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { Dialog } from "@material-tailwind/react";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import DocumentRow from "../components/DocumentRow";

function Index() {
  const { data: session } = useSession();
  useEffect(()=>{console.log(session?.user?.email)}, [session])
  const [value2] = useDocument(doc(db, "userDocs", session?.user?.email||'19uec104@lnmiit.ac.in'), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState();
  if (!session | !session?.user) {
    return <Login />;
  }

  const handleOpen = () => setOpen(!open);

  async function createDocument() {
    handleOpen();
    if (!input) return;
    const temp = value2?.data()?.hasAccessTo || [];
    const Doc = await addDoc(collection(db, "Documents"), {
      fileName: input,
      timestamp: serverTimestamp(),
      hasAccess: [session.user.email],
    });
    console.log(Doc.id)
    await setDoc(
      doc(db, "userDocs", session.user.email),
      {
        hasAccessTo: [Doc.id, ...temp],
      },
      { snapshotListenOptions: { includeMetadataChanges: true } }
    );
    setInput("");
  }
  return (
    <div>
      <Head>
        <title>Google Docs</title>
      </Head>
      <Header url={session?.user?.image} />
      <Dialog
        className=" max-w-md mx-auto mt-60 "
        open={open}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          className=" outline-none box-border w-96 m-3"
          placeholder="Enter Name of the Doc..."
          onKeyDown={(e) => e.key === "Enter" && createDocument()}
        />
        <div className="flex items-center justify-center gap-3 py-2">
          <button
            onClick={createDocument}
            className=" px-3 py-1 bg-blue-500 rounded-lg "
          >
            create
          </button>
          <button onClick={handleOpen} className="px-3 py-1">
            cancel
          </button>
        </div>
      </Dialog>
      <section className="bg-[#F8F9FA] pb-10 px-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center  py-6">
            <h2 className="text-gray-700 text-lg ">Start a new Document</h2>
            <button>
              <MoreVertical />
            </button>
          </div>
          <div>
            <div
              onClick={handleOpen}
              className="relative h-52  w-40 border-2 cursor-pointer hover:border-blue-700"
            >
              <Image src="https://links.papareact.com/pju" layout="fill" />
            </div>
            <p className="ml-2 mt-2 text-sm font-semibold text-gray-700 ">
              Blank
            </p>
          </div>
        </div>
      </section>
      <section className="bg-white px-10 md:px-0">
        <div className="max-w-3xl mx-auto py-8">
          <div className="flex item-center justify-between pb-5 ">
            <h2 className="font-medium flex-grow ">My Documents</h2>
            <p className="mr-12">Date Created</p>
            <Folder />
          </div>

          {value2?.data()?.hasAccessTo?.map((id) => (
            <DocumentRow key={String(id)} id={String(id)} />
          ))}
        </div>
      </section>
    </div>
  );
}
export default Index;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}
