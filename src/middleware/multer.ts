import type { Request, Response, NextFunction } from "express";
import multer from "multer";
import { uploadCompanyLogoToBucket } from "../utils/gcp/bucketHelper.js";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
});
export const uploadLogo = (fieldName: string) => {
  const handler = upload.single(fieldName);

  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }

      // NOW req.body is available
      console.log("req.body:", req.body);
      console.log("req.file:", req.file);

      if (!req.file) return next();

      try {
        const companyData = req.body.companyData
        const data = JSON.parse(companyData)
        const email = data.company_email
        const fileUrl = await uploadCompanyLogoToBucket(req.file, email);

        //@ts-ignore
        req.logoURL = fileUrl;

        next();
      } catch (uploadErr: any) {
        return res.status(500).json({
          message: "File upload failed",
          error: uploadErr.message,
        });
      }
    });
  };
};