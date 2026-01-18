import { MedicalHistoryTypes } from "@/types/mongoTypes";
import mongoose, { Model, Schema, Types } from "mongoose";

const medicalHistorySchema = new Schema<MedicalHistoryTypes>(
  {
    patientId: { type: Types.ObjectId, required: true, ref: "User" },
    condition: { type: String, required: true },
    diagnosisDate: { type: Date },
    notes: { type: String },
    medications: [{ type: String }],
    tests: [{ type: String }],
    reports: [{ type: String }],
  },
  { timestamps: true },
);

export const MedicalHistory: Model<MedicalHistoryTypes> =
  mongoose.models.MedicalHistory ||
  mongoose.model<MedicalHistoryTypes>("MedicalHistory", medicalHistorySchema);
