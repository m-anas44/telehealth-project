import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ProfileHeader = ({user}: {user:any}) => {
    
  return (
    <div>
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="bg-[#0891b2] text-white text-2xl">
                {user && user.name}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Patient ID: P-{user?.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
            <Button variant="outline">Change Photo</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileHeader;
