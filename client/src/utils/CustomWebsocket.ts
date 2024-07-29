// utils/CustomWebsocket.ts
// WebSocket.prototype.listen = function (event: string, callback: (data: any) => void) {
//   this._socketListeners = this._socketListeners || {};
//   this._socketListeners[event] = this._socketListeners[event] || [];
//   this._socketListeners[event].push(callback);

import { Socket } from "dgram";

// };


const CONNECTED_EVENT = "connected";
const DISCONNECT_EVENT = "disconnect";
const JOIN_CHAT_EVENT = "joinChat";
const LEAVE_CHAT_EVENT = "leaveChat";
const UPDATE_GROUP_NAME_EVENT = "updateGroupName";
const MESSAGE_RECEIVED_EVENT = "messageReveived";
const NEW_CHAT_EVENT = "newChat";
const SOCKET_ERROR_EVENT = "socketError";
const STOP_TYPING_EVENT = "stopTyping";
const TYPING_EVENT = "typing";
const MESSAGE_DELETE_EVENT = "messageDeleted";

export class CustomWebsocket {
  private ws: WebSocket;

  constructor(url: string) {
    this.ws = new WebSocket(url);
  }

  emit(event: string, data?: any) {
    this.ws.send(JSON.stringify({ event, data }));
  }

  listen() {
    this.ws.onmessage = (event) => {
      const {socketEvent, data} = JSON.parse(event.data);
      switch (socketEvent) {
        case CONNECTED_EVENT: {
          break;
        }
        case DISCONNECT_EVENT: {
          break;
        }
        case JOIN_CHAT_EVENT: {
          break;
        }
        case LEAVE_CHAT_EVENT: {
          break;
        }
        case UPDATE_GROUP_NAME_EVENT: {
          break;
        }
        case MESSAGE_RECEIVED_EVENT: {
          break;
        }
        case NEW_CHAT_EVENT: {
          break;
        }
        case SOCKET_ERROR_EVENT: {
          break;
        }
        case STOP_TYPING_EVENT: {
          break;
        }
        case MESSAGE_DELETE_EVENT: {
          break;
        }
        case TYPING_EVENT: {
          break;
        }
      }
    }
  }
}
