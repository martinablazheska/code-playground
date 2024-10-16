import React, { useState, useContext } from "react";
import { roomContext } from "../contexts/roomContext";
import { createRoom } from "../services/roomService";
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
  const { setRoom } = useContext(roomContext);

  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateRoom = async () => {
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { roomId, ownerId } = await createRoom(name);
      setRoom({ roomId, ownerId });
    } catch (error) {
      console.error("Error creating room:", error);
      setError("Failed to create room. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
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
            labelPlacement="outside"
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