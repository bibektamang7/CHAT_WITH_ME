import React, { useEffect, useState } from "react";
import "./App.css";
import { CustomWebsocket } from "./utils/CustomWebsocket";


const CONNECTED_EVENT = "connected";
const DISCONNECT_EVENT = "disconnect";
const JOIN_CHAT_EVENT = "joinChat";
const NEW_CHAT_EVENT = "newChat";
const TYPING_EVENT = "typing";
const STOP_TYPING_EVENT = "stopTyping";
const MESSAGE_RECEIVED_EVENT = "messageReceived";
const LEAVE_CHAT_EVENT = "leaveChat";
const UPDATE_GROUP_NAME_EVENT = "updateGroupName";
const MESSAGE_DELETE_EVENT = "messageDeleted";


function App() {
  // const socket = new CustomWebsocket("ws://localhost:8080");
  const socket = new WebSocket("ws://localhost:8080");
  useEffect(() => {
    socket.onmessage = function (event) {
      const message = JSON.parse(event.data);
      if (message.event === TYPING_EVENT) {
        console.log(message.data);
        
      }
    }
  }, [socket]);
  return (
    <div className="App">
      <input
        type="text"
        onChange={(e) => {
          socket.send(JSON.stringify({event:TYPING_EVENT,data:"Im typing"}))
        }}
      />
    </div>
  );
}

export default App;
