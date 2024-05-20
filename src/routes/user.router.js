import { Router } from "express";
import { registerUser, login, verifyOtp, socialLogin, students, user, } from "../controllers/user.controller.js";
const router = Router();



 router.route("/register").post(registerUser);
 router.route("/login").patch(login);
 router.route("/verify-otp").post(verifyOtp);
 router.route("/social-login").post(socialLogin);
 router.route("/students").get(students);
 router.route("/:id").get(user);








export default router;