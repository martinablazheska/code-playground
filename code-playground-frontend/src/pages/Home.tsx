import NewRoomModal from "../components/NewRoomModal";
import Button from "../components/Button";
import { useDisclosure } from "@nextui-org/modal";
import { Plus } from "lucide-react";

const Home = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Button
        className="bg-red-800 text-white font-medium"
        startContent={<Plus size={20} />}
        onClick={onOpen}
      >
        New Room
      </Button>
      <NewRoomModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
};

export default Home;
