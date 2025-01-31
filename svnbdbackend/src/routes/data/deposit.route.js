import { Router } from "express";
import {
    getDepositsLength,
    getDepositByName
} from "../../controllers/data/deposit.controller.js";

const router = Router();

router.get("/get/count", getDepositsLength);
router.get("/get/name/:name", getDepositByName);

export default router;