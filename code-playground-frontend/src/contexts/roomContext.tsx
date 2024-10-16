import { createContext, useState } from "react";
import { Room } from "../types/types";

export const roomContext = createContext<{
  room: Room | null;
  setRoom: (room: Room | null) => void;
}>({
  room: null,
  setRoom: () => {},
});

const RoomContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [room, setRoom] = useState<Room | null>(null);

  const value = { room: room, setRoom: setRoom };

  return <roomContext.Provider value={value}>{children}</roomContext.Provider>;
};

export default RoomContextProvider;
