import { createTextEmbedding } from "../ai/embeddings/embedding.js";
import { insertEmbedding } from "../pinecone/pinecone.js";
import { getJobSeekerDbMethods } from "../../repository/users/jobSeekers/JobSeekersDb.js";
const jobSeekerDb = getJobSeekerDbMethods();
export type UserEmbeddingInfo = {
  role: string;
  xp: string;
  industry: string;
  education_level: string;
  phoneNumber: string;
  userId: string;
};
export const generateUserEmbedding = async ({
  education_level,
  industry,
  role,
  userId,
  phoneNumber,
  xp,
}: UserEmbeddingInfo) => {
  console.log("setting user embedding");
  const embedding = await createTextEmbedding(role);
  if (!embedding) {
    console.log("embedding undefined failed to create embedding");
    return;
  }
  await jobSeekerDb.setJobSeekerEmbedding(userId, JSON.stringify(embedding));
  await jobSeekerDb.setEducationAndExperinenceAndIndustry(
    userId,
    Number(education_level),
    Number(xp),
    industry,
  );
  await insertEmbedding({
    embedding,
    id: `${role}-${userId}`,
    namespace: industry,
    metadata: {
      xp: xp,
      education_level: education_level,
      phoneNumber: phoneNumber,
    },
  });
};
