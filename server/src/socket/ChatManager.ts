import { Chat } from "./chat";
import WebSocket from "ws";
import {
  CONNECTED_EVENT,
  DISCONNECT_EVENT,
  JOIN_CHAT_EVENT,
  LEAVE_CHAT_EVENT,
  UPDATE_GROUP_NAME_EVENT,
  MESSAGE_RECEIVED_EVENT,
  NEW_CHAT_EVENT,
  SOCKET_ERROR_EVENT,
  STOP_TYPING_EVENT,
  TYPING_EVENT,
  MESSAGE_DELETE_EVENT,
} from "./messages";
import { socketManager, User } from "./socketManager";

export class ChatManager {
  private chats: Map<string, Chat>;

  constructor() {
    this.chats = new Map();
  }

  createChat(participants: User[]): string {
    const participantSockets = participants.map((user) => user.socket);
    const chat = new Chat(participants,);
    this.chats.set(chat.chatId, chat);

    participants.forEach((user) => {
      socketManager.addUser(user, chat.chatId);
    });
    return chat.chatId;
  }

  joinChat(user: User, chatId: string) {
    const chat = this.chats.get(chatId);
    if (chat) {
      chat.addUser(user);
      socketManager.addUser(user, chatId);
    }
  }

  leaveChat(user: User, chadId: string) {
    const chat = this.chats.get(chadId);
    if (chat) {
      chat.removeUser(user);
      socketManager.removeUser(user);
    }
  }

  handleMessage(user: User, message: string) {
    const roomId = socketManager.getRoomId(user.userId);
    if (roomId) {
      const chat = this.chats.get(roomId);
      if (chat) {
        chat.broadcast(message);
      }
    }
  }
  handleEvent(event: string, user: User, data?: any) {
    switch (event) {
      case JOIN_CHAT_EVENT:
        if (data && data.chatId) {
          this.joinChat(user, data.chatId);
        }
        break;
      case LEAVE_CHAT_EVENT:
        if (data && data.chatId) {
          this.leaveChat(user, data.chatId);
        }
        break;
      case MESSAGE_RECEIVED_EVENT:
        if (data && data.chatId && data.message) {
          const chat = this.chats.get(data.chatId);
          if (chat) {
            chat.broadcast(data.message);
          }
        }
        break;
      default:
        console.error(`Unknown event: ${event}`);
    }
  }
  addUser(user: User, ws: WebSocket) {}

}
