import { Server } from "http";
import { WebSocketServer } from "ws";
const setupWSConnection = require("y-websocket/bin/utils").setupWSConnection;

export const setupYjsWebsocketServer = (httpServer: Server) => {
  const wss = new WebSocketServer({ noServer: true });

  wss.on("connection", setupWSConnection);

  httpServer.on("upgrade", (request, socket, head) => {
    const url = new URL(request.url!, `http://${request.headers.host}`);

    if (url.pathname === "/yjs-ws") {
      wss.handleUpgrade(request, socket, head, ws => {
        wss.emit("connection", ws, request);
      });
    }
  });

  console.log("Yjs WebSocket server is set up");
};
