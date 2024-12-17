import { Router } from "express";
import { checkUsername } from "../controllers/user.controller.js";

const router = Router();

router.route("/username/:username").get(checkUsername)

export default router