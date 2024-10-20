export interface User {
  id: string;
  username: string;
}

export interface CodeData {
  content: string;
  lastEditedBy: User | null;
  lastEditedAt: string | null;
}

export interface Room {
  roomId: string;
  owner: User;
  name: string;
  participants: User[];
  codeData: CodeData;
  programmingLanguage: string;
}
