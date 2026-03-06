import { JobSeekerDb } from "../../repository/users/jobSeekers/JobSeekersDb.js";
import { UserSessionState } from "../../utils/enums/whatsapp/sessionState.js";
import {
  MESSAGES,
  sendWelcomeMessage,
} from "../../utils/enums/whatsapp/uiTextMessages.js";
import type { MessageInfo } from "../../utils/types/whatsapp/messages/messageTypes.js";
import { generateCustomerWindowTimeout } from "../../utils/whatsapp/isValidCustomerWindow.js";
import { stateHandlers } from "./whatappStateHelper.js";
import { sendWhatsAppMessage } from "./whatsappMessages/sendWhatsappMessage.js";

const jobSeekersDb = new JobSeekerDb();
interface HandlerParams {
  body: MessageInfo;
  user_email: string;
  password: string;
  customerWindowTimeout: string;
  user_otp: string;
  userId: string;
  ref_code: string;
  redeemded: boolean;
}
const extractMessageInfo = (body: any): MessageInfo | null => {
  const { entry } = body;
  const { changes } = entry[0];
  const { value } = changes[0];
  const { messages } = value;
  //console.log(messages);
  const message = messages[0];
  const from = message.from;

  switch (message.type) {
    case "text":
      return {
        type: "text",
        userPhoneNumber: from,
        info: message.text,
      };
    case "document":
      return {
        type: "document",
        userPhoneNumber: from,
        info: message.document,
      };
    case "image":
      return {
        type: "image",
        userPhoneNumber: from,
        info: message.image,
      };
    case "video":
      return {
        type: "video",
        userPhoneNumber: from,
        info: message.video,
      };
    case "audio":
      return {
        type: "audio",
        userPhoneNumber: from,
        info: message.audio,
      };
    case "location":
      return {
        type: "location",
        userPhoneNumber: from,
        info: message.location,
      };
    case "interactive":
      switch (message.interactive.type) {
        case "list_reply":
          return {
            type: "list_reply",
            info: {
              description: message.interactive.list_reply.description,
              id: message.interactive.list_reply.id,
              repliedToMessageId: message.context.id,
              title: message.interactive.list_reply.title,
            },
            userPhoneNumber: from,
          };

        case "button_reply":
          return {
            type: "button_reply",
            info: {
              id: message.interactive.button_reply.id,
              repliedToMessageId: message.context.id,
              title: message.interactive.button_reply.title,
            },
            userPhoneNumber: from,
          };
      }

    default:
      return null;
  }
};
const extractPhoneNumber = (body: any) => {
  const { entry } = body;
  const { changes } = entry[0];
  const { value } = changes[0];
  const { messages } = value;
  const message = messages[0];
  const from = message.from;
  return from as string;
};

export const handleIncomingMessage = async (body: any) => {
  const messsageInfo = extractMessageInfo(body);
  console.log(JSON.stringify(messsageInfo));
  const from = extractPhoneNumber(body);
  if (!messsageInfo) {
    await sendWhatsAppMessage(from, {
      type: "text",
      text: "unsupported Message ",
    });
    return;
  }
  const userState = await jobSeekersDb.getUserWhatsappState(from);
  let {
    state,
    password,
    email,
    otp,
    userId,
    referredCode,
    redeemded,
    customerServiceTimeout,
  } = userState;
  if (!state) {
    if (messsageInfo?.type !== "text") {
      await sendWhatsAppMessage(from, {
        type: "text",
        text: "really no hello nyana u just send me things aii ngeke ",
      });
      return;
    }
    const message = messsageInfo.info.body;
    const contains_ref_code = message.includes("referral");
    if (contains_ref_code) {
      const ref_code = message.split(" ").at(-1);
      referredCode = ref_code!;
    } else {
      referredCode = "";
    }
    await jobSeekersDb.updateUserWhatsappState(
      from,
      {
        customerServiceTimeout: generateCustomerWindowTimeout(),
        email,
        otp,
        password: password,
        redeemded: redeemded,
        referredCode,
        state: UserSessionState.ONBOARD_MENU,
        userId,
      },
      true,
    );
    await sendWelcomeMessage(from);
    return;
  }

  try {
    const handler = stateHandlers[state as UserSessionState];
    if (!handler) {
      console.error(`No handler defined for state: ${state}`);
      await sendWhatsAppMessage(from, {
        type: "text",
        text: "something wronghapped",
      });
      return;
    }
    await handler({
      body: messsageInfo,
      customerWindowTimeout: customerServiceTimeout,
      redeemded: redeemded,
      ref_code: referredCode,
      user_email: email,
      user_otp: otp,
      password: password,
      userId,
    } as HandlerParams);
  } catch (err) {
    console.error("Error handling incoming message:", err);
    await sendWhatsAppMessage(from, {
      type: "text",
      text: MESSAGES.SERVER_ERROR,
    });
  }
};
