import React from "react";
import { useRoom } from "../hooks/useRoom";
import { useAuth } from "../hooks/useAuth";
import Avatar from "./Avatar";
import TooltipButton from "./TooltipButton";
import { X } from "lucide-react";

const Participants: React.FC<{ roomId: string | undefined }> = ({ roomId }) => {
  const { username } = useAuth();
  const { room, removeParticipant } = useRoom(roomId!);
  return (
    <div className="h-[45%] flex-1 bg-zinc-800 rounded-lg py-4">
      <div className="font-semibold text-md px-4 pb-2 border-b border-b-zinc-600">
        Participants
      </div>
      <div className="p-4 text-sm overflow-y-scroll scrollbar-hide flex flex-col items-stretch gap-3">
        <div className="w-full flex items-center gap-4">
          <Avatar username={username} />
          <span className="font-semibold">{username} (You)</span>
        </div>
        {room &&
          room.participants
            .filter(participant => participant.username !== username)
            .map(participant => (
              <div
                key={participant.id}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <Avatar username={participant.username} />
                  <span>
                    {participant.username}{" "}
                    {participant.username === room.owner.username && "(Owner)"}
                  </span>
                </div>
                {username === room.owner.username && (
                  <TooltipButton
                    isIconOnly
                    onClick={() => removeParticipant(participant.id)}
                    size="sm"
                    radius="full"
                    tooltip="Remove user from this room"
                    className="text-white"
                  >
                    <X size={15} />
                  </TooltipButton>
                )}
              </div>
            ))}
      </div>
    </div>
  );
};

export default Participants;
