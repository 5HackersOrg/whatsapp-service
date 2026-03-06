export interface CreateUserResponse {
  statusCode: number;
  message: string;
  success: boolean;
  userId?: string;
}

export interface WhatsappSessionState {
  state: string | null | undefined;
  password: string | null | undefined;
  email: string | null | undefined;
  referredCode: string | null | undefined;
  otp: string | null | undefined;
  userId: string | null | undefined;
  customerServiceTimeout?: string | null | undefined;
  redeemded: boolean | undefined;
}

export interface UserData {
  email: string;
  password: string;
  userId: string;
  fullName?: string;
  phone_number: string;
  targetRole?: string;
  found_today_jobs: boolean;
  professionalId?: string;
  scraped_jobs?: number;
  [key: string]: any;
}
