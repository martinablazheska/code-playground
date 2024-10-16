import { useState } from "react";
import { roomService } from "../services/roomService";
import { Room } from "../types/types";

export const useRoom = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [room, setRoom] = useState<Room | null>(null);

  const createRoom = async (ownerName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const newRoom = await roomService.createRoom(ownerName);
      setRoom(newRoom);
      return newRoom;
    } catch (err) {
      setError("Failed to create room. Please try again.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const joinRoom = async (roomId: string, userName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const joinedRoom = await roomService.joinRoom(roomId, userName);
      setRoom(joinedRoom);
      return joinedRoom;
    } catch (err) {
      setError("Failed to join room. Please try again.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createRoom, joinRoom, isLoading, error, room };
};
