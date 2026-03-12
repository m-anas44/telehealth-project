import { io, Socket } from "socket.io-client";

// Global variable taake instance save rahay
let socket: Socket | undefined;

export const getSocket = (): Socket => {
  if (typeof window === "undefined") return {} as Socket;

  if (!socket) {
    console.log("🔌 Initializing Socket Connection...");

    socket = io("http://localhost:3000", {
      path: "/server",
      transports: ["websocket", "polling"],
      addTrailingSlash: false,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
    });

    // Error handling for better debugging
    socket.on("connect_error", (err) => {
      console.error("❌ Socket Connection Error:", err.message);
    });
  }

  return socket;
};
