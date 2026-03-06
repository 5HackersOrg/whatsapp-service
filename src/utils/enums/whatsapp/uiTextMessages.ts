import { sendWhatsAppMessage } from "../../../services/twillio/whatsappMessages/sendWhatsappMessage.js";
import type { IButton } from "../../types/whatsapp/messages/whatsappComponents/IButton.js";

export const MESSAGES = {
  PARSING_RESUME: "⏳ Hang tight! I’m still processing your CV…",

  WELCOME:
    "👋 *Welcome to WhatsHire!*\n\n" +
    "What would you like to do today?\n\n" +
    "1️⃣ Log in\n" +
    "2️⃣ Create a new account\n\n" +
    "Reply with *1* or *2* to get started 🚀",

  JOB_SEARCH:
    "📄 Upload your CV, and I’ll find jobs that match your skills perfectly 👌",

  LOGIN_PROMPT:
    "🔐 Let’s get you logged in!\n\n" +
    "Please enter your details in this format:\n" +
    "*email:password*",

  FOUND_JOBS_MENU: (user_credits: number) => {
    return ` 🎯 *Great news!* I found jobs that match your CV ✨\n 
    Your 💳 Credits: ${user_credits}\n
    Choose what you’d like to do next:\n
    ✉️ *Generate a cover letter* (Costs: 3 credits)\n
    📝 *Generate a tailored resume* (Costs: 6 credits)\n
    ⬅️ *Go back to the main menu*\n
    Reply with: *-1*,`;
  },
  FOUND_JOB_MENU_V2: (user_credits: number) => {
    return `Your 💳 Credits: ${user_credits}\n
    Choose what you’d like to do next:\n
    ✉️ *Generate a cover letter* (Costs: 3 credits)\n
    📝 *Generate a tailored resume* (Costs: 6 credits)\n
    ⬅️ *Go back to the main menu*\n
    Reply with: *-1*,`;
  },
  INVALID_CREDITS:
    "⚠️ Oops! The credits value needs to be a number. Try again with a proper number, e.g., 2️⃣ or 5️⃣!",
  REF_CODE_NOT_FOUND: (refCode: string) =>
    `❌ Oops! The ref code *${refCode}* doesn’t seem to exist.\n` +
    `Please check the code and try again, or ask your friend for the correct one. 🤔`,
  NOT_ENOUGH_CREDITS: (
    requiredCredits: number,
    userCredits: number,
    refCode: string,
    refLink: string,
  ) => {
    return (
      `⚠️ Oops! You need ${requiredCredits} credits, but you only have ${userCredits}.\n\n` +
      `💡 Ask a friend to send you credits using your referral code : ${refCode}, or\n` +
      `🚀 Upgrade to the R40/month plan for unlimited resume & cover letter generations and more job results!\n` +
      `🎁 You can also refer someone using your link and earn extra credits!` +
      `Your Ref Link :${refLink}`
    );
  },
  SEND_CREDITS_MENU:
    "💸 *Send Credits to a Friend*\n\n" +
    "Minimum: 2 credits | Cost: 0.5 credits per credit sent 💰\n\n" +
    "Send using this format: *credits:refcode*\n" +
    "Example: *5:ABC123* (sends 5 credits to ABC123)\n\n" +
    "⬅️ Reply with *-1* to go back to the main menu",
  MIN_CREDIT_ERROR:
    "⚠️ Hmm… you need to send at least 2️⃣ credits. Try again with 2 or more! 💡",

  INSUFFICIENT_CREDIT_ERROR: (userCredits: number) =>
    `🚫 Whoa! You only have ${userCredits} credits in your account.\n` +
    `You can’t send more than that. Try a smaller amount or top up your credits! 💳`,
  ALREADY_FOUND_JOBS_MENU: (user_credits: number) => {
    return (
      ` 🎯 *Great news!* I found jobs that match your CV ✨\n` +
      `Check the PDF of the jobs I already sent you and note the *Job ID* for the position you want to act on.\n` +
      `💳 Credits: ${user_credits}\n` +
      `Choose what you’d like to do next:\n\n` +
      `✉️ *Generate a cover letter* (Costs: 3 credits)\n` +
      `Reply with: *id:cover* using the Job ID from the PDF\n` +
      `📝 *Generate a tailored resume* (Costs: 6 credits)\n` +
      `Reply with: *id:tailored* using the Job ID from the PDF\n\n` +
      `⬅️ *Go back to the main menu*\n` +
      `Reply with: *-1*,`
    );
  },

  CREATE_ACCOUNT_PROMPT:
    "🆕 Let’s create your account!\n\nPlease enter your email address 📧",

  INVALID_OPTION:
    "❌ Oops! That’s not a valid option.\nPlease reply with *1* or *2*",

  INVALID_FORMAT:
    "❌ That doesn’t look right.\nUse this format: *email:password*",

  LOGIN_SUCCESS: "✅ You’re logged in!\n\nType *menu* to continue 🎉",

  OTP_SENT:
    "📧 *Almost there!*\n\n" +
    "I’ve sent a One-Time Password (OTP) to your email.\n\n" +
    "Please enter the OTP to continue 🔐",
  SIDE_GIGS_MENU:
    "🛠️ *Side Gigs Menu*\n\n" +
    "1️⃣ View My Applications\n" +
    "2️⃣ My Listings\n" +
    "3️⃣ Browse Gigs\n" +
    "4️⃣ Post a New Gig\n\n" +
    "Reply with an option number 👇",
  MAIN_MENU:
    "🏠 *Main Menu*\n\n" +
    "1️⃣ Search Jobs\n" +
    "2️⃣ My Profile\n" +
    "3️⃣ Gigs Market\n\n" +
    "Reply with an option number 👇",
  MAIN_MENU_ERROR:
    "❌ That doesn’t look right \nPlease Choose One Of The 🏠 *Main Menu* Buttons\n\n",
  GIGS_OPT_IN:
    "💼 *Gigs Market Opt-In*\n\n" +
    "To access the Gigs Market and receive side-gig opportunities, you need to opt in.\n\n" +
    "Reply *YES* to opt in or *NO* to cancel 👇",
  VERIFICATION_NOTICE:
    "✅ *Verified accounts are more trustworthy*\n\n" +
    "Users are more likely to engage with verified profiles.\n\n" +
    "You can verify your account anytime from *My Profile* 👤",

  EMAIL_VERIFIED:
    "✅ Email verified successfully!\n\n" +
    "Now enter a password to complete your account setup 🔒",

  ACCOUNT_CREATED:
    "🎉 *Account created successfully!*\n\n" +
    "You’re all set to start job hunting 🚀",

  SERVER_ERROR:
    "⚠️ Uh-oh! Something went wrong on our side.\nPlease try again in a bit 🙏",

  INVALID_OTP: (email: string) =>
    `❌ That OTP doesn’t seem right.\n\n` +
    `Please try again, or reply with *-1* if you entered the wrong email.\n\n` +
    `📧 OTP was sent to: *${email}*`,

  INVALID_EMAIL:
    "❌ That doesn’t look like a valid email.\nPlease enter a correct email address 📧",

  WEAK_PASSWORD:
    "❌ Your password is too weak.\nIt must be at least *8 characters long* 🔐",
  CREDITS_SENT_SUCCESS: (amount: number, refCode: string) =>
    `🎉 Success! You’ve sent ${amount} credits to *${refCode}*.\n` +
    `💡 They’ll see it in their balance`,
  CREDITS_RECEIVED: (amount: number, number: string) =>
    `✨ You’ve received ${amount} credits! \n` +
    ` 🎁 From: *0${number.slice(3)}\n` +
    `💡 Your balance has been updated!`,
} as const;

export const sendWelcomeMessage = async (phoneNumber: string) => {
  const text =
    "👋 *Welcome to WhatsHire!*\n\n" + "What would you like to do today?\n\n";
  const btn: IButton = {
    interactive: {
      header: {
        type: "image",
        image: {
          link: process.env.WHATSHIRE_LOGO!,
        },
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: {
              id: "register",
              title: "Register New Account",
            },
          },
          {
            type: "reply",
            reply: {
              id: "Login",
              title: "Login",
            },
          },
        ],
      },
      body: {
        text: text,
      },
      type: "button",
    },
  };
  await sendWhatsAppMessage(phoneNumber, {
    type: "interactive",
    interactive: btn,
  });
};
export const sendMainMenuMessage = async (phoneNumber: string) => {
  const text = "🏠 *Main Menu*\n\n" + "What would you like to do";
  const btn: IButton = {
    interactive: {
      action: {
        buttons: [
          {
            type: "reply",
            reply: {
              id: "jobSearch",
              title: "Search Jobs",
            },
          },
          {
            type: "reply",
            reply: {
              id: "profile",
              title: "Profile",
            },
          },
          {
            type: "reply",
            reply: {
              id: "sideGig",
              title: "SideGigMarket",
            },
          },
        ],
      },
      body: {
        text: text,
      },
      type: "button",
    },
  };
  await sendWhatsAppMessage(phoneNumber, {
    type: "interactive",
    interactive: btn,
  });
};
