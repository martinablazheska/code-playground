import React from "react";
import { useAuth } from "../hooks/useAuth";
import Logo from "./Logo";
import Avatar from "./Avatar";
import { Button } from "@nextui-org/button";
import { LogOut } from "lucide-react";

const Header: React.FC = () => {
  const { isAuthenticated, logout, username } = useAuth();

  return (
    <div className="w-full h-16 bg-zinc-800 text-white flex justify-between items-center px-4 ">
      <div className="flex items-center gap-2">
        <Logo fill="#fff" size={30} />
        <span className="font-playfair tracking-wider text-lg">code dojo</span>
      </div>

      {isAuthenticated && (
        <div className="flex items-center gap-2">
          <Avatar username={username} />
          <Button
            onClick={logout}
            variant="light"
            isIconOnly
            className="text-white"
            size="sm"
            radius="full"
          >
            <LogOut size={18} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Header;
