export interface User {
  id: string;
  username: string;
}

export interface CodeData {
  content: string;
  lastEditedBy: User | null;
  lastEditedAt: string | null;
  programmingLanguage: string;
}

export interface Room {
  roomId: string;
  owner: User;
  participants: User[];
  codeData: CodeData;
}
