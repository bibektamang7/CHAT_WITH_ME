import { randomUUID } from "crypto";
import { socketManager } from "./socketManager";
import { ChatMessages } from "./messages";

export class Chat {
  public chatId: string;
  private participants: string[];
  constructor(participant: string[], chatId?: string) {
    this.participants = participant;
    this.chatId = chatId ?? randomUUID();
  }

  addParticipant(userId: string) {
    this.participants.push(userId);
  }

  deleteMessage(chatId: string, messageId: string) {
    socketManager.broadcast(
      chatId,
      JSON.stringify({
        type: ChatMessages.MESSAGE_DELETE_EVENT,
        payload: {
          chatId,
          messageId,
        },
      }),
    );
  }

  sendMessage(chatId: string, message: string) {
    socketManager.broadcast(
      chatId,
      JSON.stringify({
        type: ChatMessages.MESSAGE_RECEIVED_EVENT,
        payload: {
          message,
        },
      }),
    );
  }

  removeParticipant(userId: string) {
    this.participants = this.participants.filter((user) => user !== userId);
    socketManager.removeUser(userId);
  }
}
