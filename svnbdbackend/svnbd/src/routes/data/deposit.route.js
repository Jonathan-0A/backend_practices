import { Router } from "express";
import {
    getDepositsLength,
    getDepositByName,
    getDepositById,
    getDepositByFc,
    addDeposit,
    updateDeposit,
    deleteDeposit,
} from "../../controllers/data/deposit.controller.js";
import {
    exportDeposit,
    getExportedDeposits,
    getExportedDepositsCount
} from "../../controllers/data/exportDeposit.controller.js";

const router = Router();

router.get("/get/count", getDepositsLength);
router.get("/get/name/:name", getDepositByName);
router.get("/get/id/:id", getDepositById);
router.get("/get/fc_no/:fc", getDepositByFc);
router.get("/get/exports/:table/all", getExportedDeposits);
router.get("/get/exports/:table/count", getExportedDepositsCount);
router.post("/post/add-new", addDeposit);
router.post("/post/export", exportDeposit);
router.put("/put/update/:id", updateDeposit);
router.delete("/delete/remove/:id", deleteDeposit);

export default router;