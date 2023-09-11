import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";

const index = () => {
  const { data: session } = useSession();
  console.log(session);
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-slate-50 ">
      <div
        onClick={signIn}
        className=" cursor-pointer flex w-64 h-auto px-4 py-2 border rounded-md border-gray-300 items-center justify-center"
      >
        Sign in with Google
      </div>
    </div>
  );
};
export default index;
