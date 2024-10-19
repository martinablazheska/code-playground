import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import { editor } from "monaco-editor";

const Y_SOCKET_URL = "http://localhost:3000/yjs-ws";

export const setupYjs = (
  roomId: string,
  editorInstance: editor.IStandaloneCodeEditor
) => {
  const doc = new Y.Doc();
  const provider = new WebsocketProvider(Y_SOCKET_URL, roomId, doc);
  const type = doc.getText("monaco");

  const binding = new MonacoBinding(
    type,
    editorInstance.getModel()!,
    new Set([editorInstance]),
    provider.awareness
  );

  return { binding, provider };
};
