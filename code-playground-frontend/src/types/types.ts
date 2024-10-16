export interface User {
  id: string;
  name: string;
}

export interface Room {
  roomId: string;
  owner: User;
  participants: User[];
}
