import { useEffect, useState } from "react"

// const CONNECTED_EVENT = "connected";
// const DISCONNECT_EVENT = "disconnect";
// const JOIN_CHAT_EVENT = "joinChat";
// const LEAVE_CHAT_EVENT = "leaveChat";
// const UPDATE_GROUP_NAME_EVENT = "updateGroupName";
// const MESSAGE_RECEIVED_EVENT = "messageReveived";
// const NEW_CHAT_EVENT = "newChat";
// const SOCKET_ERROR_EVENT = "socketError";
// const STOP_TYPING_EVENT = "stopTyping";
// const TYPING_EVENT = "typing";
// const MESSAGE_DELETE_EVENT = "messageDeleted";

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    // if(!user) return;
    const ws = new WebSocket('ws://localhost:8080');
    
    const emit = function(){
      
    }
  })
  return { socket };
} 
