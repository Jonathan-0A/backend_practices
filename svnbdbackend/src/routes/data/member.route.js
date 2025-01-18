import { Router } from "express";
import { getMember } from "../../controllers/data/member.controller.js";

const router = Router();

router.get("/get", getMember);

export default router;