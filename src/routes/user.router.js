import { Router } from "express";
import { registerUser, login, verifyOtp,
    socialLogin, students, user, forgetPassword,
    changePassword, 

 } from "../controllers/user.controller.js";
const router = Router();
import {verifyAuth} from "../middlewares/auth.middleware.js"
import {verifyAdmin} from "../middlewares/auth.middleware.js"



 router.route("/user/register").post(registerUser);
 router.route("/user/login").patch(login);
 router.route("/user/verify-otp").post(verifyOtp);
 router.route("/user/social-login").post(socialLogin);
 router.route("/user/forget-password").post(forgetPassword);
 router.route("/user/change-password").patch(changePassword);
 router.route("/admin/students").get(verifyAuth, verifyAdmin, students);
 router.route("/admin/:id").get(verifyAuth, user);








export default router;