import { Router } from "express";
import { course, allCourses, specificCourses, coursesByCategory,
    deleteCourses, editCourses, statusCourses,
  
} from "../controllers/courses.controller.js";
const router = Router();
import {verifyAuth} from "../middlewares/auth.middleware.js"
import {verifyInstructor} from "../middlewares/auth.middleware.js"
import {verifyAdmin} from "../middlewares/auth.middleware.js"


 router.route("/addcourse").post( course); 
 router.route("/getcourses").get(allCourses); 
 router.route("/specificCourses/:id").get(verifyAuth, specificCourses); 
 router.route("/category_course").get(coursesByCategory); 
 router.route("/deletecourses/:id").delete(verifyAuth, deleteCourses); 
 router.route("/editcourse/:id").patch(verifyAuth, verifyInstructor, editCourses); 
 router.route("/statuscourse/:id").patch(verifyAuth, verifyAdmin, statusCourses); 



export default router;
