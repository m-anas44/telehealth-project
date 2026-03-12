"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Paperclip, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getMessages, postMessage } from "@/handlers/chatHandler";
import { getSocket } from "@/lib/socket";
import { useSession } from "next-auth/react";

interface Message {
  _id: string;
  roomId?: string;
  senderId: string;
  content: string;
  createdAt: string;
  type?: string;
}

interface MessageAreaProps {
  selectedChat: any;
}

const MessageArea = ({ selectedChat }: MessageAreaProps) => {
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = React.useRef<any>(null);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  // load history when room changes
  useEffect(() => {
    if (!selectedChat) return;

    async function init() {
      try {
        const { messages } = await getMessages(selectedChat.raw.id);
        setMessages(messages);
      } catch (e) {
        console.error("failed to load messages", e);
      }

      const socket = getSocket();
      socketRef.current = socket;

      // connect if not connected
      if (!socket.connected) {
        socket.connect();
      }

      // join room
      socket.emit("join_room", selectedChat.raw.id);

      // listener
      const receiveHandler = (msg: Message) => {
        if (msg.roomId === selectedChat.raw.id) {
          setMessages((prev) => [...prev, msg]);
        }
      };

      socket.on("receive_message", receiveHandler);

      return () => {
        socket.off("receive_message", receiveHandler);
      };
    }
    init();
  }, [selectedChat]);

  const { data: session } = useSession();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    const text = messageInput.trim();
    if (!text || !selectedChat) return;

    const socket = socketRef.current;
    const payload = {
      roomId: selectedChat.raw.id,
      content: text,
      senderId: session?.user?.id || "",
    };

    if (socket && socket.connected) {
      socket.emit("send_message", payload);
    } else {
      // fallback via HTTP
      try {
        await postMessage(selectedChat.raw.id, { content: text });
      } catch (err) {
        console.error("message fallback failed", err);
      }
    }

    setMessageInput("");
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <CardContent className="flex-1 overflow-y-auto p-6">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${
              msg.senderId !== selectedChat?.raw?.patientId
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] p-4 rounded-lg ${
                msg.senderId !== selectedChat?.raw?.patientId
                  ? "bg-[#0891b2] text-white"
                  : "bg-[#f8fafc] text-gray-900 border"
              }`}
            >
              <p className="mb-1">{msg.content}</p>
              <p className={`text-xs ${
                msg.senderId !== selectedChat?.raw?.patientId
                  ? " text-gray-100"
                  : " text-gray-400"
              }`}>
                {new Date(msg.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Message Input */}
      <div className="border-t p-4 mt-auto">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} className="bg-[#0891b2]">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Messages are encrypted and HIPAA compliant
        </p>
      </div>
    </div>
  );
};

export default MessageArea;
