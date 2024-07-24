import React from 'react'
import { Navigator } from './widgets/Navigator'
import { UserMessages } from './widgets/UserMessages'
import { ChatMessage } from './widgets/ChatMessage'
function Chat() {
  return (
    <div className='w-full h-[100%] max-h-[100vh] flex'>
      <Navigator/>
      <UserMessages/>
      <ChatMessage/>
    </div>
  )
}

export default Chat