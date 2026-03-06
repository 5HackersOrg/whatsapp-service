import { getRecruiterDbMethods } from "../../repository/users/recruiters/RecruiterDb.js";

export const cosineSimilarity = (a: number[], b: number[]): number => {
  //@ts-ignore
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (normA * normB);
};

export const filterJobs = (userEmbedding: number[], jobs: any[]) => {
  return jobs
    .map((job) => {
      const j_embedding = JSON.parse(job.Posted.embedding);
      const similarity = cosineSimilarity(userEmbedding, j_embedding);

      if (similarity <= 0.67) return null;

      const company = job.Posted?.Recruiter?.Company;
      if (!company) return null;

      return {
        id: job.id,
        website: company.website,
        companyLogo: company.logo,
        companyName: company.name,
        title: job.title,
        salary: job.salary,
        programeType: job.Posted.programType,
        employmentType: job.Posted.employmentType,
        location: job.Posted.location,
        description: job.description,
      };
    })
    .filter(Boolean);
};
