import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";
import { ChatMessage } from "../models/message.model";
import { asyncHandler } from "../utils/asyncHandler";
import { Chat } from "../models/chat.model";


const getAllMessages = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const isChatCreated = await Chat.findById(chatId);

    if (!isChatCreated) {
        throw new ApiError(400, "chat doesn't exist");
    }

    if (!isChatCreated.participants.includes(req.user._id.toString())) {
        throw new ApiError(401, "you are not a part of the chat");
    }

    const messages = await ChatMessage.aggregate([
        {
            $match: {
                chat: isChatCreated._id,
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "sender",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                            email: 1,
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                sender: { $first: "$sender" },
            }
        },
        {
            $sort: {
                createdAt: -1,
            }
        }
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, messages[0], "messages fetched successfully"))
})

const sendMessage = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const { content } = req.body;
    const isChatCreated = await Chat.findById(chatId);

    if (!isChatCreated) {
        throw new ApiError(400, "chat doesn't exist");
    }

    if (!isChatCreated.participants.includes(req.user._id.toString())) {
        throw new ApiError(401, "you are not a part of the chat");
    }

    const message = await ChatMessage.create({
        sender: req.user._id,
        content,
        chat: isChatCreated._id,
    });

    const chat = await Chat.findByIdAndUpdate(isChatCreated,
        {
            $set: {
                lastMessage: message._id,
            }
        },
        {
            $new: true,
        }
    );

    const messageAggregate = await ChatMessage.aggregate([
        {
            $match: {
                _id: message._id,
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "sender",
                pipeline: [
                    {
                        $project: {
                            email: 1,
                            avatar: 1,
                            username: 1,
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                sender: { $first: "$sender" },
            }
        }
    ]);

    if (messageAggregate.length < 1) {
        throw new ApiError(500, "Internal server Error");
    }
    //handle send message socket event

    return res
        .status(200)
        .json(new ApiResponse(200, messageAggregate[0], "message send successfully"));
});

const deleteMessage = asyncHandler(async (req, res) => {
    const { chatId, messageId } = req.params;

    const chat = await Chat.findOne({
        _id: chatId,
        participants: req.user?._id,
    });
    
    if (!chat) {
        throw new ApiError(401, "Chat doesn't exist");
    }
    const message = await ChatMessage.findById(messageId);
    if (!message) {
        throw new ApiError(400, "message doesn't exist");
    }

    if (message.sender !== req.user._id) {
        throw new ApiError(401, "you cannot delete other messages");
    }

    await ChatMessage.deleteOne(message._id);

    if (chat.lastMessage === message._id) {
        const lastMessage = await ChatMessage.findOne(
            { chat: chat._id },
            { sort: { createdAt: -1 } },
        );

        await Chat.findByIdAndUpdate(chat._id,
            {
                lastMessage: lastMessage ? lastMessage._id : null,
            }
        );
    }

    //handle socket event for message deletion

    return res
        .status(200)
        .json(new ApiResponse(200, message, "message deleted successfully"));

});

export {
    getAllMessages, deleteMessage, sendMessage
}