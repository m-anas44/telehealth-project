import { ClinicalEncounterTypes } from "@/types/mongoTypes";
import mongoose, { Model, Schema, Types } from "mongoose";

const clinicalEncounterSchema = new Schema<ClinicalEncounterTypes>(
  {
    patientId: { type: Types.ObjectId, required: true, ref: "User" },
    doctorId: { type: Types.ObjectId, required: true, ref: "User" },
    appointmentId: { type: Types.ObjectId, required: true, ref: "Appointment" },
    diagnosis: { type: String, required: true },
    notes: { type: String },
  },
  { timestamps: true },
);

export const ClinicalEncounter: Model<ClinicalEncounterTypes> =
  mongoose.models.ClinicalEncounter ||
  mongoose.model<ClinicalEncounterTypes>(
    "ClinicalEncounter",
    clinicalEncounterSchema,
  );
