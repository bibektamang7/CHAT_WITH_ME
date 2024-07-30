import { Router } from "express";
import { login, logout, registerUser } from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middlewares";

const router = Router();


router.route("/register").post(registerUser);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT,logout);

export default router;