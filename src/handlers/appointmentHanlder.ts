import axios from "axios";

export async function createAppointment(payload: any) {
  try {
    const { data } = await axios.post("/api/appointment", payload, {
      withCredentials: true,
    });
    return { data };
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response?.data?.message || "Failed to fetch profile");
  }
}

export async function getPatientAppointments() {
  try {
    const response = await axios.get("/api/appointment/patient", {
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch appointments",
    );
  }
}

export async function getBookedSlots(doctorId: string, date: string) {
  try {
    const { data } = await axios.get(
      `/api/appointment/booked?doctorId=${doctorId}&date=${date}`,
    );
    return data.bookedTimes; // Example: ["10:30 AM", "04:00 PM"]
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch appointments slots",
    );
  }
}
