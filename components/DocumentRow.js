import React, { useEffect, useState } from "react";

import { Button, IconButton } from "@material-tailwind/react";
import { FileText, MoreVertical } from "react-feather";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useDocument } from "react-firebase-hooks/firestore";

const DocumentRow = ({ id }) => {
  const router = useRouter();
  const [fileName, setFileName] = useState("");
  const [createdAt, setCreatedAt] = useState();
  const [docData] = useDocument(doc(db, "Documents", id), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  useEffect(() => {
    if (docData?.data().fileName) {
      setFileName(String(docData.data().fileName));
    }
    setCreatedAt(
      docData?.data()?.timestamp?.toDate().toLocaleDateString() || ""
    );
  }, [docData]);
  return (
    <div
      onClick={() => router.push(`/doc/${id}`)}
      className="flex items-center p-4 rounded-lg hover:bg-gray-100 text-gray-700 text-sm cursor-pointer"
    >
      <FileText className="text-white bg-blue-500 rounded-md h-8 w-8" />
      <p className="flex-grow text-lg pl-5 w-10 pr-10 truncate">{fileName}</p>
      <p className=" pr-5 text-sm">{createdAt}</p>
      <MoreVertical />
    </div>
  );
};
export default DocumentRow;
