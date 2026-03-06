import type { Request, Response } from "express";
import type { tempDataUpdate } from "../../repository/temp/tempDB.js";
import { updateSession } from "../../services/temp/OnboardingServices.js";
import type { OnboardingStep } from "../../sequelize/models/temp/OnboardingInfo.js";

export const onboardingCompleteController = async (
  req: Request,
  res: Response,
) => {
  try {
    console.log("req body-----\n", req.body);
    const email: string = req.body.email;
    const name: OnboardingStep = req.body.name;
    const next_step: OnboardingStep = req.body.next_step;
    const completed: boolean = req.body.completed === "true";
    const companyData = req.body.companyData
      ? JSON.parse(req.body.companyData)
      : {};
    let value: any;
    //@ts-ignore
    if (req.logoURL) {
      //@ts-ignore
      value = req.logoURL;
    } else {
      value = req.body.value;
    }

    const updateTempData: tempDataUpdate = {
      field: {
        name,
        value,
        next_step,
        companyData,
      },
      completed,
    };
    console.log("name", name);
    console.log(!name ? null : updateTempData);
    const result = await updateSession(email, !name ? null : updateTempData);
    res.status(200).json(result);
  } catch (err: any) {
    console.error("Onboarding error:", err);
    res.status(500).json({ message: "Onboarding failed", error: err.message });
  }
};
