import express from "express";
import memberRouter from "./data/member.route.js";
import depositRouter from "./data/deposit.route.js";

const dataRouter = express();

dataRouter.use("/member", memberRouter);
dataRouter.use("/deposit", depositRouter);

export default dataRouter;