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
      trim: true,
    },
    experienceYears: {
      type: Number,
      min: 0,
    },
    // allow multiple specializations; optional and can be empty
    specialization: {
      type: [String],
      default: [],
    },
    clinicalAddress: {
      type: String,
      trim: true,
    },
    // free-form professional bio
    bio: {
      type: String,
      default: "",
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