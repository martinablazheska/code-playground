import { useState, useEffect, useRef } from "react";
import { Room as RoomType } from "../types/types";
import { fetchRoom } from "../services/api";
import { createSocketConnection } from "../services/socket";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

export const useRoom = (roomId: string) => {
  const [room, setRoom] = useState<RoomType | null>(null);
  const { token, username } = useAuth();
  const navigate = useNavigate();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const loadRoom = async () => {
      try {
        const roomData = await fetchRoom(roomId);
        setRoom(roomData);
      } catch (error) {
        console.error("Error fetching room:", error);
      }
    };

    if (roomId) {
      loadRoom();
    }
  }, [roomId]);

  useEffect(() => {
    if (!roomId || !token) return;

    const onParticipantRemoved = (updatedRoom: RoomType) => {
      setRoom(updatedRoom);
      // If the current user has been removed
      if (
        username &&
        !updatedRoom.participants
          .map(participant => participant.username)
          .includes(username)
      ) {
        navigate("/");
        console.log("You have been removed from the room");
      }
    };

    socketRef.current = createSocketConnection(
      roomId,
      token,
      setRoom,
      onParticipantRemoved
    );

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [roomId, token, navigate]);

  const removeParticipant = (participantId: string) => {
    socketRef.current?.emit("remove_participant", {
      roomId,
      participantId,
      token,
    });
    console.log("attempting to remove partiicpant");
  };

  const lockRoom = () => {
    socketRef.current?.emit("lock_room", { roomId, token });
  };

  const updateCodeContent = (content: string) => {
    socketRef.current?.emit("update_code_content", { roomId, content });
  };

  const runCode = (content: string) => {
    socketRef.current?.emit("run_code", { roomId, content });
  };

  return {
    room,
    setRoom,
    removeParticipant,
    lockRoom,
    updateCodeContent,
    runCode,
  };
};
