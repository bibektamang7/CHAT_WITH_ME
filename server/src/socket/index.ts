import WebSocket, { WebSocketServer } from "ws";
import app from "../app";

import { createServer } from "http";
import { ChatManager } from "./ChatManager";
import { User } from "./socketManager";

const server = createServer(app);

const chatManager = new ChatManager();

const wss = new WebSocketServer({ server });

wss.on("connection", function connection(ws, req) {
  ws.on("error", console.error);
  try {
    const user = new User(ws, "123");
    chatManager.addUser(user);
  } catch (error) {}

  ws.on("close", () => {});
});

export {
  server,
  chatManager,
};
