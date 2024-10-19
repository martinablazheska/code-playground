import React, { useEffect, useRef, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { AvatarGroup } from "@nextui-org/avatar";
import { editor } from "monaco-editor";
import Editor from "@monaco-editor/react";
import Header from "../../components/Header";
import Avatar from "../../components/Avatar";
import { useRoom } from "../../hooks/useRoom";
import { setupYjs } from "../../services/yjs";

const Room: React.FC = () => {
  const { id: roomId } = useParams<{ id: string }>();
  const { room } = useRoom(roomId!);
  const editorRef = useRef<editor.IStandaloneCodeEditor>();
  const [isEditorReady, setIsEditorReady] = useState(false);

  useEffect(() => {
    if (isEditorReady && editorRef.current && roomId) {
      const { binding, provider } = setupYjs(roomId, editorRef.current);

      return () => {
        binding.destroy();
        provider.disconnect();
      };
    }
  }, [roomId, isEditorReady]);

  const handleEditorDidMount = useCallback(
    (editor: editor.IStandaloneCodeEditor) => {
      editorRef.current = editor;
      setIsEditorReady(true);
    },
    []
  );

  if (!room) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen w-screen flex flex-col">
      <Header />
      <div className="flex flex-row justify-between p-4">
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
