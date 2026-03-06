import type { Request, Response } from "express";
import { makeSuggestions } from "../../services/user/autoComplete.js";
export const addessAutoCompleteController = async (
  req: Request,
  res: Response,
) => {
  const text = req.body.input;
  console.log("making suggestions")
  const result = await makeSuggestions(text);
  res.status(200).json(result);
};
