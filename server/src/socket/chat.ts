import {randomUUID} from "crypto";
import { User } from "./socketManager";

export class Chat{

  public chatId: string;
  private participants: User[];
  constructor(participant: User[],chatId?:string) {
    this.participants = participant;
    this.chatId = chatId ?? randomUUID();
  }
  addUser(user:User){
    this.participants.push(user);
  }

  removeUser(user: User){
    this.participants = this.participants.filter(participant => participant !== user);
  }

  broadcast(message:string){
    this.participants.forEach(participant => participant.socket.send(message));
  }
}
