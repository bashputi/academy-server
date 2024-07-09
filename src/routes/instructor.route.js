import { Router } from "express";
import {  application, instructor, instructorRequest} from "../controllers/instructor.controller.js";
const router = Router();
import {verifyAuth} from "../middlewares/auth.middleware.js"
import {verifyAdmin} from "../middlewares/auth.middleware.js"

 router.route("/user/:id").patch(verifyAuth, application);
 router.route("/admin/instructors").get(verifyAuth, verifyAdmin, instructor);
 router.route("/admin/instructor_request/:id").patch(verifyAuth, verifyAdmin, instructorRequest);



export default router;