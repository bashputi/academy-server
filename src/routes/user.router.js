import { Router } from "express";
import { registerUser, login, verifyOtp,
    socialLogin, students, user, forgetPassword,
    changePassword, 

 } from "../controllers/user.controller.js";
const router = Router();



 router.route("/register").post(registerUser);
 router.route("/login").patch(login);
 router.route("/verify-otp").post(verifyOtp);
 router.route("/social-login").post(socialLogin);
 router.route("/forget-password").get(forgetPassword);
 router.route("/change-password").patch(changePassword);
 router.route("/students").get(students);
 router.route("/:id").get(user);








export default router;