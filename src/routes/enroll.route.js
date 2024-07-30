import { Router } from "express";
import { 
    enrollCourses, getEnroll, specificEnrollment
} from "../controllers/enroll.controller.js";
const router = Router();
import {verifyAuth} from "../middlewares/auth.middleware.js"
import {verifyAdmin} from "../middlewares/auth.middleware.js"



 router.route("/student/enroll").post( enrollCourses); 
 router.route("/admin/get/enroll").get( getEnroll); 
 router.route("/student/specific_enrollment/:id").get( specificEnrollment); 



export default router;
