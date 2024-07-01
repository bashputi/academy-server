import { Router } from "express";
import { 
    enrollCourses, getEnroll, specificEnrollment
} from "../controllers/enroll.controller.js";
const router = Router();
import {verifyAuth} from "../middlewares/auth.middleware.js"
import {verifyInstructor} from "../middlewares/auth.middleware.js"



 router.route("/enroll").post( enrollCourses); 
 router.route("/get/enroll").get( getEnroll); 
 router.route("/specific_enrollment/:id").get( specificEnrollment); 



export default router;
