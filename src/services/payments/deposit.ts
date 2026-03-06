
// import {
//   verifySignedGigData,
//   type GigData,
// } from "../../utils/signatures/generateSig.js";
// import type { IUserAccount } from "../../utils/types/user/IUserAccount.js";

// export const verifyDepositInfo = async (sig: string, email: string) => {
//   const tempSideGigData = (await jobs_database.getTempSideGigListing(
//     email,
//   )) as GigData;
//   if (!tempSideGigData) {
//     return {
//       success: false,
//       message: "user side gig not found",
//       data: [],
//     };
//   }
//   const valid = verifySignedGigData(tempSideGigData, sig);
//   console.log();
//   if (!valid) {
//     return {
//       success: false,
//       message:
//         "payment time window expired type regenerate into the chart to generate new link",
//       data: [],
//     };
//   }
//   const user = (await user_database.getUserByEmail(email)) as IUserAccount;
//   return {
//     success: true,
//     message: "valid link",
//     data: [
//       {
//         name: user.fullName,
//         sideGig: tempSideGigData,
//         deposit: tempSideGigData.budget * 0.2,
//       },
//     ],
//   };
// };
