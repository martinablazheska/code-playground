import NewRoomModal from "../components/NewRoomModal";
import Header from "../components/Header";
import Button from "../components/Button";
import { useDisclosure } from "@nextui-org/modal";
import { Plus } from "lucide-react";

const Home = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
        <div>
          <Button
            className="bg-red-800 text-white font-medium"
            startContent={<Plus size={20} />}
            onClick={onOpen}
          >
            New Room
          </Button>
        </div>
        <NewRoomModal isOpen={isOpen} onOpenChange={onOpenChange} />
      </div>
    </div>
  );
};

export default Home;
