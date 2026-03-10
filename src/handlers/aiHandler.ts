import axios from "axios";

export async function getDoctorSuggestionFromAI() {
  try {
    const response = await axios.get("/api/ai/recommendDoctor", {
      withCredentials: true,
    });
    console.log("ai response from handler: ", response.data);

    return response.data;
  } catch (error: any) {
    console.log("got an error from handler: ", error.response.data);
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch AI suggestion at recommendation",
    );
  }
}

// export async function sendAIMessage(message: string, history: any[] = []) {
//   console.log("getting from payload: ", message, history)
//   try {
//     const response = await axios.post(
//       "/api/ai/chat",
//       { message, history },
//       {
//         withCredentials: true,
//       },
//     );
//     console.log("ai response from handler: ", response.data);

//     return response.data;
//   } catch (error: any) {
//     console.log(
//       "got an error from handler:",
//       error?.response?.data || error.message
//     );

//     throw new Error(
//       error?.response?.data?.message || "Failed to send AI message"
//     );
//   }
// }
// export async function sendAIMessage(
//   message: string,
//   history: any[] = [],
//   userId: string
// ) {
//   try {
//     const response = await axios.post(
//       "/api/ai/chat",
//       { message, history, userId },
//       { withCredentials: true }
//     );

//     return response.data;
//   } catch (error: any) {
//     console.log("AI voice handler error:", error);

//     throw new Error(
//       error.response?.data?.message ||
//       "Failed to send AI message"
//     );
//   }
// }