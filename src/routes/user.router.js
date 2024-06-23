import { Router } from "express";
import { registerUser, login, verifyOtp,
    socialLogin, students, user, forgetPassword,
    changePassword, 

 } from "../controllers/user.controller.js";
const router = Router();
import {verifyAuth} from "../middlewares/auth.middleware.js"
import {verifyAdmin} from "../middlewares/auth.middleware.js"



 router.route("/register").post(registerUser);
 router.route("/login").patch(login);
 router.route("/verify-otp").post(verifyOtp);
 router.route("/social-login").post(socialLogin);
 router.route("/forget-password").post(forgetPassword);
 router.route("/change-password").patch(changePassword);
 router.route("/students").get( students);
 router.route("/:id").get(verifyAuth, user);








export default router;