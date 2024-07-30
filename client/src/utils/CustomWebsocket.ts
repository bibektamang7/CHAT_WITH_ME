type EventHandler = (...args: any[]) => void;
type EventHandlers = { [event: string]: EventHandler[] };


export class CustomWebsocket{
    private ws: WebSocket;
  private eventHandlers: EventHandlers = {};

  constructor(url: string) {
    this.ws = new WebSocket(url);

    this.ws.onmessage = (message) => {
      this.handleMessage(message);
    };

    this.ws.onopen = () => {
      this.triggerEvent('connected');
    };

    this.ws.onclose = () => {
      this.triggerEvent('disconnect');
    };

    this.ws.onerror = (error) => {
      this.triggerEvent('error', error);
    };
  }

  private handleMessage(message: MessageEvent) {
    try {
      const { event, data } = JSON.parse(message.data);
      this.triggerEvent(event, data);
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  private triggerEvent(event: string, ...args: any[]) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].forEach(handler => handler(...args));
    }
  }

  public on(event: string, handler: EventHandler) {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(handler);
  }

  public off(event: string, handler: EventHandler) {
    if (!this.eventHandlers[event]) return;

    this.eventHandlers[event] = this.eventHandlers[event].filter(h => h !== handler);
  }

  public emit(event: string, data: any) {
    const message = JSON.stringify({ event, data });
    this.ws.send(message);
  }

  public close() {
    this.ws.close();
  }
}