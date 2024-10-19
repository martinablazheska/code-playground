import axios from "axios";
import { Room } from "../types/types";

const API_URL = "http://localhost:3000/api";

export const fetchRoom = async (roomId: string): Promise<Room> => {
  const response = await axios.get<Room>(`${API_URL}/rooms/${roomId}`);
  return response.data;
};
