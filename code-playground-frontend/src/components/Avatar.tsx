import React from "react";
import { Tooltip } from "@nextui-org/tooltip";
import { Avatar as NextUIAvatar } from "@nextui-org/avatar";

const Avatar: React.FC<{ username: string | null }> = ({ username = "" }) => {
  return (
    <Tooltip
      content={username}
      className="text-white bg-zinc-900"
      classNames={{ arrow: "bg-zinc-900" }}
    >
      <NextUIAvatar
        name={username?.charAt(0).toUpperCase()}
        size="sm"
        className="bg-zinc-400"
      />
    </Tooltip>
  );
};

export default Avatar;
