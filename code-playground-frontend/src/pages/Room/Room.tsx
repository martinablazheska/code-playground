import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AvatarGroup } from "@nextui-org/avatar";
import Header from "../../components/Header";
import { Room as RoomType } from "../../types/types";
import { useAuth } from "../../hooks/useAuth";
import Avatar from "../../components/Avatar";
import { io, Socket } from "socket.io-client";

import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import Editor from "@monaco-editor/react";
import { editor } from "monaco-editor";

const API_URL = "http://localhost:3000/api";
const SOCKET_URL = "http://localhost:3000";
const Y_SOCKET_URL = "http://localhost:3000/yjs-ws";

const Room: React.FC = () => {
  const { token } = useAuth();
  const [room, setRoom] = useState<RoomType | null>(null);
  const { id: roomId } = useParams<{ id: string }>();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      path: "/io",
    });
    socketRef.current.on("connect", () => console.log("connected ws"));
    socketRef.current.on("room:update", (room: RoomType) => {
      setRoom(room);
    });

    if (roomId && token) {
      socketRef.current.emit("join", { roomId, token });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off("connect");
        socketRef.current.off("room:update");
      }
    };
  }, [roomId, token]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get<RoomType>(
          `${API_URL}/rooms/${roomId}`
        );
        setRoom(response.data);
      } catch (error) {
        console.error("Error fetching room:", error);
      }
    };

    if (roomId) {
      fetchRoom();
    }
  }, [roomId, token]);

  const editorRef = useRef<editor.IStandaloneCodeEditor>();

  // useEffect(() => {
  //   if (editorRef.current && roomId) {
  //     const ydoc = new Y.Doc();
  //     const provider = new WebsocketProvider(Y_SOCKET_URL, roomId, ydoc);
  //     const type = ydoc.getText("monaco");

  //     const binding = new MonacoBinding(
  //       type,
  //       editorRef.current.getModel(),
  //       new Set([editorRef.current]),
  //       provider.awareness
  //     );

  //     return () => {
  //       binding.destroy();
  //       provider.disconnect();
  //     };
  //   }
  // }, [roomId]);

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;

    // Initialize yjs
    const doc = new Y.Doc(); // collection of shared objects

    // Connect to peers with WebSocket
    const provider: WebsocketProvider = new WebsocketProvider(
      Y_SOCKET_URL,
      "roomId",
      doc
    );
    const type = doc.getText("monaco");

    // Bind yjs doc to Manaco editor
    const binding = new MonacoBinding(
      type,
      editorRef.current!.getModel()!,
      new Set([editorRef.current!])
    );
  };

  if (!room) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen w-screen flex flex-col">
      <Header />
      <div className=" flex flex-row justify-between p-4">
        <div className="font-semibold">{room.owner.username}'s code room</div>
        <AvatarGroup>
          {room.participants.map((participant, index) => (
            <Avatar key={index} username={participant.username} />
          ))}
        </AvatarGroup>
      </div>
      <Editor
        height="70vh"
        defaultLanguage={room.programmingLanguage ?? "JavaScript"}
        onMount={handleEditorDidMount}
      />
    </div>
  );
};

export default Room;
