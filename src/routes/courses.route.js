import { Router } from "express";
import { course, allCourses} from "../controllers/courses.controller.js";
const router = Router();


 router.route("/addcourse").post(course); 
 router.route("/getcourses").get(allCourses); 




export default router;
