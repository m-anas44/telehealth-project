"use client";
import React, { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare, Search } from "lucide-react";
import ChatHeader from "./chat/ChatHeader";
import MessageArea from "./chat/MessageArea";

const ConversationList = () => {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const conversations = [
    {
      id: "1",
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      lastMessage:
        "Your blood pressure readings look good. Continue with the current medication.",
      timestamp: "10 min ago",
      unread: 1,
      avatar: "SJ",
      online: true,
    },
    {
      id: "2",
      doctor: "Dr. Michael Chen",
      specialty: "General Physician",
      lastMessage:
        "I have reviewed your test results. Let's schedule a follow-up.",
      timestamp: "2 hours ago",
      unread: 0,
      avatar: "MC",
      online: false,
    },
  ];
  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      <div className="col-span-4">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#0891b2]" />
              Messages
            </CardTitle>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search conversations..." className="pl-10" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2 p-4">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedChat(conv)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedChat?.id === conv.id
                    ? "bg-[#e0f2fe] border-2 border-[#0891b2]"
                    : "bg-[#f8fafc] hover:bg-gray-100"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarFallback className="bg-[#0891b2] text-white">
                        {conv.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {conv.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#10b981] border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {conv.doctor}
                      </h4>
                      {conv.unread > 0 && (
                        <Badge className="bg-[#ef4444] ml-2">
                          {conv.unread}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-1">
                      {conv.specialty}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {conv.lastMessage}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {conv.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Chat Area */}
      <div className="col-span-8">
        {selectedChat ? (
          <Card className="h-full flex flex-col">
            {/* Chat Header */}
            <ChatHeader selectedChat={selectedChat} />

            {/* Messages Area */}
            <MessageArea />
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">
                Select a conversation to start messaging
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
