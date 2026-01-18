import { AppointmentTypes } from "@/types/mongoTypes";
import mongoose, { Schema, Model } from "mongoose";

const AppointmentSchema: Schema<AppointmentTypes> = new Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DoctorProfile",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PatientProfile",
      required: true,
    },
    scheduleAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    type: {
      type: String,
      enum: ["online", "in-person"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Appointment: Model<AppointmentTypes> =
  mongoose.models.Appointment ||
  mongoose.model<AppointmentTypes>("Appointment", AppointmentSchema);
