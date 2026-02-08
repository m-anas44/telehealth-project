import axios from "axios";

export const updateProfilePicture = async (key: string) => {
  try {
    const { data } = await axios.post("/api/user/profilePicture", { key });
    return data;
  } catch (err: any) {
    throw new Error(
      err.response?.data?.message || "Failed to update profile photo",
    );
  }
};
