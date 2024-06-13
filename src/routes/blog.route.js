import { Router } from "express";
import { addBlog, specificBlog, allBlog } from "../controllers/blog.controller.js";
const router = Router();
import {verifyAuth} from "../middlewares/auth.middleware.js"
import {verifyInstructor} from "../middlewares/auth.middleware.js"
import {verifyAdmin} from "../middlewares/auth.middleware.js"




 router.route("/blog").post(verifyAuth, addBlog); 
 router.route("/getblog").get( allBlog); 
 router.route("/specificBlog/:id").get(specificBlog); 

 

export default router;