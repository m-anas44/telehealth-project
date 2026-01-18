import { DoctorProfileTypes } from "@/types/mongoTypes";
import mongoose, { Model, Schema } from "mongoose";

const DoctorProfileSchema: Schema<DoctorProfileTypes> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    licenseNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    experienceYears: {
      type: Number,
      required: true,
      min: 0,
    },
    specialization: {
      type: [String],
      required: true,
      validate: [(val: string[]) => val.length > 0, "At least one specialization is required"],
    },
    clinicalAddress: {
        type: String,
        required: true,
        trim: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Model export (avoid recompiling)
export const DoctorProfile: Model<DoctorProfileTypes> =
  mongoose.models.DoctorProfile ||
  mongoose.model<DoctorProfileTypes>("DoctorProfile", DoctorProfileSchema);