import { ChatMessageInterface } from "@/interfaces/chat";
import { classNames } from "@/utils";
import React, { useState } from "react";

const MessageItem: React.FC<{
  isOwnMessage: boolean;
  isGroupChatMessage: boolean;
  message: ChatMessageInterface;
  deleteChatMessage: (message: ChatMessageInterface) => void;
}> = ({ isOwnMessage, isGroupChatMessage, message, deleteChatMessage }) => {
  const [openOptions, setopenOptions] = useState<boolean>(false);

  return (
    <>
      <div
        className={classNames(
          "flex justify-start items-end gap-3 max-w-lg min-w-",
          isOwnMessage ? "ml-auto" : ""
        )}
      >
        <img
          src={message.sender?.avatar?.url}
          className={classNames(
            "h-7 w-7 object-cover rounded-full flex flex-shrink-0",
            isOwnMessage ? "order-2" : "order-1"
          )}
        />
      </div>
      <div
        onMouseLeave={() => setopenOptions(false)}
        className={classNames(
          " p-4 rounded-3xl flex flex-col cursor-pointer group hover:bg-secondary",
          isOwnMessage
            ? "order-1 rounded-br-none bg-primary"
            : "order-2 rounded-bl-none bg-secondary"
        )}
      >
        {message.content ? (
          <div className="relative flex justify-between">
            {/* The option to delete message will only open in case of own messages */}
            {isOwnMessage ? (
              <button
                onClick={() => setopenOptions(!openOptions)}
                className="self-center relative options-button"
                          >
                              
                              
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </>
  );
};

export default MessageItem;
