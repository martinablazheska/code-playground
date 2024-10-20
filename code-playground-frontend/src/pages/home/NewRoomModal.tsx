import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import Button from "../../components/Button";

const programmingLanguages = ["JavaScript", "TypeScript", "Java", "Python"];

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
  const [programmingLanguage, setProgrammingLanguage] = useState("JavaScript");
  // const [privacyType, setPrivacyType] = useState<"invite-only" | "public">(
  //   "public"
  // );

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
                  "text-zinc-400 group-data-[filled-within=true]:text-zinc-400 placeholder:text-zinc-400",
              }}
            />
            <Select
              required
              selectionMode="single"
              label="Select programming language"
              classNames={{
                trigger: "bg-zinc-800 data-[hover=true]:bg-zinc-800 text-white",
                value: "text-white group-data-[has-value=true]:text-white",
                label:
                  "text-zinc-400 group-data-[has-value=true]:text-zinc-400 group-data-[filled=true]:text-zinc-400",
                popoverContent: "bg-zinc-800",
              }}
            >
              {programmingLanguages.map((language, index) => (
                <SelectItem
                  key={index}
                  onClick={() => setProgrammingLanguage(language)}
                  classNames={{
                    base: "data-[hover=true]:bg-zinc-700 data-[hover=true]:text-white data-[selectable=true]:focus:bg-zinc-700 data-[selectable=true]:focus:text-white",
                  }}
                >
                  {language}
                </SelectItem>
              ))}
            </Select>
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
