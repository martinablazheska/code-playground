import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useDisclosure } from "@nextui-org/modal";
import NewRoomModal from "@/components/NewRoomModal";
import JoinRoomModal from "@/components/JoinRoomModal";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { Plus, DoorOpen } from "lucide-react";
import { createRoom, joinRoom, setAuthToken } from "@/services/api";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();

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

  const handleCreateRoom = async (
    roomName: string,
    language: string,
    privacyType: "public" | "private"
  ) => {
    try {
      if (token) {
        setAuthToken(token);
      }
      const room = await createRoom(roomName, language, privacyType);
      navigate(`/room/${room.roomId}`);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    try {
      if (token) {
        setAuthToken(token);
      }
      const room = await joinRoom(roomId);
      navigate(`/room/${room.roomId}`);
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

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
        {isAuthenticated ? (
          <div className="flex items-stretch gap-5">
            <Button startContent={<Plus size={20} />} onClick={onCreateOpen}>
              New Room
            </Button>
            <Button startContent={<DoorOpen size={20} />} onClick={onJoinOpen}>
              Join a Room
            </Button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Button onClick={() => navigate("/login")}>Login</Button>
            <Button onClick={() => navigate("/register")}>Register</Button>
          </div>
        )}
        <NewRoomModal
          isOpen={isCreateOpen}
          onOpenChange={onCreateOpenChange}
          onCreateRoom={handleCreateRoom}
        />
        <JoinRoomModal
          isOpen={isJoinOpen}
          onOpenChange={onJoinOpenChange}
          onJoinRoom={handleJoinRoom}
        />
      </div>
    </div>
  );
};

export default Home;
