import { Router } from "express";
import { addAnnouncement, specificWishlist } from "../controllers/announcement.controller.js";
const router = Router();


 router.route("/announcement").post(addAnnouncement); 
 router.route("/wish/:id").get(specificWishlist); 

 

export default router;