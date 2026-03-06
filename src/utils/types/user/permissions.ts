export type Roles =
  | "admin"
  | "recruiter"
  | "viewer"
  | "hiring_manager"
  | "system_admin"
  | "moderator"
  | "jobSeeker";
type Permission = {
  jobs_read: boolean;
  jobs_update: boolean;
  jobs_delete: boolean;
  jobs_create: boolean;
  candidate_read: boolean;
  candidate_update: boolean;
  candidate_delete: boolean;
  candidate_create: boolean;
  audits_read: boolean;
};
export const defaultPermissions: Record<
  Exclude<Roles, "jobSeeker" | "system_admin" | "moderator">,
  Permission
> = {
  admin: {
    audits_read: true,
    candidate_create: true,
    candidate_delete: true,
    candidate_read: true,
    candidate_update: true,
    jobs_create: true,
    jobs_delete: true,
    jobs_read: true,
    jobs_update: true,
  },
  hiring_manager: {
    audits_read: true,
    candidate_create: true,
    candidate_delete: true,
    candidate_read: true,
    candidate_update: true,
    jobs_create: false,
    jobs_delete: false,
    jobs_read: false,
    jobs_update: false,
  },
  recruiter: {
    audits_read: false,
    candidate_create: true,
    candidate_delete: true,
    candidate_read: true,
    candidate_update: true,
    jobs_create: true,
    jobs_delete: true,
    jobs_read: true,
    jobs_update: true,
  },
  viewer: {
    audits_read: false,
    candidate_create: false,
    candidate_delete: false,
    candidate_read: true,
    candidate_update: false,
    jobs_create: false,
    jobs_delete: false,
    jobs_read: true,
    jobs_update: false,
  },
};
