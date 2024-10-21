/* eslint-disable @typescript-eslint/no-explicit-any */
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
import Button from "./Button";
import { ButtonGroup } from "@nextui-org/button";
import TooltipButton from "./TooltipButton";

const availableProgrammingLanguages = [
  "JavaScript",
  "TypeScript",
  "Java",
  "Python",
];

interface NewRoomModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onCreateRoom: (
    roomName: string,
    programmingLanguage: string,
    privacyType: "private" | "public"
  ) => void;
}

const NewRoomModal: React.FC<NewRoomModalProps> = ({
  isOpen,
  onOpenChange,
  onCreateRoom,
}) => {
  const [roomName, setRoomName] = useState("Unnamed Room");
  const [programmingLanguages, setProgrammingLanguages] = useState<any>(
    new Set(["JavaScript"])
  );
  const [privacyType, setPrivacyType] = useState<"private" | "public">(
    "public"
  );

  const handleCreateRoom = () => {
    if (roomName) {
      const selectedProgrammingLanguage = Array.from(programmingLanguages)[0];
      onCreateRoom(
        roomName,
        selectedProgrammingLanguage as string,
        privacyType
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={() => {
        onOpenChange();
        setRoomName("Unnamed Room");
        setProgrammingLanguages(new Set(["JavaScript"]));
        setPrivacyType("public");
      }}
      classNames={{
        base: "bg-zinc-900 text-white",
        closeButton: "hover:bg-zinc-800 active:bg-zinc-800 text-white",
      }}
    >
      <ModalContent>
        <ModalHeader>Create Room</ModalHeader>
        <ModalBody>
          <div className="w-full flex flex-col gap-4 justify-center">
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
              selectedKeys={programmingLanguages}
              onSelectionChange={setProgrammingLanguages}
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
              {availableProgrammingLanguages.map(language => (
                <SelectItem
                  key={language}
                  classNames={{
                    base: "data-[hover=true]:bg-zinc-700 data-[hover=true]:text-white data-[selectable=true]:focus:bg-zinc-700 data-[selectable=true]:focus:text-white",
                  }}
                >
                  {language}
                </SelectItem>
              ))}
            </Select>
            <ButtonGroup>
              <TooltipButton
                tooltip="Code in peace and quiet"
                onClick={() => setPrivacyType("private")}
                className={`${
                  privacyType === "private" ? "bg-red-900" : "bg-zinc-800"
                }`}
              >
                PRIVATE
              </TooltipButton>
              <TooltipButton
                tooltip="Anyone with the link can join"
                onClick={() => setPrivacyType("public")}
                className={`${
                  privacyType === "public" ? "bg-red-900" : "bg-zinc-800"
                }`}
              >
                PUBLIC
              </TooltipButton>
            </ButtonGroup>
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
