export interface User {
  id: string;
  name: string;
}

export interface CodeData {
  content: string;
  lastEditedBy: User | null;
  lastEditedAt: string | null;
}

export interface Room {
  roomId: string;
  owner: User;
  participants: User[];
  codeData: CodeData;
}
