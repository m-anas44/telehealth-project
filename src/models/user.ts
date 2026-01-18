import { UserTypes } from "@/types/mongoTypes";
import mongoose, { Schema, Model } from "mongoose";

const UserSchema: Schema<UserTypes> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    image: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },
    phone: {
      type: String,
    },
    city: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const User: Model<UserTypes> =
  mongoose.models.User || mongoose.model<UserTypes>("User", UserSchema);
