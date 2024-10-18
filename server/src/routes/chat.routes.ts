import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares";
import {
    renameGroupChat,
    getAllChats,
    removeUserFromGroupChat,
    addNewParticipantInGroupChat,
    deleteGroupChat,
    deleteOneToOneChat,
    createGroupChat,
    leaveGroupChat,
    createOneToOneChat,
    getChat
 } from "../controllers/chat.controller";
const router = Router();
router.use(verifyJWT);
router.route("/").get(getAllChats);
router.route("/renameGroupChat/:chatId").patch(renameGroupChat);
router.route("/remove/:chatId").delete(deleteOneToOneChat);
router.route("/group/:chatId/:userId").post(addNewParticipantInGroupChat).delete(removeUserFromGroupChat);
router.route("/leave/group/:chatId").delete(leaveGroupChat);
router.route("/group/:chatId").patch(renameGroupChat).delete(deleteGroupChat);
router.route("/group").post(createGroupChat);
router.route("/c/:participant").post(createOneToOneChat);
router.route("/getChat/:chatId").get(getChat);


export default router;
