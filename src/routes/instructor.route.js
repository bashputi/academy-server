import { Router } from "express";
import {  appication, instructor, instructorRequest} from "../controllers/instructor.controller.js";
const router = Router();
import {verifyAuth} from "../middlewares/auth.middleware.js"
import {verifyInstructor} from "../middlewares/auth.middleware.js"

 router.route("/:id").patch(verifyAuth, appication);
 router.route("/instructors").get( instructor);
 router.route("/instructorRequest/:id").patch( instructorRequest);



export default router;