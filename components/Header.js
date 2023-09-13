import { signOut } from "next-auth/react";
import React from "react";
import { FileText, Menu, Search, User } from "react-feather";
import Image from "next/image";

const Header = ({ url }) => {
  return (
    <div className="flex items-center top-0 sticky z-50 px-4 py-2 shadow-md bg-white gap-3 ">
      <button>
        <Menu className=" text-gray-500" />
      </button>
      <FileText className=" text-blue-500 w-12 h-12  " />
      <h1 className="hidden md:inline-flex  ml-2 text-gray-700 text-2xl ">
        Docs
      </h1>
      <div
        className="flex mx-5 flex-grow items-center p-5 py-2 bg-gray-100 text-gray-600 
         rounded-lg md:mx-20 focus-within:text-gray-600 focus-within:shadow-md"
      >
        <Search className=" text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          className="px-5 text-base bg-transparent 
            outline-none"
        />
      </div>
      <button>
        <Menu className=" text-gray-500" />
      </button>
      <img
        onClick={signOut}
        className="header cursor-pointer md:inline-flexcursor-pointer h-11 w-11 rounded-full ml-2"
        src={url}
        alt="profile"
      />
    </div>
  );
};

export default Header;
