import mongoose, { Schema, Types } from "mongoose";
import { MedicalHistoryTypes } from "@/types/mongoTypes";

const medicalHistorySchema = new Schema<MedicalHistoryTypes>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      unique: true,
    },
    allergies: [{ type: String, trim: true }],
    chronicConditions: [{ type: String, trim: true }],
    documents: [
      {
        name: { type: String, required: true },
        category: {
          type: String,
          enum: ["report", "xray", "prescription", "other"],
          default: "report",
        },
        key: { type: String, required: true },
        fileType: { type: String },
        url: { type: String },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    notes: { type: String },
  },
  { timestamps: true },
);

const MedicalHistory: mongoose.Model<MedicalHistoryTypes> =
  mongoose.models.MedicalHistory ||
  mongoose.model("MedicalHistory", medicalHistorySchema);

export default MedicalHistory;
