import React from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Button } from "@material-tailwind/react";
import loginImage from "../public/images/login1.png";
const Login = () => {
  const handleSignIn = () => {
    signIn("google");
  };

  return (
    <div className="flex flex-col item-center justify-center min-h-screen py-2 ">
      <Image
        className="mx-auto shadow-xl"
        src={loginImage}
        width="400"
        height="300"
        objectfit="contain"
      />
      <Button
        className=" mt-10 h-10 w-min mx-auto px-4 py-2 bg-blue-500 hover:shadow-md hover:shadow-slate-950"
        color="blue"
        buttonType="filled"
        ripple="light"
        onClick={handleSignIn}
      >
        Login
      </Button>
    </div>
  );
};

export default Login;
