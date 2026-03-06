export type PaymentDirection = "INFLOW" | "OUTFLOW";
export type GatewayStatus = "PENDING" | "COMPLETED" | "FAILED";
export interface IPayment {
  id: string;
  user_id: string;
  job_meta_id: string;
  amount: number;
  createdAt: Date;
  gateway_status: GatewayStatus;
  raw_response: Record<string, any>;
  external_id: string | null;
  direction: PaymentDirection;
}
