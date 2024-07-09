import { Router } from "express";
import { addWish, specificWishlist } from "../controllers/wishlist.controller.js";
const router = Router();
import {verifyAuth} from "../middlewares/auth.middleware.js"
import {verifyAdmin} from "../middlewares/auth.middleware.js"

 router.route("/wishlist").post(verifyAuth, addWish); 
 router.route("/wish/:id").get(verifyAuth, specificWishlist); 

 

export default router;
