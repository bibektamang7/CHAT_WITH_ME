import { useAuth } from "@/context/AuthContext";
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
  
// switch (message.type) {
//   case CONNECTED_EVENT: {
//     onConnect();
//     break;
//   }
//   case DISCONNECT_EVENT: {
//     onDisconnect();
//     break;
//   }
//   case JOIN_CHAT_EVENT: {
//     break;
//   }
//   case LEAVE_CHAT_EVENT: {
//    //  onChatLeave();
//     break;
//   }
//   case UPDATE_GROUP_NAME_EVENT: {
//    //  onGroupNameChange();
//     break;
//   }
//   case MESSAGE_RECEIVED_EVENT: {
//    //  onMessageReceived();
//     break;
//   }
//   case NEW_CHAT_EVENT: {
//    //  onNewChat();
//     break;
//   }
//   case STOP_TYPING_EVENT: {
//    //  handleOnSocketStopTyping();
//     break
//   }
//   case TYPING_EVENT: {
//    //  handleOnSocketTyping();
//     break;
//   }
//   case MESSAGE_DELETE_EVENT: {
//    //  onMessageDelete();
    
//   }
// }

const WS_URL = import.meta.env.VITE_APP_WS_URL ?? 'ws://localhost:8080';
export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { token, user } = useAuth();
  useEffect(() => {
    if (!user) return;
    const ws = new WebSocket(`${WS_URL}?token=${token}`);
    ws.onopen = () => {
      setSocket(ws);
    }
    ws.onclose = () => {
      setSocket(null);
    }
    return () => {
      ws.close();
    }
  }, [user]);
  return socket;
} 
