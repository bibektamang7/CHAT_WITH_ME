import React from "react";
import {Link} from "react-router-dom"
import { FaRegSquarePlus } from "react-icons/fa6";
import { Avatar } from "@/components/Avatar";

//search icon
import { CiSearch } from "react-icons/ci";

const UserMessages = () => {
  return <div className="md:w-[30%] md:block hidden">
    <div className="p-7 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl ">Chats</h2>
        <FaRegSquarePlus size={`1.4rem`} color="8B47FF"/>
      </div>
      <div>
        <div className="flex justify-between bg-red-50 items-center rounded-md overflow-hidden">
          <input className="w-full outline-none py-1 px-2" type="text" placeholder="Search here..." />
          <CiSearch/>
        </div>
      </div>
      <div>
        <Avatar isOnline={false}/>
      </div>
      <div></div>
    </div>
  </div>;
};

export { UserMessages };
