import { getSession, signOut, useSession } from "next-auth/react";
import React from "react";
import Login from "../../components/Login";
import { FileText } from "react-feather";
import { useRouter } from "next/router";
import { useDocument, useDocumentOnce } from "react-firebase-hooks/firestore";
import { collection, doc, getFirestore } from "firebase/firestore";
import { db } from "../../firebase.config";
import { Button } from "@material-tailwind/react";
import { TextEditor } from "../../components/TextEditor";

const Doc = () => {
  const { data: session } = useSession();
  if (!session) return <Login />;
  const router = useRouter();
  const docsRef = doc(
    db,
    "userDocs",
    session?.user?.email,
    "docs",
    router.query.id
  );
  const [value] = useDocumentOnce(docsRef);

  //   if (!loading && !value?.data().fileName) {
  //     router.replace("/");
  //   }
  return (
    <div>
      <header className=" flex justify-between items-center p-3 pb-1 gap-1">
        <span onClick={() => router.push("/")} className=" cursor-pointer">
          <FileText className=" text-blue-500 w-10 h-10 " />
        </span>

        <div className=" flex-grow px-2">
          <h2 className=" font-bold text-lg">{value?.data().fileName}</h2>
          <div className="flex space-x-1 -ml-1 h-8 text-gray-600 font-light items-center text-sm">
            <p className="option">File</p>
            <p className="option">Edit </p>
            <p className="option">View</p>
            <p className="option">Insert</p>
            <p className="option">Format</p>
            <p className="option">Tools</p>
          </div>
        </div>

        <button className=" hidden sm:inline-flex px-5 py-2 bg-blue-400 text-white rounded-md">
          SHARE
        </button>

        <img
          onClick={signOut}
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
