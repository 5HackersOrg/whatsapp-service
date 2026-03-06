export interface InterviewSchedule {
  summary: string;
  description: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
  candidateEmail: string;
  isRemote: boolean;
  interviewers: string[];
  candidateName: string;
  timeZone: "Africa/Johannesburg";
}
