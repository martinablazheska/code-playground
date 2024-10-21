import React, { createContext, useState, useMemo } from "react";
import { Room } from "../types/types";

interface RoomContextType {
  room: Room | null;
  setRoom: React.Dispatch<React.SetStateAction<Room | null>>;
}

export const roomContext = createContext<RoomContextType>({
  room: null,
  setRoom: () => {},
});

const RoomContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [room, setRoom] = useState<Room | null>(null);

  const value = useMemo(() => ({ room, setRoom }), [room]);

  return <roomContext.Provider value={value}>{children}</roomContext.Provider>;
};

export default RoomContextProvider;
