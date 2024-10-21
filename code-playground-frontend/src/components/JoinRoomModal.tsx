import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Input } from "@nextui-org/input";
import Button from "@/components/Button";

interface JoinRoomModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onJoinRoom: (roomId: string) => void;
}

const JoinRoomModal: React.FC<JoinRoomModalProps> = ({
  isOpen,
  onOpenChange,
  onJoinRoom,
}) => {
  const [roomId, setRoomId] = useState("");

  const handleJoinRoom = () => {
    if (roomId) {
      onJoinRoom(roomId);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={() => {
        onOpenChange();
        setRoomId("");
      }}
      classNames={{
        base: "bg-zinc-900 text-white",
        closeButton: "hover:bg-zinc-800 active:bg-zinc-800 text-white",
      }}
    >
      <ModalContent>
        <ModalHeader>Join Room</ModalHeader>
        <ModalBody>
          <div className="w-full flex flex-col gap-4">
            <Input
              type="text"
              value={roomId}
              onValueChange={setRoomId}
              label="Enter the room ID"
              labelPlacement="inside"
              className="bg-transparent"
              isRequired
              isClearable
              classNames={{
                inputWrapper:
                  "bg-zinc-800 data-[hover=true]:bg-zinc-800 group-data-[focus=true]:bg-zinc-800",
                input:
                  "text-white group-data-[has-value=true]:text-white group-data-[focus=true]",
                label:
                  "text-white group-data-[filled-within=true]:text-white placeholder:text-white",
              }}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex flex-col justify-center items-center w-full gap-4">
            <Button onClick={handleJoinRoom}>Join</Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default JoinRoomModal;
