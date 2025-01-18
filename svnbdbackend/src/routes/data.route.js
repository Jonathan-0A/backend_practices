import express from "express";
import memberRouter from "./data/member.route.js";

const dataRouter = express();

dataRouter.use("/member", memberRouter);

export default dataRouter;