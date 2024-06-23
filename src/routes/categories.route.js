import { Router } from "express";
import { addcategory, allCourses, specificCategories, editCategories, deleteCourses } from "../controllers/categories.controller.js";
const router = Router();
import {verifyAuth} from "../middlewares/auth.middleware.js"
import {verifyInstructor} from "../middlewares/auth.middleware.js"
import {verifyAdmin} from "../middlewares/auth.middleware.js"


 router.route("/category").post(verifyAuth, addcategory); 
 router.route("/all_categories").get(allCourses); 
 router.route("/category/:id").get( specificCategories); 
 router.route("/edit_categories/:id").patch( editCategories); 
 router.route("/delete_categories/:id").get( deleteCourses); 


 

export default router;
