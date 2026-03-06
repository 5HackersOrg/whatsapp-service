import { Storage, Bucket, File } from "@google-cloud/storage";

let storage: Storage;

if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  storage = new Storage();
} else if (process.env.GOOGLE_CLOUD_KEY_JSON) {
  const credentials = JSON.parse(process.env.GOOGLE_CLOUD_KEY_JSON);
  storage = new Storage({ credentials });
} else {
  throw new Error("Google Cloud credentials are not set.");
}

const bucketName = process.env.GCS_BUCKET_NAME;

if (!bucketName) {
  throw new Error("GCS_BUCKET_NAME environment variable is not set.");
}

export const saveJsonResumeToBucket = async (
  jsonContent: Record<string, any>,
  email: string,
): Promise<void> => {
  try {
    const file: File = storage.bucket(bucketName).file(`${email}/resume.json`);
    await file.save(JSON.stringify(jsonContent), {
      contentType: "application/json",
    });
    console.log("data uploaded!");
  } catch (err) {
    console.error("Error uploading JSON resume:", err);
  }
};
export const saveUserPortfolioToBucket = async (
  content: string,
  name: string,
): Promise<void> => {
  try {
    const file: File = storage.bucket(bucketName).file(`${name}/portfolio.txt`);

    await file.save(content, {
      contentType: "text/plain",
    });

    console.log("TXT uploaded!");
  } catch (err) {
    console.error("Error uploading TXT resume:", err);
  }
};

export const saveResumeToBucket = async (
  pdf: Buffer | Uint8Array,
  email: string,
): Promise<void> => {
  try {
    const file: File = storage.bucket(bucketName).file(`${email}/resume.pdf`);
    await file.save(pdf, {
      contentType: "application/pdf",
    });
    console.log("resume uploaded!");
  } catch (err) {
    console.error("Error uploading PDF resume:", err);
  }
};
export const uploadCompanyLogoToBucket = async (
  uploadedFile: Express.Multer.File,
  email: string,
): Promise<string | undefined> => {
  try {
    const file: File = storage
      .bucket(bucketName)
      .file(`companies/${email}/${uploadedFile.originalname}`);
    await file.save(uploadedFile.buffer, {
      contentType: uploadedFile.mimetype,
    });
    console.log("logo uploaded!");
    return file.publicUrl();
  } catch (err) {
    console.error("Error uploading Company Logo :", err);
  }
};
export const saveRecommendJobsPDFToBucket = async (
  pdf: Buffer | Uint8Array,
  jobRole: string,
  range: string,
): Promise<void> => {
  try {
    const file: File = storage
      .bucket(bucketName)
      .file(`${jobRole}/recommenedJobs${range}.pdf`);
    await file.save(pdf, {
      contentType: "application/pdf",
    });
    console.log("recommeded jobs uploaded!");
  } catch (err) {
    console.error("Error uploading PDF resume:", err);
  }
};

export const readJsonFileFromGCP = async (
  email: string,
): Promise<string | null> => {
  try {
    const file: File = storage.bucket(bucketName).file(`${email}/resume.json`);
    const [exists] = await file.exists();
    if (!exists) return null;

    const [contents] = await file.download();
    return contents.toString();
  } catch (err) {
    console.error("Error reading JSON file from GCP:", err);
    return null;
  }
};
export const getSignedBucketUrl = async (jobRole: string, range: string) => {
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(`${jobRole}/recommenedJobs${range}.pdf`);

  const [url] = await file.getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
  });
  return url;
};
export const readUserPortfolio = async (
  name: string,
): Promise<string | null> => {
  try {
    const file = storage.bucket(bucketName).file(`${name}/portfolio.txt`);

    const exists = await file.exists();

    if (!exists[0]) return null;

    const [buffer] = await file.download();

    return buffer.toString("utf-8");
  } catch (error) {
    console.error(error);
    return null;
  }
};
