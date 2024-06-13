import { Router } from "express";
import { profile, image, coverimage, profileimage, resetPassword, socialProfile} from "../controllers/settings.controller.js";
const router = Router();
import {verifyAuth} from "../middlewares/auth.middleware.js"
import {verifyAdmin} from "../middlewares/auth.middleware.js"

 router.route("/profile/:id").patch(verifyAuth, profile);
 router.route("/image/:id").patch(verifyAuth, image);
 router.route("/coverpic/:id").delete(verifyAuth, coverimage);
 router.route("/profilepic/:id").delete(verifyAuth, profileimage);
 router.route("/resetpassword/:id").patch(verifyAuth, resetPassword);
 router.route("/socialProfile/:id").patch(verifyAuth, socialProfile);



export default router;