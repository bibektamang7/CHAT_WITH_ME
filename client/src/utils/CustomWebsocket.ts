// utils/CustomWebsocket.ts
WebSocket.prototype.listen = function (event: string, callback: (data: any) => void) {
  this._socketListeners = this._socketListeners || {};
  this._socketListeners[event] = this._socketListeners[event] || [];
  this._socketListeners[event].push(callback);

};

export class CustomWebsocket {
  private ws: WebSocket;

  constructor(url: string) {
    this.ws = new WebSocket(url);
  }

  emit(event: string, data?: any) {
    this.ws.send(JSON.stringify({ event, data }));
  }

  listen(event: string, callback: (data: any) => void) {
    this.ws.listen(event, callback);
  }

}
