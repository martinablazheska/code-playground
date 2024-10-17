import { useState, useContext } from "react";
import { roomService } from "../services/roomService";
import { roomContext } from "../contexts/roomContext";

export const useRoom = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setRoom, setCurrentUser } = useContext(roomContext);

  const createRoom = async (ownerName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const newRoom = await roomService.createRoom(ownerName);
      setRoom(newRoom);
      setCurrentUser(newRoom.owner);
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
      const currentUser = joinedRoom.participants.find(
        p => p.name === userName
      );
      if (currentUser) {
        setCurrentUser(currentUser);
      }
      return joinedRoom;
    } catch (err) {
      setError("Failed to join room. Please try again.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createRoom, joinRoom, isLoading, error };
};
