import { Router } from "express";
import { addAnnouncement, announc } from "../controllers/announcement.controller.js";
const router = Router();


 router.route("/announcement").post(addAnnouncement); 
 router.route("/wish/:course_name").get(announc); 

 

export default router;