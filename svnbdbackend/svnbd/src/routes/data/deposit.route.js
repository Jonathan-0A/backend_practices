import { Router } from "express";
import {
    getDepositsLength,
    getDepositByName,
    getDepositById,
    getDepositByFc,
    addDeposit,
    exportDeposit,
    updateDeposit,
    deleteDeposit,
    getExportedDeposits
} from "../../controllers/data/deposit.controller.js";

const router = Router();

router.get("/get/count", getDepositsLength);
router.get("/get/name/:name", getDepositByName);
router.get("/get/id/:id", getDepositById);
router.get("/get/fc_no/:fc", getDepositByFc);
router.get("/get/exports", getExportedDeposits);
router.post("/post/add-new", addDeposit);
router.post("/post/export/:id", exportDeposit);
router.put("/put/update/:id", updateDeposit);
router.delete("/delete/remove/:id", deleteDeposit);

export default router;