import { Router } from "express";
import { addWish,
    
} from "../controllers/wishlist.controller.js";
const router = Router();


 router.route("/wishlist").post(addWish); 




export default router;
