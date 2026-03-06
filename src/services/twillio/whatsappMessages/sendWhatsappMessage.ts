import axios from "axios";
import type { MessagePayload } from "../../../utils/types/whatsapp/messages/interactiveType.js";
import type { IScrappedJobWithId } from "../../../utils/types/jobs/IJob.js";
import type { IButton } from "../../../utils/types/whatsapp/messages/whatsappComponents/IButton.js";
import { configDotenv } from "dotenv";
import { logError } from "../../logging/loggers.js";
import type {
  employmentType,
  ProgramType,
} from "../../../sequelize/models/jobs/Posted.js";
configDotenv();
const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID_TEST;
const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
console.log("acess token ", accessToken);
export const sendWhatsAppMessage = async (
  to: string,
  payload: MessagePayload,
) => {
  try {
    const body =
      payload.type === "text"
        ? {
            messaging_product: "whatsapp",
            to: to,
            type: "text",
            text: {
              body: payload.text,
            },
          }
        : {
            messaging_product: "whatsapp",
            to,
            type: "interactive",

            interactive: payload.interactive.interactive,
          };
    const response = await axios.post(
      `https://graph.facebook.com/v24.0/${phoneNumberId}/messages`,
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    console.log("Message sent:", response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error sending message:",
        error.response?.data || error.message,
      );

      await logError({
        error_message: error.message,
        error_type: "SERVER_ERROR",
        action: "sending whatsapp message",
        stack_trace: error.stack ? error.stack : "no stack trace",
        severity: "critical",
        endpoint: "sendWhatsAppMessage",
      });
    }
  }
};

export const sendScrappedJobMessage = async (
  number: string,
  data: IScrappedJobWithId,
) => {
  const btn: IButton = {
    interactive: {
      action: {
        buttons: [
          {
            reply: {
              id: `tailored@${data.id}`,
              title: "Tailored Resume",
            },
            type: "reply",
          },
          {
            reply: {
              id: `letter@${data.id}`,
              title: "CoverLetter",
            },
            type: "reply",
          },
        ],
      },
      body: {
        text:
          `*Job Title* :${data.title}\n` +
          `*Company Name*:${data.company}\n` +
          `*Job Location*${data.location}\n` +
          `*Job Link*:${data.link}\n` +
          `*Job Description:*\n${data.description.slice(0, 699)}...`,
      },
      type: "button",
    },
  };
  await sendWhatsAppMessage(number, { type: "interactive", interactive: btn });
};
export type ErrorPayload = {
  action: string;
  error: string;
};
export const sendNotifyErrorMessage = async (
  payload: ErrorPayload,
  to?: string,
) => {
  const number = to ? to : process.env.ADMIN_NUMBER;

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v24.0/${phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        to: number,
        type: "text",
        text: {
          body: `error happend while trying to ${payload.action}\n*Error Message* : ${payload.error}`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    console.log("Message sent:", response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error sending message:",
        error.response?.data || error.message,
      );
    }
  }
};
export const sendMaxApplicantsReachedMessage = async (
  jobTitle: string,
  to: string,
) => {
  const number = to ? to : process.env.ADMIN_NUMBER;

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v24.0/${phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        to: number,
        type: "text",
        text: {
          body: `Oops! The position "${jobTitle}" has reached its maximum number of applicants. We'll notify you if the status changes.\n\nRemember to check in daily so you can apply early next time. `,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    console.log("Message sent:", response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error sending message:",
        error.response?.data || error.message,
      );
    }
  }
};
export const sendCompanyVerificationMessage = async (
  companyName: string,
  companyNumber: string,
  to?: string,
) => {
  const number = to ? to : process.env.ADMIN_NUMBER;

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v24.0/${phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        to: number,
        type: "text",
        text: {
          body: `Company *${companyName}* has registered with *${companyNumber}* company number pending verification`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    console.log("Message sent:", response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error sending message:",
        error.response?.data || error.message,
      );
    }
  }
};
export const sendPostedJobMessage = async (
  number: string,
  data: {
    id: string;
    programeType: ProgramType;
    employmentType: employmentType;
    salary?: string;
    website?: string;
    industry: string;
    companyName: string;
    companyLogo: string;
    title: string;
    company: string;
    location: string;
    description: string;
  },
) => {
  console.log('dataaaaaaaaaa-\n',data)
  const btn: IButton = {
    interactive: {
      type: "button",

      header: {
        type: "image",
        image: {
          link: data.companyLogo,
        },
      },

      body: {
        text:
          `*Job Title*: ${data.title}\n` +
          (data.programeType !== "Not a Program"
            ? `*Program Type*: ${data.programeType}\n`
            : "") +
          (data.salary ? `*Salary PM*: R${data.salary}\n` : "") +
          (data.website ? `*Website* : ${data.website}\n` : "") +
          `*Company Name*: ${data.companyName}\n` +
          `*Employment Type*: ${data.employmentType}\n` +
          `*Company Industry*: ${data.industry}\n` +
          `*Job Location*: ${data.location}\n` +
          `*Job Description:*\n ${data.description.slice(0, 599)}...`,
      },

      footer: {
        text: "powered by Whatshire",
      },

      action: {
        buttons: [
          {
            type: "reply",
            reply: {
              id: `apply@${data.id}`,
              title: "Apply",
            },
          },
          {
            type: "reply",
            reply: {
              id: `report@${data.id}`,
              title: "Report",
            },
          },
        ],
      },
    },
  };
  await sendWhatsAppMessage(number, { type: "interactive", interactive: btn });
};
