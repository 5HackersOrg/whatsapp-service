import type { IUserProfile } from "../../types/user/IUserProfile.js";

export const getProfileMenuText = (user: IUserProfile): string => {
  // Calculate average rating
  let sum = 0;
  user.ratings.forEach((r) => {
    sum += r.rating;
  });
  const avgRating = (sum / 5) * 0.5;
  return (
    `🧑 *Your Profile*\n\n` +
    `💳 Credits: ${user.credits}\n` +
    `💰 Balance: R${user.balance.toFixed(2)}\n` +
    `🏆 Subscription Tier: ${user.subscription_tier}\n` +
    `📝 Resume Template: ${user.resume_template}\n` +
    `📄 Cover Letter Template: ${user.cover_letter_template}\n` +
    `⭐ Verified: ${user.verified ? "Yes ✅" : "No ❌"}\n` +
    `🌟 Rating: ${avgRating} ⭐ (${user.ratings.length} reviews)\n` +
    `🌐 Ref Code: ${user.ref_code}\n` +
    `🔗 Referral Link: ${user.ref_link}\n` +
    `🎯 Skills: ${user.skills.length ? user.skills.slice(0, 9).join(", ") : "None"}\n` +
    `💼 Side Gigs Opt-in: ${user.opted_in_for_side_gigs ? "Yes ✅" : "No ❌"}\n\n` +
    `Reply with an option number 👇\n` +
    `1️⃣ Edit Resume Template\n` +
    `2️⃣ Edit Cover Letter Template\n` +
    `3️⃣ Send Credits\n` +
    `4️⃣ Purchase Supporter Plan R40 \n` +
    `5️⃣ Verify Account` +
    `-1 ⬅️ Back to Main Menu`
  );
};
