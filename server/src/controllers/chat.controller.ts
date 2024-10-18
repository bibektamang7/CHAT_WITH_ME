import { Chat } from "../models/chat.model";
import { User } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import ApiResponse from "../utils/apiResponse";
import { chatManager } from "../socket/index";
import ApiError from "../utils/apiError";
import { ChatMessage } from "../models/message.model";
import mongoose from "mongoose";

const renameGroupChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { newGroupChatName } = req.body;

  const groupChat = await Chat.findOne({
    _id: chatId,
    isGroupChat: true,
  });

  if (!groupChat) {
    throw new ApiError(404, "Group chat doesn't exist");
  }

  if (groupChat.admin?.toString() !== req.user._id.toString()) {
    throw new ApiError(401, "you are not an admin");
  }

  const updatedGroupChat = await Chat.findByIdAndUpdate(
    groupChat._id,
    {
      $set: {
        name: newGroupChatName,
      },
    },
    { $new: true }
  );

  const chat = await Chat.aggregate([
    {
      $match: {
        _id: updatedGroupChat?._id,
      },
    },
    //lookup for participants
    {
      $lookup: {
        from: "users",
        localField: "participants",
        foreignField: "_id",
        as: "participants",
        pipeline: [
          {
            $project: {
              password: 0,
              refreshToken: 0,
              forgotPasswordToken: 0,
              forgotPasswordExpiry: 0,
              emailVerificationToken: 0,
              emailVerificationExpiry: 0,
            },
          },
        ],
      },
    },
    //lookup of lastMessage
    {
      $lookup: {
        from: "chatmessages",
        localField: "lastMessage",
        foreignField: "_id",
        as: "lastMessage",
        pipeline: [
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
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              sender: {$first: "$sender"}
            },
          },
        ],
      },
    },
    {
      $addFields: {
        lastMessage: {
          $first: "$lastMessage",
        },
      },
    },
  ]);

  const chatDetails = chat[0];
  if (!chatDetails) {
    throw new ApiError(500, "Internal server Error");
  }
  //here logic to emit socket event

  return res
    .status(200)
    .json(new ApiResponse(200, chat[0], "Group chat updated successfully"));
});

const deleteAllChatMessages = async (chatId: string) => {
  const messages = await ChatMessage.find({
    chat: chatId,
  });

  //TODO: write logic to delete all attachments from the cloud services such as cloudinary

  await ChatMessage.deleteMany({
    chat: chatId,
  });

};

const deleteOneToOneChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  
  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new ApiError(404, "Chat doesn't exist");
  }

  await Chat.findByIdAndDelete(chatId);
  await deleteAllChatMessages(chatId);

  //logic to emit that the Chat has been deleted

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Chat deleted successfully"));

});

const deleteGroupChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const groupChat = await Chat.findOne({
    _id: chatId,
    isGroupChat: true,
  });

  if (!groupChat) {
    throw new ApiError(404, "Chat doesn't exist");
  }

  if (groupChat.admin?.toString() !== req.user._id.toString()) {
    throw new ApiError(400, "you are not an admin");
  }

  await Chat.findByIdAndDelete(chatId);
  await deleteAllChatMessages(chatId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Group chat deleted successfully"));
    ;
});

const createGroupChat = asyncHandler(async (req, res) => {
  const { chatName, participants } = req.body;

  if (participants.includes(req.user._id.toString())) {
    throw new ApiError(401, "participants array should not contain admin");
  }

  const groupParticipants = [...new Set([...participants, req.user._id.toString()])];
  if (groupParticipants.length < 3) {
    throw new ApiError(401, "Duplicate participants or less than 3 participants");
  }

  const groupChat = await Chat.create({
    name: chatName,
    participants: groupParticipants,
    admin: req.user._id,
    isGroupChat: true,
  });


  const chat = await Chat.aggregate([
    {
      $match: {
        _id: groupChat._id
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "participants",
        foreignField: "_id",
        as: "particiapants",
        pipeline: [
          {
            $project: {
              password: 0,
              refreshToken: 0,
              forgotPasswordToken: 0,
              forgotPasswordExpiry: 0,
              emailVerificationToken: 0,
              emailVerificationExpiry: 0,
            }
          }
        ]
      }
    },
  ]);

  const groupChatDetails = chat[0];

  if (!groupChatDetails) {
    throw new ApiError(500, "Internal server Error");
  }

  //logic to emit socket event for newChat

  return res
    .status(200)
    .json(new ApiResponse(200, groupChatDetails, "Group chat created successfully"));

});

const createOneToOneChat = asyncHandler(async (req, res) => {
  const { participant } = req.params;

  if (req.user._id.toString() === participant) {
    throw new ApiError(401, "you cannot create chat with yourself");
  }

  const participants = [participant, req.user._id];
  const isChatCreated = await Chat.findOne({
    participants,
  })
  if (isChatCreated) {
    throw new ApiError(400, "chat already created");
  }

  const oneToOneChat = await Chat.create({
    name: "one to one chat",
    participants,
    admin: req.user._id,
  });

  const chat = await Chat.aggregate([
    {
      $match: {
        _id: oneToOneChat._id,
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "participants",
        foreignField: "_id",
        as: "participants",
        pipeline: [
          {
            $project: {
              password: 0,
              refreshToken: 0,
              forgotPasswordToken: 0,
              forgotPasswordExpiry: 0,
              emailVerificationToken: 0,
              emailVerificationExpiry: 0,
            }
          }
        ]
      }
    }
  ]);

  const chatDetails = chat[0];
  if (!chatDetails) {
    throw new ApiError(500, "Internal server Error");
  }

  // logic to emit new one to one chat created


  return res
    .status(200)
    .json(new ApiResponse(200, chatDetails, "one to one chat created successfully"));

});

const getChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  
  const isChatCreated = await Chat.findById(chatId);

  if (!isChatCreated) {
    throw new ApiError(400, "chat is not created");
  }

  const chat = await Chat.aggregate([
    {
      $match: {
        _id: isChatCreated._id,
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "participants",
        foreignField: "_id",
        as: "participants",
        pipeline: [
          {
            $project: {
              password: 0,
              refreshToken: 0,
              forgotPasswordToken: 0,
              forgotPasswordExpiry: 0,
              emailVerificationToken: 0,
              emailVerificationExpiry: 0,
            }
          }
        ]
      }
    },
    {
      $lookup: {
        from: "chatmessages",
        localField: "lastMessage",
        foreignField: "_id",
        as: "lastMessage",
        pipeline: [
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
              sender: {$first : "$sender"}
            }
          }
        ]
      }
    },
    {
      $addFields: {
        lastMessage: {$first: "$lastMessage"},
      }
    }
  ]);

  const chatDetails = chat[0];
  console.log(chat);

  if (!chatDetails) {
    throw new ApiError(500, "Internal server Error");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, chatDetails));

})

const leaveGroupChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const isChatCreated = await Chat.findOne({
    _id: chatId,
    isGroupChat: true,
  });

  if (!isChatCreated) {
    throw new ApiError(401, "chat doesn't exist");
  }

  const currentParticipants = isChatCreated.participants;

  if (!currentParticipants.includes(req.user._id)) {
    throw new ApiError(401, "you are not a part of the chat");
  };



  const updatedGroupChat = await Chat.findByIdAndUpdate(chatId,
    {
      $pull: {
        participants: req.user._id,
      }
    },
    {
      $new: true,
    }
  );

  const chat = await Chat.aggregate([
    {
      $match: {
        _id: updatedGroupChat?._id,
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "participants",
        foreignField: "_id",
        as: "participants",
        pipeline: [
          {
            $project: {
              password: 0,
              refreshToken: 0,
              forgotPasswordToken: 0,
              forgotPasswordExpiry: 0,
              emailVerificationToken: 0,
              emailVerificationExpiry: 0,
            }
          }
        ]
      }
    },
    {
      $lookup: {
        from: "chatmessages",
        localField: "lastMessage",
        foreignField: "_id",
        as: "lastMessage",
        pipeline: [
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
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              sender: {
                $sender: "$sender",
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        lastMessage: {
          $first: "$lastMessage",
        },
      },
    },
  ]);

  const groupChatDetails = chat[0];

  if (!groupChatDetails) {
    throw new ApiError(500, "Internal server Error");
  }

  //logic to emit leave group chat event


  return res
    .status(200)
    .json(new ApiResponse(200, groupChatDetails, "left group successfully"));

});

const removeUserFromGroupChat = asyncHandler(async (req, res) => {
  const { userId, chatId } = req.params;
  const groupChat = await Chat.findOne({
    _id: chatId,
    isGroupChat: true,
  });

  if (!groupChat) {
    throw new ApiError(404, "Group chat does not exist");
  }

  if (groupChat.admin?.toString() !== req.user._id.toString()) {
    throw new ApiError(401, "you are not an admin");
  }
  const currentParticipants = groupChat.participants;

  if (!currentParticipants.includes(new mongoose.Types.ObjectId(userId))) {
    throw new ApiError(400, "Participant does not exist in the group chat");
  }
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: {
        participants: userId, // remove participant id
      },
    },
    { new: true }
  );
  //TODO: brainstrom about whether you need to aggregate in every controller or not
  // it can increase you network bandwidth
  // so have so thought about and then re-write it.


  // const chat = await Chat.aggregate([
  //   {
  //     $match: {
  //       _id: updatedChat?._id
  //     }
  //   },

  // ])

  // handle to emit socket event for user removable


  return res
    .status(200)
    .json(new ApiResponse(200, updatedChat, "participant remove successfully"));

});

const addNewParticipantInGroupChat = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.params;
  const groupChat = await Chat.findOne({
    _id: chatId,
    isGroupChat: true,
  });

  if (!groupChat) {
    throw new ApiError(404, "Group chat does not exist");
  }

  if (groupChat.admin?.toString() !== req.user._id.toString()) {
    throw new ApiError(401, "you are not an admin");
  }
  const currentParticipants = groupChat.participants;

  if (currentParticipants.includes(new mongoose.Types.ObjectId(userId))) {
    throw new ApiError(400, "Participant already exist in the group chat");
  }

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: {
        participants: userId, // remove participant id
      },
    },
    { new: true }
  );

  //handle to emit socket event


  return res
    .status(200)
    .json(new ApiResponse(200, updatedChat, "added participant successfully"));
});

const getAllChats = asyncHandler(async (req, res) => {
  const chats = await Chat.aggregate([
    {
      $match: {
        participants: { $elemMatch: { $eq: req.user._id } }, // get all chats that have logged in user as a participant
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "participants",
        foreignField: "_id",
        as: "participants",
        pipeline: [
          {
            $project: {
              password: 0,
              refreshToken: 0,
              forgotPasswordToken: 0,
              forgotPasswordExpiry: 0,
              emailVerificationToken: 0,
              emailVerificationExpiry: 0,
            }
          }
        ]
      }
    },
    {
      $lookup: {
        from: "chatmessages",
        localField: "lastMessage",
        foreignField: "_id",
        as: "lastMessage",
        pipeline: [
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
                    email: 1,
                    avatar: 1,
                  }
                }
              ]
            }
          },
          {
            $addFields: {
              sender: {$first: "$sender"},
            }
          }
        ]
      }
    },
    {
      $addFields: {
        lastMessage: {$first: "$lastMessage"}
      }
    },
    {
      $sort: {
        updatedAt: -1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, chats || [], "User chats fetched successfully!")
    );
});


export {
  renameGroupChat,
  getAllChats,
  removeUserFromGroupChat,
  addNewParticipantInGroupChat,
  deleteGroupChat,
  deleteOneToOneChat,
  createGroupChat,
  leaveGroupChat,
  createOneToOneChat,
  getChat,
};
