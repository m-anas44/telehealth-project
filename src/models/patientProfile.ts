import { PatientProfileTypes } from "@/types/mongoTypes";
import mongoose, { Schema, Model } from "mongoose";

const PatientProfileSchema: Schema<PatientProfileTypes> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    emergencyContact: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);
export const patientProfile: Model<PatientProfileTypes> =
  mongoose.models.PatientProfile ||
  mongoose.model<PatientProfileTypes>("PatientProfile", PatientProfileSchema);
