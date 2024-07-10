import { Router } from "express";
import { course, allCourses, specificCourses, coursesByCategory,
    deleteCourses, editCourses, statusCourses,
  
} from "../controllers/courses.controller.js";
const router = Router();
import {verifyAuth} from "../middlewares/auth.middleware.js"
import {verifyInstructor} from "../middlewares/auth.middleware.js"
import {verifyAdmin} from "../middlewares/auth.middleware.js"


 router.route("/addcourse").post( course); 
 router.route("/getcourses").get(verifyAuth, allCourses); 
 router.route("/specific_courses/:id").get( specificCourses); 
 router.route("/category_course").get(coursesByCategory); 
 router.route("/delete_courses/:id").delete(verifyAuth, deleteCourses); 
 router.route("/edit_course/:id").patch(verifyAuth, verifyInstructor, editCourses); 
 router.route("/status_course/:id").patch(verifyAuth, verifyAdmin, statusCourses); 



export default router;
