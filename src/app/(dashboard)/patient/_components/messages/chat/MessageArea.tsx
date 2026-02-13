"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Paperclip, Send } from "lucide-react";
import { Input } from "@/components/ui/input";

const MessageArea = () => {
  const [messageInput, setMessageInput] = useState("");
  const messages = [
    {
      id: "1",
      sender: "patient",
      message:
        "Good morning Dr. Johnson, I wanted to check in about my blood pressure readings from this week.",
      timestamp: "9:45 AM",
    },
    {
      id: "2",
      sender: "doctor",
      message:
        "Good morning! Thank you for following up. Let me review the readings you sent.",
      timestamp: "9:50 AM",
    },
    {
      id: "3",
      sender: "doctor",
      message:
        "Your blood pressure readings look good. The average is around 128/82, which shows improvement. Continue with the current medication dosage.",
      timestamp: "9:52 AM",
    },
    {
      id: "4",
      sender: "patient",
      message: "That's great to hear! Should I continue monitoring daily?",
      timestamp: "9:55 AM",
    },
    {
      id: "5",
      sender: "doctor",
      message:
        "Yes, please continue daily monitoring for another week. If readings remain stable, we can reduce to weekly checks. Feel free to message me if you notice any concerning changes.",
      timestamp: "10:00 AM",
    },
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Mock send
      setMessageInput("");
    }
  };
  return (
    <div>
      <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "patient" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] p-4 rounded-lg ${
                msg.sender === "patient"
                  ? "bg-[#0891b2] text-white"
                  : "bg-[#f8fafc] text-gray-900 border"
              }`}
            >
              <p className="mb-1">{msg.message}</p>
              <p
                className={`text-xs ${
                  msg.sender === "patient" ? "text-white/70" : "text-gray-500"
                }`}
              >
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
      </CardContent>

      {/* Message Input */}
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Paperclip className="w-4 h-4" />
          </Button>
          <Input
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
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
