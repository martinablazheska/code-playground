import React, { useEffect, useRef, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { editor } from "monaco-editor";
import Editor from "@monaco-editor/react";
import Header from "../../components/Header";
import Avatar from "../../components/Avatar";
import { useRoom } from "../../hooks/useRoom";
import { setupYjs } from "../../services/yjs";
import { editorTheme } from "../../theme/editorTheme";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "@nextui-org/button";
import { Lock, X } from "lucide-react";
import { debounce } from "lodash";

const Room: React.FC = () => {
  const { id: roomId } = useParams<{ id: string }>();
  const { room, removeParticipant, lockRoom, updateCodeContent } = useRoom(
    roomId!
  );
  const { username } = useAuth();
  const editorRef = useRef<editor.IStandaloneCodeEditor>();
  const [isEditorReady, setIsEditorReady] = useState(false);

  // Create a debounced version of updateCodeContent
  const debouncedUpdateCodeContent = useCallback(
    debounce((content: string) => {
      if (roomId) {
        updateCodeContent(content);
      }
    }, 1000),
    [roomId, updateCodeContent]
  );

  useEffect(() => {
    if (isEditorReady && editorRef.current && roomId) {
      const { binding, provider } = setupYjs(roomId, editorRef.current);

      // Set up the change event listener
      const disposable = editorRef.current.onDidChangeModelContent(() => {
        const content = editorRef.current?.getValue();
        if (content !== undefined) {
          debouncedUpdateCodeContent(content);
        }
      });

      return () => {
        binding.destroy();
        provider.disconnect();
        disposable.dispose(); // Clean up the event listener
        debouncedUpdateCodeContent.cancel(); // Cancel any pending debounced calls
      };
    }
  }, [roomId, isEditorReady, debouncedUpdateCodeContent]);

  const handleEditorDidMount = useCallback(
    (editor: editor.IStandaloneCodeEditor, monaco) => {
      editorRef.current = editor;
      monaco.editor.defineTheme("customTheme", editorTheme);
      monaco.editor.setTheme("customTheme");
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
      <div className="flex flex-col p-4">
        <div className="flex flex-row items-center gap-2">
          <div className="font-semibold">{room.name}</div>
          {room.owner.username === username && (
            <Button
              isIconOnly
              variant="light"
              size="sm"
              className="text-white"
              radius="full"
              onClick={lockRoom}
            >
              <Lock size={15} />
            </Button>
          )}
        </div>
        <div className="text-sm text-zinc-400 tracking-wider">
          {room.owner.username}'s code room ({room.programmingLanguage})
        </div>
      </div>
      <div className="flex-1 flex items-stretch justify-between px-4 gap-5">
        <div className="h-[95%] w-3/4 rounded-lg bg-zinc-800 p-4">
          <Editor
            height="100%"
            width="100%"
            defaultLanguage={room.programmingLanguage.toLowerCase()}
            language={room.programmingLanguage.toLowerCase()}
            onMount={handleEditorDidMount}
            defaultValue={room.codeData.content}
            options={{
              minimap: { enabled: false },
              fontSize: 16,
              formatOnPaste: true,
              formatOnType: true,
              automaticLayout: true,
              wordWrap: "on",
              tabSize: 2,
              scrollBeyondLastLine: false,
              lineNumbers: "on",
            }}
          />
        </div>
        <div className="h-[45%] flex-1 bg-zinc-800 rounded-lg py-4">
          <div className="font-semibold text-md px-4 pb-2 border-b border-b-zinc-600">
            Participants
          </div>
          <div className="p-4 text-sm overflow-y-scroll scrollbar-hide flex flex-col items-stretch gap-3">
            <div className="w-full flex items-center gap-4">
              <Avatar username={username} />
              <span className="font-semibold">{username} (You)</span>
            </div>
            {room.participants
              .filter(participant => participant.username !== username)
              .map(participant => (
                <div
                  key={participant.id}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <Avatar username={participant.username} />
                    <span>
                      {participant.username}{" "}
                      {participant.username === room.owner.username &&
                        "(Owner)"}
                    </span>
                  </div>
                  {username === room.owner.username && (
                    <Button
                      isIconOnly
                      onClick={() => removeParticipant(participant.username)}
                      size="sm"
                      radius="full"
                      variant="light"
                      className="text-white"
                    >
                      <X size={15} />
                    </Button>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
