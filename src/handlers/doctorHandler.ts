import axios from "axios";
import {
  ProfessionalInput,
  ProfessionalSchema,
} from "@/schemas/doctor/professionalInfoSchema";

export async function getProfessionalInfo() {
  try {
    const { data } = await axios.get("/api/doctor/profile/professionalInfo", {
      withCredentials: true,
    });
    return data ?? null;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.message || err?.message || "Failed to fetch profile",
    );
  }
}

export async function updateProfessionalInfo(payload: ProfessionalInput) {
  const parsed = ProfessionalSchema.parse(payload);
  try {
    const { data } = await axios.put("/api/doctor/profile/professionalInfo", parsed, {
      withCredentials: true,
    });
    return data;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.message || err?.message || "Failed to save profile",
    );
  }
}
