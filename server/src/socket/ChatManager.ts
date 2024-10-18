import { WebSocket } from "ws";
import { Chat } from "./chat";
import { ChatMessages } from "./messages";
import { socketManager, User } from "./socketManager";

export class ChatManager {
  private chats: Chat[];
  private users: User[];
  constructor() {
    this.chats = [];
    this.users = [];
  }

  createChat(participants: string[], chatId: string) {
    const participantSockets = this.users.filter((user) =>
      participants.find((id) => id === user.userId),
    );
    const chat = new Chat(participants, chatId);
    this.chats.push(chat);

    participantSockets.forEach((user) => {
      socketManager.addUser(user, chat.chatId);
    });
  }
  addParticipant(userId: string, chatId: string) {
    const user = this.users.find(user => user.userId === userId);
    if(!user){
      console.log("user not found");
      return;
    }
    socketManager.addUser(user, chatId);
  }

  removeChat(chatId: string) {
    this.chats = this.chats.filter((chat) => chat.chatId !== chatId);
  }

  removeUser(socket: WebSocket) {
    const user = this.users.find((user) => user.socket === socket);
    if (!user) {
      console.log("user not found");
      return;
    }
    this.users = this.users.filter((user) => user.socket !== socket);
    socketManager.removeUser(user.userId);
  }

  handleMessage(user: User) {
    user.socket.on("message", (data) => {
      const message = JSON.parse(data.toString());

      if (message.type === ChatMessages.TYPING_EVENT) {
      }
      if (message.type === ChatMessages.STOP_TYPING_EVENT) {
      }

      if (message.type === ChatMessages.JOIN_CHAT_EVENT) {
      }
    });
  }
  addUser(user: User) {
    this.users.push(user);
    this.handleMessage(user);
  }
}
