export const DB_NAME = "ChatWithMe";

export const UserRolesEnum = {
  ADMIN: "ADMIN",
  USER: "USER",
};


export const AvailableUserRoles = Object.values(UserRolesEnum);

export const USER_TEMPORARY_TOKEN_EXPIRY = 20 * 60 * 1000; // 20 minutes

export const ChatEventEnum = Object.freeze({
  // once user is ready to go
  CONNECTED_EVENT : "connected",
  DISCONNECT_EVENT : "disconnect",
  JOIN_CHAT_EVENT : "joinChat",
  LEAVE_CHAT_EVENT : "leaveChat",
  UPDATE_GROUP_NAME_EVENT : "updateGroupName",
  MESSAGE_RECEIVED_EVENT : "messageReveived",
  NEW_CHAT_EVENT : "newChat",
  SOCKET_ERROR_EVENT : "socketError",
  STOP_TYPING_EVENT : "stopTyping",
  TYPING_EVENT : "typing",
  MESSAGE_DELETE_EVENT : "messageDeleted",
})

