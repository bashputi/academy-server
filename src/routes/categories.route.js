import { Router } from "express";
import { addcategory, allCourses } from "../controllers/categories.controller.js";
const router = Router();


 router.route("/category").post(addcategory); 
 router.route("/all_categories").get(allCourses); 


 

export default router;
