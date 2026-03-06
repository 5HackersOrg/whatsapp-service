import type { Request, Response } from "express";
import { readUserPortfolio } from "../../utils/gcp/bucketHelper.js";
export const viewController = async (req: Request, res: Response) => {
  const { i } = req.query;
  const render_name = String(i).replace(/-/g, "_");
  const html = await readUserPortfolio(String(i));
  console.log(html)
  console.log(render_name);
  res.render(render_name, { html });
};
