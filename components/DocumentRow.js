import React from "react";

import { Button, IconButton } from "@material-tailwind/react";
import { FileText, MoreVertical } from "react-feather";
import { useRouter } from "next/router";

const DocumentRow = ({ id, filename, date }) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/doc/${id}`)}
      className="flex items-center p-4 rounded-lg hover:bg-gray-100 text-gray-700 text-sm cursor-pointer"
    >
      <FileText className="text-white bg-blue-500 rounded-md h-8 w-8" />
      <p className="flex-grow text-lg pl-5 w-10 pr-10 truncate">{filename}</p>
      <p className=" pr-5 text-sm">{date?.toDate().toLocaleDateString()}</p>
      <MoreVertical />
    </div>
  );
};
export default DocumentRow;
