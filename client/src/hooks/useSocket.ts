import { useEffect, useState } from "react"

export const useSocket = (user:any) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    if(!user) return;
    const ws = new WebSocket('ws://localhost:8080');
    
    const emit = function(){
      
    }
  })
} 
