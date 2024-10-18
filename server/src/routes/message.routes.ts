import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares";
import {
    getAllMessages,
    deleteMessage,
    sendMessage,
 } from "../controllers/message.controller";
const router = Router();

router.use(verifyJWT);

router.route("/getAllMessages").get(getAllMessages);
router.route("/sendMessage/:chatId").post(sendMessage);
router.route("/deleteMessage/:chatId").delete(deleteMessage);

export default router;