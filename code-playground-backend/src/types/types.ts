import { ProgrammingLanguage } from "../constants/programmingLanguages";

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
  name: string;
  owner: User;
  participants: User[];
  codeData: CodeData;
  programmingLanguage: ProgrammingLanguage;
}
