export interface ILocation {
  lon: number;
  lat: number;
}
export type GigStatus = "open" | "closed" | "in_progress";

export interface ISideGig {
  id: string;
  user_id: string;
  location: ILocation;
  title: string;
  description: string;
  budget: number;
  is_remote: boolean;
  user_rating: number;
  user_name: string;
  status: GigStatus;
  verified: boolean;
}
