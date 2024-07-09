import { Router } from "express";
import { 
    enrollCourses, getEnroll, specificEnrollment
} from "../controllers/enroll.controller.js";
const router = Router();
import {verifyAuth} from "../middlewares/auth.middleware.js"
import {verifyAdmin} from "../middlewares/auth.middleware.js"



 router.route("/student/enroll").post(verifyAuth, enrollCourses); 
 router.route("/admin/get/enroll").get(verifyAuth, verifyAdmin, getEnroll); 
 router.route("/student/specific_enrollment/:id").get(verifyAuth, specificEnrollment); 



export default router;
