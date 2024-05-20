import { Router } from "express";
import {  appication, instructor, instructorRequest} from "../controllers/instructor.controller.js";
const router = Router();


 router.route("/:id").patch(appication);
 router.route("/instructor/appicator").get(instructor);
 router.route("/instructorRequest/:id").patch(instructorRequest);



export default router;