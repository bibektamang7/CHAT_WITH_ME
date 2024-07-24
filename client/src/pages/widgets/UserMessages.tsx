import React from "react";
import {Link} from "react-router-dom"
import { FaRegSquarePlus } from "react-icons/fa6";


//search icon
import { CiSearch } from "react-icons/ci";

const UserMessages = () => {
  return <div className="w-[25%]">
    <div className="p-7 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl ">Chats</h2>
        <FaRegSquarePlus size={`1.4rem`} color="8B47FF"/>
      </div>
      <div>
        <div className="flex justify-between bg-red-50 items-center rounded-md">
          <input className="w-full outline-none" type="text" placeholder="Search here..." />
          <CiSearch/>
        </div>
      </div>
      <div></div>
      <div></div>
    </div>
  </div>;
};

export { UserMessages };
