import { RoomTypes } from "@/types/mongoTypes";
import mongoose, { Model, Schema, Types } from "mongoose";

const roomSchema = new Schema<RoomTypes>(
  {
    appointmentId: { type: Types.ObjectId, required: true, ref: "Appointment" },
    doctorId: { type: Types.ObjectId, required: true, ref: "User" },
    patientId: { type: Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true },
);

export const Room: Model<RoomTypes> =
  mongoose.models.Room || mongoose.model<RoomTypes>("Room", roomSchema);
