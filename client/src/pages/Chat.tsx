import React from 'react'
import { Navigator } from './widgets/Navigator'
import { ChatMessage } from './widgets/ChatMessage'
import { Outlet } from 'react-router-dom'
const Chat = () => {
  return (
    <div className='w-full h-[100vh] max-h-[100vh] flex'>
      <Navigator/>
      <Outlet/>
      <ChatMessage/>
    </div>
  )
}

export default Chat