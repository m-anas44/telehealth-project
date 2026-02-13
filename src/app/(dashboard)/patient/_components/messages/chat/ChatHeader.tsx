import React from "react";
import { CardHeader } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreVertical, Phone, Video } from "lucide-react";
const ChatHeader = ({ selectedChat }: any) => {
  return (
    <div>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-[#0891b2] text-white">
                {selectedChat.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">
                {selectedChat.doctor}
              </h3>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500">
                  {selectedChat.specialty}
                </p>
                {selectedChat.online && (
                  <span className="flex items-center gap-1 text-xs text-[#10b981]">
                    <div className="w-2 h-2 bg-[#10b981] rounded-full"></div>
                    Online
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
    </div>
  );
};

export default ChatHeader;
