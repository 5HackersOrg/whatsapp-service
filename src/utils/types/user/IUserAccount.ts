export interface IUserAccount {
  messages_left: number;
  userId: string | null;
  email: string | null;
  password: string | null;
  targetRole: string | null;
  found_today_jobs: boolean;
  fullName: string | null;
  phone_number: string;
  scraped_jobs: number;
  professionalId: string | null;
}
