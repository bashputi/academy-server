import { Router } from "express";
import { addCategory, allCategories, specificCategories, editCategories, deleteCategory } from "../controllers/categories.controller.js";
const router = Router();
import {verifyAuth} from "../middlewares/auth.middleware.js"
import {verifyInstructor} from "../middlewares/auth.middleware.js"
import {verifyAdmin} from "../middlewares/auth.middleware.js"


 router.route("/admin/category").post(verifyAuth, verifyAdmin, addCategory); 
 router.route("/admin/all_categories").get(verifyAuth, verifyAdmin, allCategories); 
 router.route("/admin/category/:id").get(verifyAuth, verifyAdmin, specificCategories); 
 router.route("/admin/edit_categories/:id").patch(verifyAuth, verifyAdmin, editCategories); 
 router.route("/admin/delete_categories/:id").delete(verifyAuth, verifyAdmin, deleteCategory); 


 

export default router;
