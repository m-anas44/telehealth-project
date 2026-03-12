"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare, Search } from "lucide-react";
import ChatHeader from "./chat/ChatHeader";
import MessageArea from "./chat/MessageArea";
import { getSocket } from "@/lib/socket";
import { getConversations } from "@/handlers/chatHandler";
import { getViewUrl } from "@/handlers/doctorHandler";
import Image from "next/image";

const ConversationList = () => {
  const { data: session } = useSession();

  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);

  const params = useSearchParams();

  const fetchProfilePic = async (imageKey: string) => {
    if (imageKey) {
      try {
        const url = await getViewUrl(imageKey);
        return url;
      } catch (err) {
        console.error("Failed to load profile picture", err);
        return "";
      }
    }
  };

  useEffect(() => {
    const s = getSocket();
    if (!s.connected) s.connect();

    async function load() {
      try {
        const { rooms } = await getConversations();
        console.log("rooms: ", rooms);
        // rooms already have doctor/patient objects and lastMessage
        const mapped = await Promise.all(
          rooms.map(async (r: any) => {
            const meId = session?.user?.id;
            const partner =
              r.doctor?._id.toString() === meId ? r.patient : r.doctor;
            const name = partner?.name || "";
            const avatarUrl = await fetchProfilePic(partner?.image || "");
            return {
              id: r.id,
              displayName: name,
              doctorName: r.doctor?.name,
              patientName: r.patient?.name,
              specialty: r.doctor?.specialization
                ? r.doctor.specialization[0]
                : undefined,
              lastMessage: r.lastMessage,
              timestamp: r.lastTimestamp
                ? new Date(r.lastTimestamp).toLocaleTimeString()
                : "",
              unread: 0,
              avatarUrl,
              avatarText: name
                .split(" ")
                .map((n: string) => n.charAt(0))
                .join("")
                .toUpperCase(),
              online: false,
              raw: r,
            };
          }),
        );
        setConversations(mapped);

        // if room query present, auto-select
        const roomParam = params.get("room");
        if (roomParam) {
          const found = mapped.find(
            (c: any) => c.raw.id === roomParam || c.id === roomParam,
          );
          if (found) setSelectedChat(found);
        }
      } catch (e) {
        console.error("error loading conversations", e);
      }
    }
    if (session?.user) load();
  }, [session, params]);

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
                      {conv.avatarUrl ? (
                        <Image
                          src={conv.avatarUrl}
                          alt={conv.doctorName || conv.patientName}
                          width={500}
                          height={500}
                          className="object-cover"
                        />
                      ) : (
                        <AvatarFallback className="bg-[#0891b2] text-white">
                          {conv.avatarText}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {conv.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#10b981] border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {conv.displayName}
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
          <Card className="h-full flex flex-col pb-0">
            {/* Chat Header */}
            <ChatHeader selectedChat={selectedChat} />

            {/* Messages Area */}
            <MessageArea selectedChat={selectedChat} />
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
