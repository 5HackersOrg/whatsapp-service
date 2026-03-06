export interface IScrappedJob {
  title: string;
  location: string;
  company: string;
  description: string;
  link: string;
}
export type IJobWithoutDescription = Omit<IScrappedJob, "description">;
export interface IScrappedJobWithId {
  id: string;
  title: string;
  location: string;
  company: string;
  description: string;
  link: string;
}
export interface PostedJobData {
  description: string;
  title: string;
  isRemote: boolean;
  salary: string;
  closingDate: string;
  location: string;
  educationLevel: string;
  experience: string;
  maxApplications: string;
  companyName: string;
  industry: string;
  employmentType: string;
  programType: string;
}
