export type IProvider = React.FC<{ children: React.ReactNode }>;
export enum UserGender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export interface User {
  id: number;
  bikeModel: string;
  createdAt: string;
  email: string;
  expoPushToken: string;
  gender: UserGender;
  latitude: number;
  longitude: number;
  name: string;
  phone: string;
}

export interface Accident {
  id: number;
  userId: number;
  name: string | null;
  phone: string | null;
  bikeModel: string | null;
  gender: UserGender;
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
