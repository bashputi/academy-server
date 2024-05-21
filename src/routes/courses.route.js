import { Router } from "express";
import { course, allCourses, specificCourses,
    deleteCourses, editCourses, statusCourses,
  
} from "../controllers/courses.controller.js";
const router = Router();


 router.route("/addcourse").post(course); 
 router.route("/getcourses").get(allCourses); 
 router.route("/specificCourses/:id").get(specificCourses); 
 router.route("/deletecourses/:id").delete(deleteCourses); 
 router.route("/editcourse/:id").patch(editCourses); 
 router.route("/statuscourse/:id").patch(statusCourses); 



export default router;
