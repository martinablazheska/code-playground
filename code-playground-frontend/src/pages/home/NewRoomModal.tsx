import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Input } from "@nextui-org/input";
import Button from "../../components/Button";

interface NewRoomModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onCreateRoom: (roomName: string, programmingLanguage: string) => void;
}

const NewRoomModal: React.FC<NewRoomModalProps> = ({
  isOpen,
  onOpenChange,
  onCreateRoom,
}) => {
  const [roomName, setRoomName] = useState("");
  const [programmingLanguage, setProgrammingLanguage] = useState("javascript");

  const handleCreateRoom = () => {
    if (roomName) {
      onCreateRoom(roomName, programmingLanguage);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={() => {
        onOpenChange();
        setRoomName("");
      }}
      classNames={{
        base: "bg-zinc-900 text-white",
        closeButton: "hover:bg-zinc-800 active:bg-zinc-800 text-white",
      }}
    >
      <ModalContent>
        <ModalHeader>Create Room</ModalHeader>
        <ModalBody>
          <div className="w-full flex flex-col gap-4">
            <Input
              type="text"
              value={roomName}
              onValueChange={setRoomName}
              label="Enter the room name"
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
            <Button onClick={handleCreateRoom}>Create</Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NewRoomModal;
