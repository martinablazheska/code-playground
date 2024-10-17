import React, { createContext, useState } from "react";
import { Room, User } from "../types/types";

interface RoomContextType {
  room: Room | null;
  setRoom: React.Dispatch<React.SetStateAction<Room | null>>;
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const roomContext = createContext<RoomContextType>({
  room: null,
  setRoom: () => {},
  currentUser: null,
  setCurrentUser: () => {},
});

const RoomContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    <roomContext.Provider
      value={{ room, setRoom, currentUser, setCurrentUser }}
    >
      {children}
    </roomContext.Provider>
  );
};

export default RoomContextProvider;
