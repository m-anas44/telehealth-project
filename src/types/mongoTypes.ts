import mongoose, { Document } from "mongoose";

export interface UserTypes extends Document {
  name: string;
  email: string;
  password: string;
  image?: string;
  gender?: "male" | "female" | "other";
  role: "patient" | "doctor" | "admin";
  phone?: string;
  city?: string;
}

export interface PatientProfileTypes extends Document {
  userId: mongoose.Types.ObjectId | string; // reference to User
  age: number;
  bloodGroup: string;
  emergencyContact?: string;
}

export interface DoctorProfileTypes extends Document {
  userId: mongoose.Types.ObjectId | string;
  licenseNo: string;
  experienceYears: number;
  specialization: string[];
  bio: string;
  clinicalAddress: string;
  availability?: {
    weekly: {
      day: string;
      isAvailable: boolean;
      startTime?: string;
      endTime?: string;
    }[];
  };
  consultationDuration: number; // minutes
  bufferTime: number; // minutes
  consultationTypes: {
    video: boolean;
    inPerson: boolean;
    phone: boolean;
  };
  documents: {
    medicalLicense?: {
      url: string;
      publicId: string;
    };
    boardCertification?: {
      url: string;
      publicId: string;
    };
    deaCertificate?: {
      url: string;
      publicId: string;
    };
  };
  isActive: boolean;
}

export interface AppointmentTypes extends Document {
  doctorId: mongoose.Types.ObjectId | string;
  patientId: mongoose.Types.ObjectId | string;
  scheduleAt: Date;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  type: "online" | "in-person";
}

export interface RoomTypes {
  appointmentId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
}

export interface ChatTypes {
  senderId: mongoose.Types.ObjectId;
  content: string;
  roomId: mongoose.Types.ObjectId;
  type: "text" | "image" | "file";
}

export interface ClinicalEncounterTypes {
  _id?: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  appointmentId: mongoose.Types.ObjectId;
  diagnosis: string;
  notes?: string;
}

export interface MedicalHistoryTypes {
  _id?: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  condition: string;
  diagnosisDate?: Date;
  notes?: string;
  medications?: string[];
  tests?: string[];
  reports?: string[];
  xrays?: string[];
}
