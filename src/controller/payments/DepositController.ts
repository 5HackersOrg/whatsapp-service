// import type { Request, Response } from "express";
// import { verifyDepositInfo } from "../../services/payments/deposit.js";

// export const depositController = async (req: Request, res: Response) => {
//   const sig = req.query.id as string;
//   const user_email = req.query.mail as string;
//   if (!sig || !user_email) {
//     return res.send("invalid request");
//   }
//   const result = await verifyDepositInfo(sig, user_email);
//   if (!result.success) {
//     res.send(result.message);
//   }
//   const { data } = result;
//   res.render("index", {
//     gig: data[0]?.sideGig,
//     name: data[0]?.name,
//     deposit: data[0]?.deposit,
//   });
// };
