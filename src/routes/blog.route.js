import { Router } from "express";
import { addBlog, specificBlog, allBlog } from "../controllers/blog.controller.js";
const router = Router();


 router.route("/blog").post(addBlog); 
 router.route("/getblog").get(allBlog); 
 router.route("/specificBlog/:id").get(specificBlog); 

 

export default router;