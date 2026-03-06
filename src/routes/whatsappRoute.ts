import { Router } from "express";
import {
  whatsappController,
  whatsappControllerGET,


} from "../controller/whatsapp/whatsappController.js";
const router = Router();
router.post("/whatsapp/message", whatsappController);
router.get("/whatsapp/message", whatsappControllerGET);
// router.post("/whatsapp/flow/side-gig-posting", WhatsappSideGigFlowEndpoint);

export default router;
