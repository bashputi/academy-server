import { Router } from "express";
import { addWish, specificWishlist } from "../controllers/wishlist.controller.js";
const router = Router();
import {verifyAuth} from "../middlewares/auth.middleware.js"
import {verifyAdmin} from "../middlewares/auth.middleware.js"

 router.route("/wishlist").post(addWish); 
 router.route("/wish/:id").get(specificWishlist); 

 

export default router;
