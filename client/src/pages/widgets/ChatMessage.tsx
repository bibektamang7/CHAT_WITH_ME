import React from "react";
import { Avatar } from "@/components/Avatar";
const ChatMessage = () => {
    return <div className='w-full'>
        <div className="p-7">
            <div>
                <Avatar isOnline={false}/>
            </div>
        </div>
    </div>
}

export { ChatMessage };