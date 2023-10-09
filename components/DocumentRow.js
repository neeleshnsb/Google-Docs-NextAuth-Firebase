import React, { useEffect, useState } from "react";
import { FileText, MoreVertical } from "react-feather";
import { useRouter } from "next/router";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useDocument } from "react-firebase-hooks/firestore";

const DocumentRow = ({ id }) => {
  const router = useRouter();
  const [fileName, setFileName] = useState("");
  const [rename, setRename] = useState(false)
  const [createdAt, setCreatedAt] = useState();
  const [check, setCheck] = useState(false)
  const [newName, setNewName] = useState('')
  const [docData] = useDocument(doc(db, "Documents", id), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  
  useEffect(() => {
    if (docData?.data()?.fileName) {
      setFileName(String(docData.data().fileName));
    }
    setCreatedAt(
      docData?.data()?.timestamp?.toDate().toLocaleDateString() || ""
    );
  }, [docData]);
  function Rename(){
    setRename(true)
    
  }
  function Delete(){
    deleteDoc(doc(db, 'Documents', id))

  }
  function Save(){
    setRename(false)
    setNewName('')
    const docref = doc(db, 'Documents', id)
    setDoc(docref, {fileName: newName}, {merge:true})
  }
  if(!docData?.data()?.fileName){
    return <></>
  }
  return (
    <>
    <div
      onClick={() => router.push(`/doc/${id}`)}
      className="flex bg-gray-50 relative items-center p-4 rounded-lg hover:bg-gray-100 text-gray-700 text-sm cursor-pointer"
    >
      <FileText className="text-white bg-blue-500 rounded-md h-8 w-8" />
      <p className="flex-grow text-lg pl-5 w-10 pr-10 truncate">{fileName}</p>
      <p className=" pr-5 text-sm">{createdAt}</p>
      <MoreVertical onClick={(e)=>{setCheck(!check); e.stopPropagation()}} />
      {check && 
      <div className="absolute right-10 h-min py-2   transition-transform   top-2 bg-white z-10 text-xl px-2  rounded-lg" >
        <ul className=" select-none " >
          <li className="hover:bg-slate-100 w-full px-6 rounded-lg"  onClick={(e)=>{Rename(); setCheck(!check); e.stopPropagation()} } >Rename</li>
          <li onClick={(e)=>{Delete(); e.stopPropagation()}} className="hover:bg-slate-100 w-full px-6 rounded-lg">Delete</li>
          <li className="hover:bg-slate-100 w-full px-6 rounded-lg" >Share</li>
        </ul>
      </div>}
    </div>

  {rename && 
  <div onClick={()=>{setRename(false)}} className=" flex items-center w-screen h-screen backdrop-blur-[2px] fixed left-0 top-0 z-50 " >
    <div className=" bg-gray-200 flex flex-col gap-3 rounded-md w-fit p-4 mx-auto  " onClick={(e)=>{e.stopPropagation()}} >
      <input className="rounded-md pl-2 py-1 w-72" value={newName} onChange={(e)=>{setNewName(e.target.value)}} placeholder="Enter New Name for the Doc"  />
      <div className="flex justify-around" >
        <button onClick={Save} className="px-4 text-white py-2 rounded-lg bg-blue-500" >Save</button>
        <button onClick={()=>setRename(false)} className="px-4 py-2 text-white rounded-lg bg-blue-500" >cancel</button>
      </div>
    </div>
  </div>
}    </>
    

  );
};
export default DocumentRow;
