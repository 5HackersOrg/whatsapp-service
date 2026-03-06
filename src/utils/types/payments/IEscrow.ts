export type EscrowStatus = "held" | "released" | "refunded" | "disputed";
export type CurrencyCode = "ZAR" | "USD" | "EUR";
export interface IEscrow {
  id: string;
  amount: number;
  status: EscrowStatus;
  platform_fee: number;
  platform_amount: number;
  net_amount: number;
  payments_ids: string[];
  currency: CurrencyCode;
  is_disputed: boolean;
  poster_id: string;
  automatic_approval_timeout: number; // hours
  applicant_id: string;
  createdAt: Date;
  updatedAt: Date;
  applicant_release_request: boolean;
  poster_release_approval: boolean;
  external_trx_id: string | null;
}