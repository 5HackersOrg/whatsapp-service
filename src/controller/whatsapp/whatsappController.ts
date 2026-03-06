import type { Request, Response } from "express";
import { handleIncomingMessage } from "../../services/twillio/whatsappRouteHandler.js";
import dotenv from "dotenv";
dotenv.config();

export const whatsappController = async (req: Request, res: Response) => {
  const value = req.body?.entry?.[0]?.changes?.[0]?.value;
  res.sendStatus(200);
  if (value?.messages) {
    await handleIncomingMessage(req.body);
  }

  if (value?.statuses) {
    // console.log("Status update received",value);
  }
};

export const whatsappControllerGET = async (req: Request, res: Response) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  console.log(req.query);

  // Set this to match what you enter in Meta's dashboard
  const VERIFY_TOKEN =
    process.env.WHATSAPP_VERIFY_TOKEN || "your_verify_token_here";
  console.log("token in env : ", VERIFY_TOKEN);

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified successfully");
    return res.status(200).send(challenge);
  } else {
    console.log("Webhook verification failed");
    return res.sendStatus(403);
  }
  console.log("revcied hit ");
  // const { From, Body } = req.body;
  // console.log(req.body);
  // const phoneNumber = From?.replace("whatsapp:", "") || "";
  // const message = Body || "";

  // console.log(`Received message from ${phoneNumber}: ${message}`);
  // res.status(200).json({ message: "processed" });
  // await handleIncomingMessage(req.body);
};
