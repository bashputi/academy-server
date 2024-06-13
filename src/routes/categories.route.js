import { Router } from "express";
import { addcategory, allCourses, deleteCourses } from "../controllers/categories.controller.js";
const router = Router();
import {verifyAuth} from "../middlewares/auth.middleware.js"
import {verifyInstructor} from "../middlewares/auth.middleware.js"
import {verifyAdmin} from "../middlewares/auth.middleware.js"


 router.route("/category").post(verifyAuth, addcategory); 
 router.route("/all_categories").get(allCourses); 
 router.route("/delete_categories/:id").get( deleteCourses); 


 

export default router;
