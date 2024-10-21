import React, { useEffect, useRef, useCallback, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { useRoom } from "../../hooks/useRoom";
import { setupYjs } from "../../services/yjs";
import { useAuth } from "../../hooks/useAuth";
import { debounce } from "lodash";
import Editor from "@monaco-editor/react";
import Header from "../../components/Header";
import TooltipButton from "../../components/TooltipButton";
import Participants from "../../components/Participants";
import OutputConsole from "../../components/OutputConsole";
import Button from "../../components/Button";
import { Play, Link as LinkIcon, ChevronLeft } from "lucide-react";
import { editorTheme } from "../../theme/editorTheme";
import { editor } from "monaco-editor";

const Room: React.FC = () => {
  const { id: roomId } = useParams<{ id: string }>();
  const { room, updateCodeContent, runCode } = useRoom(roomId!);
  const { isAuthenticated } = useAuth();

  const editorRef = useRef<editor.IStandaloneCodeEditor>();
  const [isEditorReady, setIsEditorReady] = useState(false);

  // Create a debounced function to persist data to the server
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (editor: editor.IStandaloneCodeEditor, monaco: any) => {
      editorRef.current = editor;
      monaco.editor.defineTheme("customTheme", editorTheme);
      monaco.editor.setTheme("customTheme");
      setIsEditorReady(true);
    },
    []
  );

  const handleCopyLink = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
    }
  };

  const showShareLink = room?.privacyType === "public";
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!room) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen w-screen">
      <Header />
      <div className="flex h-[calc(100%-64px)] items-stretch justify-between px-4 py-6 gap-5">
        <div className="h-full w-3/4 flex flex-col items-stretch ">
          <Link
            to="/"
            className="flex items-center gap-1 text-sm text-zinc-500 underline"
          >
            <ChevronLeft size={14} />
            <span>Home</span>
          </Link>
          <div className="flex justify-between items-center mb-2">
            <div className="w-full">
              <div className="flex w-full flex-row items-center gap-2 h-10">
                <div className="font-semibold">{room.name}</div>
                {showShareLink && (
                  <TooltipButton
                    tooltip="Copy room ID and share with others"
                    isIconOnly
                    size="sm"
                    className="text-white"
                    radius="full"
                    onClick={handleCopyLink}
                  >
                    <LinkIcon size={15} />
                  </TooltipButton>
                )}
              </div>
              <div className="text-zinc-300 tracking-wider text-sm">
                {room.owner.username}'s room ({room.programmingLanguage})
              </div>
            </div>
            <Button
              onClick={() => {
                const codeContent = editorRef.current?.getValue();
                if (codeContent) {
                  runCode(codeContent);
                }
              }}
            >
              <Play size={15} fill="#fff" />
              <span>Run</span>
            </Button>
          </div>
          <div className="h-[70vh] w-full rounded-lg bg-zinc-800 p-4">
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
        </div>
        <div className="flex-1 flex flex-col gap-5 items-stretch justify-between ">
          <Participants roomId={roomId} />
          <OutputConsole roomId={roomId} />
        </div>
      </div>
    </div>
  );
};

export default Room;
