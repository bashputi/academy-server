import { Router } from "express";
import { profile, image, coverimage, profileimage, resetPassword, socialProfile} from "../controllers/settings.controller.js";
const router = Router();


 router.route("/profile/:id").patch(profile);
 router.route("/image/:id").patch(image);
 router.route("/coverpic/:id").delete(coverimage);
 router.route("/profilepic/:id").delete(profileimage);
 router.route("/resetpassword/:id").patch(resetPassword);
 router.route("/socialProfile/:id").patch(socialProfile);



export default router;