import axios from "axios";

export async function getUploadUrl(
  fileName: string,
  fileType: string,
  category: string,
) {
  try {
    const { data } = await axios.post(
      "/api/patient/credentials/upload-url",
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
    const { data } = await axios.get("/api/patient/credentials/upload-url", {
      params: { key },
    });
    return data.url;
  } catch (err: any) {
    console.error("Axios Error in getViewUrl:", err);
    throw new Error(err.response?.data?.message || "Failed to get view URL");
  }
};

export async function getPatientFullProfile() {
  try {
    const { data } = await axios.get("/api/patient/profile/personal-info", {
      withCredentials: true,
    });
    return data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to fetch profile");
  }
}

export async function updatePatientInfo(formData: any) {
  try {
    const { data } = await axios.patch(
      "/api/patient/profile/personal-info",
      formData,
      {
        withCredentials: true,
      },
    );
    return data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to update profile");
  }
}

export async function updatePatientHealthSummary(payload: {
  allergies: string[];
  conditions: string[];
}) {
  try {
    const { data } = await axios.post(
      "/api/patient/profile/medical/summary",
      payload,
      {
        withCredentials: true,
      },
    );
    return data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to update profile");
  }
}

export async function updatePatientMedicalRecords(payload: {
  documents: {
    name: string;
    category: string;
    key: string;
    fileType: string;
  }[];
}) {
  try {
    const { data } = await axios.post(
      "/api/patient/profile/medical/documents",
      payload,
      {
        withCredentials: true,
      },
    );
    return data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to update profile");
  }
}

export async function getPatientMedicalHistory() {
  try {
    const { data } = await axios.get("/api/patient/profile/medical", {
      withCredentials: true,
    });
    return data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to fetch profile");
  }
}
