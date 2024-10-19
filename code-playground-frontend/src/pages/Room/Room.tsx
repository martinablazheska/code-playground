import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AvatarGroup } from "@nextui-org/avatar";
import Header from "../../components/Header";
import { Room as RoomType } from "../../types/types";
import { useAuth } from "../../hooks/useAuth";
import Avatar from "../../components/Avatar";
import { io, Socket } from "socket.io-client";

const API_URL = "http://localhost:3000/api";
const SOCKET_URL = "http://localhost:3000";

const Room: React.FC = () => {
  const { token } = useAuth();
  const [room, setRoom] = useState<RoomType | null>(null);
  const { id: roomId } = useParams<{ id: string }>();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });
    socketRef.current.on("connect", () => console.log("connected ws"));
    socketRef.current.on("room:update", (room: RoomType) => {
      setRoom(room);
    });

    if (roomId && token) {
      socketRef.current.emit("join", { roomId, token });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off("connect");
        socketRef.current.off("room:update");
      }
    };
  }, [roomId, token]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get<RoomType>(
          `${API_URL}/rooms/${roomId}`
        );
        setRoom(response.data);
      } catch (error) {
        console.error("Error fetching room:", error);
      }
    };

    if (roomId) {
      fetchRoom();
    }
  }, [roomId, token]);

  if (!room) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen w-screen flex flex-col">
      <Header />
      <div className="flex-1 p-4">
        <h2 className="text-2xl font-bold mb-4">Room: {room.roomId}</h2>
        <p>Owner: {room.owner.username}</p>
        <h3 className="text-xl font-semibold mt-4 mb-2">Participants:</h3>
        <AvatarGroup>
          {room.participants.map((participant, index) => (
            <Avatar key={index} username={participant.username} />
          ))}
        </AvatarGroup>
        <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
          Leave Room
        </button>
        {/* code editor component here */}
      </div>
    </div>
  );
};

export default Room;
