import { Router } from "express";
import { addWish, specificWishlist } from "../controllers/wishlist.controller.js";
const router = Router();


 router.route("/wishlist").post(addWish); 
 router.route("/wish/:id").get(specificWishlist); 

 

export default router;
