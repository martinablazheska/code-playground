import axios from "axios";
import { Room } from "../types/types";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
});

export const setAuthToken = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const fetchRoom = async (roomId: string): Promise<Room> => {
  const response = await api.get<Room>(`/rooms/${roomId}`);
  return response.data;
};

export const createRoom = async (
  roomName: string,
  language: string = "javascript"
): Promise<Room> => {
  const response = await api.post<Room>("/rooms/create", {
    name: roomName,
    programmingLanguage: language,
  });
  return response.data;
};

export const joinRoom = async (roomId: string): Promise<Room> => {
  const response = await api.post<Room>("/rooms/join", { roomId });
  return response.data;
};
