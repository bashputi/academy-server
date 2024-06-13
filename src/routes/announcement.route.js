import { Router } from "express";
import { addAnnouncement, announc, specificAnnouncement } from "../controllers/announcement.controller.js";
const router = Router();
import {verifyAuth} from "../middlewares/auth.middleware.js"
import {verifyInstructor} from "../middlewares/auth.middleware.js"
import {verifyAdmin} from "../middlewares/auth.middleware.js"



 router.route("/announcement").post(verifyAuth, addAnnouncement); 
 router.route("/announcement/:course_name").get(verifyAuth, announc); 
 router.route("/announcement/:id").get(verifyAuth, specificAnnouncement); 

 

export default router;