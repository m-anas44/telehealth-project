import { Document } from "mongoose";

export interface UserTypes extends Document {
  name: string;
  email: string;
  password: string;
  image?: string;
  gender?: "male" | "female" | "other";
  role: "patient" | "doctor" | "admin";
  phone?: string;
  city?: string;
}