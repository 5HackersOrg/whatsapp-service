import { Router } from "express";
import { viewController } from "../controller/view/viewController.js";
const router = Router();
router.get("/portfolio", viewController);

export default router;
