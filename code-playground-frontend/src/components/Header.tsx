import React from "react";
import Logo from "./Logo";
import { Avatar } from "@nextui-org/avatar";
import { Room, User } from "../types/types";

const Header: React.FC<{ room?: Room; currentUser?: User }> = ({
  currentUser,
}) => {
  return (
    <div className="w-full h-16 bg-zinc-800 text-white flex justify-between items-center px-4 ">
      <div className="flex items-center gap-2">
        <Logo fill="#fff" size={30} />
        <span className="font-playfair tracking-wider text-lg">code dojo</span>
      </div>
      {currentUser && <Avatar name={currentUser.name} />}
    </div>
  );
};

export default Header;
