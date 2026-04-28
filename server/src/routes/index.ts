import { Router, type IRouter } from "express";
import healthRouter from "./health";
import academyRouter from "./academy";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/academy", academyRouter);

export default router;
