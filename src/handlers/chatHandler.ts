import axios from "axios";

export async function getConversations() {
  try {
    const { data } = await axios.get("/api/chat/rooms", {
      withCredentials: true,
    });
    return data;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.message || err?.message || "Failed to load conversations",
    );
  }
}

export async function getMessages(roomId: string) {
  try {
    const { data } = await axios.get(`/api/chat/rooms/${roomId}/messages`, {
      withCredentials: true,
    });
    return data;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.message || err?.message || "Failed to load messages",
    );
  }
}

// fall-back for sending via HTTP if socket isn't available
export async function postMessage(roomId: string, payload: { content: string; type?: string }) {
  try {
    const { data } = await axios.post(
      `/api/chat/rooms/${roomId}/messages`,
      payload,
      { withCredentials: true },
    );
    return data;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.message || err?.message || "Failed to send message",
    );
  }
}

export async function createRoomForAppointment(appointmentId: string) {
  try {
    const { data } = await axios.post(
      "/api/chat/rooms/create",
      { appointmentId },
      { withCredentials: true },
    );
    return data.room;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.message || err?.message || "Failed to create room",
    );
  }
}
