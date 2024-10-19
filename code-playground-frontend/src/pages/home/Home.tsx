import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import { useDisclosure } from "@nextui-org/modal";
import JoinRoomModal from "./JoinRoomModal";
import Header from "../../components/Header";
import Button from "../../components/Button";
import { Plus, DoorOpen } from "lucide-react";
import { Room } from "../../types/types";

const API_URL = "http://localhost:3000/api";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();

  const {
    isOpen: isJoinOpen,
    onOpen: onJoinOpen,
    onOpenChange: onJoinOpenChange,
  } = useDisclosure();

  const createRoom = async () => {
    try {
      const response = await axios.post<Room>(
        `${API_URL}/rooms/create`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const room = response.data;
      navigate(`/room/${room.roomId}`);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const joinRoom = async (roomId: string) => {
    try {
      const response = await axios.post<Room>(
        `${API_URL}/rooms/join`,
        { roomId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const room = response.data;
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
            <Button startContent={<Plus size={20} />} onClick={createRoom}>
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

        <JoinRoomModal
          isOpen={isJoinOpen}
          onOpenChange={onJoinOpenChange}
          onJoinRoom={joinRoom}
        />
      </div>
    </div>
  );
};

export default Home;
