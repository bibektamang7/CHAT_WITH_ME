import WebSocket from "ws"
import { CONNECTED_EVENT, DISCONNECT_EVENT, JOIN_CHAT_EVENT, LEAVE_CHAT_EVENT, MESSAGE_RECEIVED_EVENT } from "./messages";


export class User{
  public socket:WebSocket;
  public userId:string;
  public name:string;

  constructor(socket:WebSocket,userId: string, name: string){
    this.socket = socket;
    this.userId = userId;
    this.name = name;
  }
} 

export class SocketManager{
  private interestedSockets: Map<string, User[]>;
  private userRoomMapping: Map<string,string>;
  static instance:SocketManager

  constructor(){
    this.interestedSockets = new Map();
    this.userRoomMapping = new Map();
  }

  static getInstance() {
    if(SocketManager.instance){
      return SocketManager.instance;
    }
    SocketManager.instance = new SocketManager();
    return SocketManager.instance;
  }

  addUser(user:User,roomId:string){
    this.interestedSockets.set(roomId, [
      ...(this.interestedSockets.get(roomId) || []),
      user,
    ]);
    this.userRoomMapping.set(user.userId,roomId);
  }

  getRoomId(userId: string): string | undefined {
    return this.userRoomMapping.get(userId);
  }

  broadcast(roomId:string,message:any){ 
    const users = this.interestedSockets.get(roomId);

    if(!users){
      console.error('No users in the room!');
      return;
    }

    users.forEach((user) => {
      user.socket.send(message);
    });
  }

  removeUser(user:User){
    const roomId = this.userRoomMapping.get(user.userId);
    if(!roomId){
      console.error('User was not interested in any room?');
      return;
    }

    const room = this.interestedSockets.get(roomId) || [];
    const remainingUsers = room.filter((u:User):boolean => u.userId !== user.userId);
    this.interestedSockets.set(roomId,remainingUsers);
    if(this.interestedSockets.get(roomId)?.length === 0){
      this.interestedSockets.delete(roomId);
    }
    this.userRoomMapping.delete(user.userId);
  }

  handleEvent(event: string, user: User, data?: any) {
    switch (event) {
      case CONNECTED_EVENT:
        console.log(`${user.userId} connected.`);
        break;
      case DISCONNECT_EVENT:
        this.removeUser(user);
        console.log(`${user.userId} disconnected.`);
        break;
      case JOIN_CHAT_EVENT:
        if (data && data.roomId) {
          this.addUser(user, data.roomId);
          console.log(`${user.userId} joined room ${data.roomId}.`);
        }
        break;
      case LEAVE_CHAT_EVENT:
        this.removeUser(user);
        console.log(`${user.userId} left the chat.`);
        break;
      case MESSAGE_RECEIVED_EVENT:
        if (data && data.roomId && data.message) {
          this.broadcast(data.roomId, data.message);
          console.log(`Message from ${user.userId} in room ${data.roomId}: ${data.message}`);
        }
        break;
      default:
        console.error(`Unknown event: ${event}`);
    }
  }

}

export const socketManager = SocketManager.getInstance();
