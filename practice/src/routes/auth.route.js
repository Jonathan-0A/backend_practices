import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { multerUpload } from "../middlewares/multer.middleware.js"

const router = Router();

router.route("/register").post(
    multerUpload.fields([
        { name: "avatarImage", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    registerUser
)
router.route("/login").post(loginUser)

export default router