
import { Router } from "express";
import { profile} from "../controllers/settings.controller.js";
const router = Router();



 router.route("/profile/:id").patch(profile);








export default router;