import { createServer } from "http";
import next from "next";
import { parse } from "url";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url || "", true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    path: "/api/socket", // Custom path
    addTrailingSlash: false,
  });

  io.on("connection", (socket: any) => {
    console.log("🚀 Socket connected:", socket.id);

    socket.on("join_room", (roomId: string) => {
      socket.join(roomId);
      console.log(`👤 ${socket.id} joined ${roomId}`);
    });

    socket.on("send_message", async (data: any) => {
      // Note: MongoDB logic yahan add karein (Import Chat model)
      io.to(data.roomId).emit("receive_message", data);
    });

    socket.on("disconnect", () => console.log("👋 Disconnected"));
  });

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
