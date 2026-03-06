import { JobsDb } from "../../../repository/jobs/JobsDb.js";
import { shuffleArray } from "../../../utils/types/user/shuffleArray.js";
import { createTextEmbedding } from "../../ai/embeddings/embedding.js";
import { insertEmbedding, queryEmbeddings } from "../../pinecone/pinecone.js";
import ScrappingService from "../../scraping/scrappingJobs.js";

const jobsDb = new JobsDb();
const job_scrapper = new ScrappingService();

type recommendJobsParams = {
  embedding: number[];
  userId: string;
  target_role: string;
  xp: string;
  industry: string;
};

export const getRecommededJobs = async ({
  embedding,
  userId,
  target_role,
  xp,
  industry,
}: recommendJobsParams) => {
  try {
    const result_matches = await queryEmbeddings({
      embedding,
      namespace: industry,
    });
    if (!result_matches) {
      console.log("result_matches undefined");
      return;
    }
    const match = result_matches.find((m: any) => m.score && m.score > 0.85);
    console.log("Best match:", match || "NONE");

    if (!match || !match.metadata?.jobRoleId) {
      const jobs = await job_scrapper.scrape(target_role);

      if (!Array.isArray(jobs) || jobs.length === 0) {
        console.log("No jobs scraped");
        return { jobs: [] };
      }
      const jobRoleId = await jobsDb.createJobRoleCache(target_role, 7);
      if (!jobRoleId) {
        console.log("jobRoleId undefined");
        return;
      }
      console.log("jrole id:", jobRoleId);

      await insertEmbedding({
        embedding,
        id: target_role,
        namespace: industry,
        metadata: {
          jobRoleId,
        },
      });

      // Save jobs
      for (const job of jobs) {
        await jobsDb.createScrappedJob(job, jobRoleId);
      }
      shuffleArray(jobs);

      return {
        jobs: jobs.slice(0, 12),
      };
    }

    // 5. MATCH FOUND → RETURN CACHE

    const jobRoleId = match.metadata.jobRoleId as string;

    const cachedJobs = await jobsDb.getRoleCacheJobs(jobRoleId, 12);

    if (!cachedJobs || cachedJobs.length === 0) {
      console.log("Cache empty");

      return { jobs: [] };
    }

    return {
      jobs: cachedJobs,
    };
  } catch (error) {
    console.error("Job recommendation error:", error);

    return {
      jobs: [],
    };
  }
};
