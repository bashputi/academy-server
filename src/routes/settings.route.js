import { Router } from "express";
import { profile, image, coverimage, profileimage, resetPassword, socialProfile} from "../controllers/settings.controller.js";
const router = Router();
import {verifyAuth} from "../middlewares/auth.middleware.js"


 router.route("/profile/:id").patch(verifyAuth, profile);
 router.route("/image/:id").patch(verifyAuth, image);
 router.route("/cover_image/:id").delete(verifyAuth, coverimage);
 router.route("/profile_image/:id").delete(verifyAuth, profileimage);
 router.route("/reset_password/:id").patch(verifyAuth, resetPassword);
 router.route("/social_profile/:id").patch(verifyAuth, socialProfile);



export default router;