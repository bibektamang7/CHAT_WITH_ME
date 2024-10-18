import MessageItem from "@/components/chat/MessageItem";
import { ChatListItemInterface, ChatMessageInterface } from "@/interfaces/chat";
import { UserInterface } from "@/interfaces/user";
import { classNames } from "@/utils";
import React from "react";
const ChatMessage: React.FC<{
  user: UserInterface;
  currentChat?: ChatListItemInterface;
  messages: ChatMessageInterface[];
  deleteChatMessage: (message: ChatMessageInterface) => Promise<void>;
}> = ({ currentChat, messages, user, deleteChatMessage }) => {
  console.log(currentChat);

  return (
    <div className="w-full">
      <div className="p-7">
        {currentChat?._id ? (
          <>
            <div
              className={classNames(
                "p-8 overflow-y-auto flex flex-col-reverse gap-6 w-full",
              )}
              id="message-window"
            >
              <>
                {messages?.map((message) => {
                  return (
                    <MessageItem
                      key={message._id}
                      isOwnMessage={message.sender?._id === user?._id}
                      isGroupChatMessage={currentChat.isGroupChat}
                      message={message}
                      deleteChatMessage={deleteChatMessage}
                    />
                  );
                })}
              </>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            No chat selected
          </div>
        )}
      </div>
    </div>
  );
};

export { ChatMessage };
