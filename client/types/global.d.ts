// global.d.ts
declare global {
  interface WebSocket {
    listen(event: string, callback: (data: any) => void): void;
    _socketListeners?: { [event: string]: ((data: any) => void)[] } | undefined;
  }
}

export {};
