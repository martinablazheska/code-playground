import axios from "axios";
import { Room } from "../types/types";

const API_BASE_URL = "http://localhost:3000/api";

export const roomService = {
  createRoom: async (ownerName: string): Promise<Room> => {
    try {
      const response = await axios.post<Room>(`${API_BASE_URL}/rooms/create`, {
        ownerName,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating room:", error);
      throw error;
    }
  },

  joinRoom: async (roomId: string, userName: string): Promise<Room> => {
    try {
      const response = await axios.post<Room>(`${API_BASE_URL}/rooms/join`, {
        roomId,
        userName,
      });
      return response.data;
    } catch (error) {
      console.error("Error joining room:", error);
      throw error;
    }
  },
};
