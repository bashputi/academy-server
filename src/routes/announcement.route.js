import { Router } from "express";
import { addAnnouncement, announc, specificAnnouncement } from "../controllers/announcement.controller.js";
const router = Router();


 router.route("/announcement").post(addAnnouncement); 
 router.route("/announcement/:course_name").get(announc); 
 router.route("/announcement/:id").get(specificAnnouncement); 

 

export default router;