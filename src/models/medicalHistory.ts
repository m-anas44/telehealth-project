import { MedicalHistoryTypes } from "@/types/mongoTypes";
import mongoose, { Model, Schema, Types } from "mongoose";

const medicalHistorySchema = new Schema<MedicalHistoryTypes>(
  {
    patientId: { type: Types.ObjectId, required: true, ref: "User" },
    condition: { type: String, required: true }, // e.g., "Asthma"
    type: { type: String, enum: ["allergy", "chronic", "past_surgery", "other"], default: "chronic" },
    diagnosisDate: { type: Date },
    isCurrent: { type: Boolean, default: true }, // Kya ye abhi bhi hai?
    notes: { type: String },
    medications: [{ type: String }], // Jo wo khud le raha hai
    attachments: [{ // S3 keys for reports/xrays
      name: String,
      key: String,
      fileType: String
    }],
  },
  { timestamps: true },
);
