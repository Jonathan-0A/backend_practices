import { Router } from "express";
import {
    getMembersLength,
    getMemberByName,
    getMemberById,
    getMemberByFc,
    addMember,
    // updateMember,
    // deleteMember
} from "../../controllers/data/member.controller.js";

const router = Router();

router.get("/get/count", getMembersLength);
router.get("/get/name/:name", getMemberByName);
router.get("/get/id/:id", getMemberById);
router.get("/get/fc_no/:fc_no", getMemberByFc);
router.post("/post/add-new", addMember);
// router.put("/put/update/:id", updateMember);
// router.delete("/delete/remove/:id", deleteMember);

export default router;