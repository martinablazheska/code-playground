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

const NewRoomModal: React.FC<{
  isOpen: boolean;
  onOpenChange: () => void;
}> = ({ isOpen, onOpenChange }) => {
  const { setRoom, setCurrentUser } = useContext(roomContext);
  const { createRoom, isLoading, error } = useRoom();
  const navigate = useNavigate();

  const [name, setName] = useState("");

  const handleCreateRoom = async () => {
    if (!name.trim()) {
      return;
    }

    try {
      const newRoom = await createRoom(name);
      setRoom(newRoom);
      setCurrentUser(newRoom.owner);
      onOpenChange();
      navigate(`/room/${newRoom.roomId}`);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={() => {
        onOpenChange();
        setName("");
      }}
      classNames={{
        base: "bg-zinc-900 text-white",
        closeButton: "hover:bg-zinc-800 active:bg-zinc-800 text-white",
      }}
    >
      <ModalContent>
        <ModalHeader>Create New Room</ModalHeader>
        <ModalBody>
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
        </ModalBody>
        <ModalFooter>
          <div className="flex flex-col justify-center items-center w-full gap-4">
            {error && (
              <div className="text-white text-sm text-center">{error}</div>
            )}
            <Button
              className="bg-red-800 text-white font-medium"
              onClick={handleCreateRoom}
              isLoading={isLoading}
            >
              Create
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NewRoomModal;
