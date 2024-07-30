import WebSocket, { WebSocketServer } from "ws";
import app from "../app";

import url from "url";
import { createServer } from "http";
import { ChatManager } from "./ChatManager";
import { socketManager, User } from "./socketManager";


import { CONNECTED_EVENT, JOIN_CHAT_EVENT, LEAVE_CHAT_EVENT, MESSAGE_RECEIVED_EVENT } from "./messages";
const server = createServer(app);

const chatManager = new ChatManager();

const wss = new WebSocketServer({ server });
wss.on("connection", function connection(ws,req) {
  ws.on("error", console.error);
  const userDetails =  {username: "Bibek", _id: "123"};
  const user = new User(ws, userDetails._id, userDetails.username);
  socketManager.handleEvent(CONNECTED_EVENT, user);

  ws.on('message', function message(data) {
    const parsedData = JSON.parse(data.toString());
    const { event, payload } = parsedData;
    switch (event) {
      case JOIN_CHAT_EVENT:
      case LEAVE_CHAT_EVENT:
      case MESSAGE_RECEIVED_EVENT:
        chatManager.handleEvent(event, user, payload);
        break;
      default:
        socketManager.handleEvent(event, user, payload);
    }
  })
  
  chatManager.addUser(user, ws)
  // const token: string = url.parse(req.url, true).query.token;
  // const extractAuthUser(token,ws);

});

export {server};
