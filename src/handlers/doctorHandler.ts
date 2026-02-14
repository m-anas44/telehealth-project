import axios from "axios";
import {
  ProfessionalInput,
  ProfessionalSchema,
} from "@/schemas/doctor/professionalInfoSchema";
import { DoctorsResponse } from "@/types/doctorTypes";

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
    const { data } = await axios.put(
      "/api/doctor/profile/professionalInfo",
      parsed,
      {
        withCredentials: true,
      },
    );
    return data;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.message || err?.message || "Failed to save profile",
    );
  }
}

export async function getAvailability() {
  try {
    const { data } = await axios.get("/api/doctor/profile/availability", {
      withCredentials: true,
    });
    return data?.availability ?? null;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch availability",
    );
  }
}

export async function updateAvailability(payload: any) {
  try {
    console.log(payload);
    const { data } = await axios.put(
      "/api/doctor/profile/availability",
      { availability: payload },
      { withCredentials: true },
    );
    return data;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.message ||
        err?.message ||
        "Failed to update availability",
    );
  }
}

export async function getConsultationSettings() {
  const { data } = await axios.get(
    "/api/doctor/profile/consultation-settings",
    { withCredentials: true },
  );
  return data;
}

export async function updateConsultationSettings(payload: any) {
  const { data } = await axios.put(
    "/api/doctor/profile/consultation-settings",
    payload,
    { withCredentials: true },
  );
  return data;
}

export async function getCredentials() {
  try {
    const { data } = await axios.get("/api/doctor/credentials", {
      withCredentials: true,
    });
    return data ?? null;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch credentials",
    );
  }
}

export async function updateCredentials(payload: any) {
  try {
    const { data } = await axios.put("/api/doctor/credentials", payload, {
      withCredentials: true,
    });
    return data;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.message ||
        err?.message ||
        "Failed to update credentials",
    );
  }
}

export async function getUploadUrl(
  fileName: string,
  fileType: string,
  category: string,
) {
  try {
    const { data } = await axios.post(
      "/api/doctor/credentials/upload-url",
      { fileName, fileType, category },
      { withCredentials: true },
    );
    return data;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.message ||
        err?.message ||
        "Failed to get upload url",
    );
  }
}

export const getViewUrl = async (key: string) => {
  try {
    const { data } = await axios.get("/api/doctor/credentials/upload-url", {
      params: { key },
    });
    return data.url;
  } catch (err: any) {
    console.error("Axios Error in getViewUrl:", err);
    throw new Error(err.response?.data?.message || "Failed to get view URL");
  }
};

export async function saveDocument({
  key,
  category,
  fileName,
}: {
  key: string;
  category: string;
  fileName?: string;
}) {
  try {
    const { data } = await axios.post(
      "/api/doctor/credentials/documents",
      { key, category, fileName },
      { withCredentials: true },
    );
    return data;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.message || err?.message || "Failed to save document",
    );
  }
}

export async function getDoctors({
  query = "",
  page = 1,
  limit = 10,
}: {
  query?: string;
  page?: number;
  limit?: number;
} = {}): Promise<DoctorsResponse | null> {
  try {
    const params = new URLSearchParams({
      query,
      page: page.toString(),
      limit: limit.toString(),
    });

    const { data } = await axios.get(`/api/doctor?${params.toString()}`, {
      withCredentials: true,
    });
console.log("fron handler: ", data)
    return data;
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}
