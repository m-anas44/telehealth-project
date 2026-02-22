import axios from "axios";

export async function getDoctorSuggestionFromAI() {
  try {
    const response = await axios.get("/api/ai/recommendDoctor", {
      withCredentials: true,
    });
    console.log("ai response from handler: ", response.data)

    return response.data;
  } catch (error: any) {
    console.log("got an error from handler: ", error.response.data)
    throw new Error(
      error.response?.data?.message || "Failed to fetch AI suggestion at recommendation",
    );
  }
}