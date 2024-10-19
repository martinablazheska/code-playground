import { useState, useEffect } from "react";
import { Room as RoomType } from "../types/types";
import { fetchRoom } from "../services/api";
import { createSocketConnection } from "../services/socket";
import { useAuth } from "./useAuth";

export const useRoom = (roomId: string) => {
  const [room, setRoom] = useState<RoomType | null>(null);
  const { token } = useAuth();

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

    const socket = createSocketConnection(roomId, token, setRoom);

    return () => {
      socket.disconnect();
      socket.off("connect");
      socket.off("room:update");
    };
  }, [roomId, token]);

  return { room, setRoom };
};
