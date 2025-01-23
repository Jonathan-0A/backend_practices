import { Router } from "express";
import { getMembersLength, getMemberByName, getMemberById, addMember } from "../../controllers/data/member.controller.js";

const router = Router();

router.get("/get/count", getMembersLength);
router.get("/get/name/:name", getMemberByName);
router.get("/get/id/:id", getMemberById);
router.post("/post/add-new", addMember);

export default router;