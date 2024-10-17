import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { roomContext } from "../contexts/roomContext";
import { useRoom } from "../hooks/useRoom";
import Button from "./Button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Input } from "@nextui-org/input";

const JoinRoomModal: React.FC<{
  isOpen: boolean;
  onOpenChange: () => void;
}> = ({ isOpen, onOpenChange }) => {
  const { setRoom, setCurrentUser } = useContext(roomContext);
  const { joinRoom, isLoading, error } = useRoom();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");

  const handleJoinRoom = async () => {
    if (!name.trim() || !roomId.trim()) {
      return;
    }

    try {
      const joinedRoom = await joinRoom(roomId, name);
      setRoom(joinedRoom);
      const currentUser = joinedRoom.participants.find(p => p.name === name);
      if (currentUser) {
        setCurrentUser(currentUser);
      }
      onOpenChange();
      navigate(`/room/${joinedRoom.roomId}`);
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={() => {
        onOpenChange();
        setName("");
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
              value={name}
              onValueChange={setName}
              label="Enter your name"
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
            {error && (
              <div className="text-white text-sm text-center">{error}</div>
            )}
            <Button
              className="bg-red-800 text-white font-medium"
              onClick={handleJoinRoom}
              isLoading={isLoading}
            >
              Join
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default JoinRoomModal;
