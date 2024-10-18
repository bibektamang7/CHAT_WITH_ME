import WebSocket from "ws";

export class User {
  public socket: WebSocket;
  public userId: string;

  constructor(socket: WebSocket, userId: string) {
    this.socket = socket;
    this.userId = userId;
  }
}

export class SocketManager {
  private interestedSockets: Map<string, User[]>;
  private userRoomMapping: Map<string, string>;
  static instance: SocketManager;

  constructor() {
    this.interestedSockets = new Map();
    this.userRoomMapping = new Map();
  }

  static getInstance() {
    if (SocketManager.instance) {
      return SocketManager.instance;
    }
    SocketManager.instance = new SocketManager();
    return SocketManager.instance;
  }

  addUser(user: User, roomId: string) {
    this.interestedSockets.set(roomId, [
      ...(this.interestedSockets.get(roomId) || []),
      user,
    ]);
    this.userRoomMapping.set(user.userId, roomId);
  }

  getRoomId(userId: string): string | undefined {
    return this.userRoomMapping.get(userId);
  }

  broadcast(roomId: string, message: string) {
    const users = this.interestedSockets.get(roomId);

    if (!users) {
      console.error("No users in the room!");
      return;
    }

    users.forEach((user) => {
      user.socket.send(message);
    });
  }

  removeUser(userId: string) {
    const roomId = this.userRoomMapping.get(userId);
    if (!roomId) {
      console.error("User was not interested in any room?");
      return;
    }

    const room = this.interestedSockets.get(roomId) || [];
    const remainingUsers = room.filter(
      (u: User): boolean => u.userId !== userId,
    );
    this.interestedSockets.set(roomId, remainingUsers);
    if (this.interestedSockets.get(roomId)?.length === 0) {
      this.interestedSockets.delete(roomId);
    }
    this.userRoomMapping.delete(userId);
  }
}

export const socketManager = SocketManager.getInstance();
