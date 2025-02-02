export interface User {
  id: number;
  bikeModel: string;
  createdAt: string;
  email: string;
  expoPushToken: string;
  gender: "male" | "female";
  latitude: number;
  longitude: number;
  name: string;
  phone: string;
}

export interface Accident {
  id: number;
  userId: number;
  title: string | null;
  description: string | null;
  latitude: number;
  longitude: number;
  pushRecipients: number;
  state: AccidentState;
  updatedAt: string;
  createdAt: string;
}

export enum AccidentState {
  ACTIVE = "ACTIVE",
  CANCELED = "CANCELED",
  EXPIRED = "EXPIRED",
}
