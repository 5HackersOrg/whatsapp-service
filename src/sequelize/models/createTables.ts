import "./application/Application.js";
import "./application/SideGigProposal.js";
import "./company/Company.js";
import "./user/audit/RecruiterAudit.js";
import "./temp/OnboardingInfo.js";
import "./jobs/Job.js";
import "./jobs/Posted.js";
import "./jobs/Scrapped.js";
import "./jobs/SideGig.js";
import "./jobs/cache/JobCache.js";
import "./jobs/cache/JobRoleCache.js";
import "./payments/ITN.js";
import "./payments/Payment.js";
import "./error/Errorlog.js";
import "./admin/adminLogs.js";
import "./verification/verification.js";
import "./ai/aiUsageLog.js";
import "./email/emailLogs.js";
import "./shortlist/Shortlist.js";
import "./user/UserSentJobs.js";
import "./user/permissions/Permissions.js";
import "./user/audit/ShortlistAudit.js";
import "./user/events/Event.js";
import "./user/Interview.js";
import "./shortlist/shortlistCandidate.js";
import "./user/audit/shortlistAuditCandidate.js";
import "./user/JobSeeker.js";
import "./user/Moderator.js";
import "./user/Recruiter.js";
import "./user/Rating.js";
import "./user/Role.js";
import "./user/UserWhatsappSession.js";
import "./user/Users.js";
import "./user/RecruiterAdvice.js";
import "./user/CandidateStrength.js";
import "./user/CandidateRisk.js";
import { DBConnection } from "../setup.js";
import { seedRoles } from "../seeders/roleSeed.js";
const dbInstance = new DBConnection();
const db = dbInstance.getDb();

export const createTables = async () => {
  try {
    await db.sync({ alter: true });
    console.log("Tables created successfully!");
    await seedRoles();
  } catch (error) {
    console.error("Error creating tables:", error);
    process.exit(1);
  }
};
