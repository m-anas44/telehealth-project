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
    licenseState: {
      type: String,
      trim: true,
    },
    licenseExpiration: {
      type: Date,
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
    bio: {
      type: String,
      default: "",
      trim: true,
    },
    medicalSchool: {
      type: String,
      trim: true,
    },
    residencyProgram: {
      type: String,
      trim: true,
    },
    boardNameOfCertification: {
      type: String,
      trim: true,
    },
    availability: {
      weekly: [
        {
          day: {
            type: String,
          },
          isAvailable: {
            type: Boolean,
            default: false,
          },
          startTime: {
            type: String,
          },
          endTime: {
            type: String,
          },
        },
      ],
    },
    consultationDuration: {
      type: Number, // minutes
      default: 30,
    },
    bufferTime: {
      type: Number, // minutes
      default: 0,
    },
    consultationTypes: {
      video: { type: Boolean, default: true },
      inPerson: { type: Boolean, default: true },
      phone: { type: Boolean, default: false },
    },
    documents: {
      medicalLicense: {
        url: String,
        publicId: String,
      },
      boardCertification: {
        url: String,
        publicId: String,
      },
      deaCertificate: {
        url: String,
        publicId: String,
      },
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
