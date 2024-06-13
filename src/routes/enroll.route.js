import { Router } from "express";
import { 
    enrollCourses, getEnroll, specificEnrollment
} from "../controllers/enroll.controller.js";
const router = Router();
import {verifyAuth} from "../middlewares/auth.middleware.js"
import {verifyInstructor} from "../middlewares/auth.middleware.js"



 router.route("/enroll").post(verifyAuth, enrollCourses); 
 router.route("/get/enroll").get(verifyAuth, getEnroll); 
 router.route("/specific_enrollment/:id").get(verifyAuth, specificEnrollment); 



export default router;
