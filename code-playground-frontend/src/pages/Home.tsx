import NewRoomModal from "../components/NewRoomModal";
import JoinRoomModal from "../components/JoinRoomModal";
import Header from "../components/Header";
import Button from "../components/Button";
import { useDisclosure } from "@nextui-org/modal";
import { Plus, DoorOpen } from "lucide-react";

const Home = () => {
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onOpenChange: onCreateOpenChange,
  } = useDisclosure();

  const {
    isOpen: isJoinOpen,
    onOpen: onJoinOpen,
    onOpenChange: onJoinOpenChange,
  } = useDisclosure();

  return (
    <div className="h-screen w-screen flex flex-col">
      <Header />
      <div className="my-auto mx-auto flex flex-col items-center justify-center gap-10">
        <div>
          <div className="text-white font-playfair text-[50px] tracking-wide w-full text-center">
            Welcome to Code Dojo
          </div>
          <div className="text-white font-playfair text-xl tracking-wider w-full text-center">
            where code masters train together
          </div>
        </div>
        <div className="flex items-stretch gap-5">
          <Button startContent={<Plus size={20} />} onClick={onCreateOpen}>
            New Room
          </Button>
          <Button startContent={<DoorOpen size={20} />} onClick={onJoinOpen}>
            Join a Room
          </Button>
        </div>
        <NewRoomModal isOpen={isCreateOpen} onOpenChange={onCreateOpenChange} />
        <JoinRoomModal isOpen={isJoinOpen} onOpenChange={onJoinOpenChange} />
      </div>
    </div>
  );
};

export default Home;
