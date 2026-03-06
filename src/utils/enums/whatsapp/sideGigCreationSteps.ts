import { title } from "node:process";

export enum SideGigCreationStep {
  SIDE_GIG_STEP1_TITLE = "✏️ *What’s the title of your gig?*\n\n" +
    "Keep it short and catchy — for example: *Dog Walking, Social Media Assistant, Graphic Designer* 🐕💻🎨",
  SIDE_GIG_STEP2_DESCRIPTION = "📝 *Tell us more about your gig!*\n\n" +
    "Include tasks, skills needed, or schedule. Make it exciting — the more details, the better! 🚀",
  SIDE_GIG_STEP3_BUDGET = "💰 *What’s the budget for this gig?*\n\n" +
    "isEnter a number in your local currency. The *minimum budget  250*.\n" +
    "For example: 250, 400, 600, or 1500.",
  SIDE_GIG_STEP4_LOCATION = "🌐 *Is this gig remote?*\n\n" +
    "Reply *Yes* if the gig can be done from anywhere, or *No* if it requires a specific location. " +
    "If you shared a location, this will automatically be set to *No*.",
}
export const SIDE_GIG_STEP5_REVIEW = (
  title: string,
  description: string,
  budget: number,
  location: string,
  is_remote: boolean,
) => {
  const locationText = is_remote
    ? "🌐 *Remote:* Yes\n"
    : `📍 *Location:* ${location}\n`;

  return (
    `🔍 *Review Your Gig*\n\n` +
    `Here’s what your gig looks like so far:\n\n` +
    `✏️ *Title:* ${title}\n` +
    `📝 *Description:* ${description}\n` +
    `💰 *Budget:* ${budget}\n` +
    locationText +
    `\nIf everything looks good, reply *Confirm* ✅ to post your gig.\n\n` +
    `✏️ To make changes, type:\n` +
    `• Edit Title\n` +
    `• Edit Budget\n` +
    `• Edit Description\n` +
    `• Cancel (start over)\n\n` +
    `↩️ Type *-1* to return to the main menu.`
  );
};
export const SIDE_GIG_STEP6_DEPOSIT = (paymentLink: string) =>
  `⚡ *Secure your gig!* ⚡\n\n` +
  `A *20% deposit* of your gig budget is required to post your listing. This keeps both you and other users safe from scams.\n\n` +
  `Example: Budget 500 → Deposit 100 💰\n\n` +
  `Click here to pay your deposit: ${paymentLink}\n\n` +
  `Reply *Cancel* to go back to the main menu.`;
