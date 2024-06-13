import { Router } from "express";
import { course, allCourses, specificCourses,
    deleteCourses, editCourses, statusCourses,
  
} from "../controllers/courses.controller.js";
const router = Router();
import {verifyAuth} from "../middlewares/auth.middleware.js"
import {verifyInstructor} from "../middlewares/auth.middleware.js"
import {verifyAdmin} from "../middlewares/auth.middleware.js"


 router.route("/addcourse").post(verifyAuth, verifyInstructor, course); 
 router.route("/getcourses").get(verifyAuth, verifyAdmin, allCourses); 
 router.route("/specificCourses/:id").get(verifyAuth, specificCourses); 
 router.route("/deletecourses/:id").delete(verifyAuth, deleteCourses); 
 router.route("/editcourse/:id").patch(verifyAuth, verifyInstructor, editCourses); 
 router.route("/statuscourse/:id").patch(verifyAuth, verifyAdmin, statusCourses); 



export default router;
