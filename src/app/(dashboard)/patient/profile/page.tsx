import React from "react";
import ProfileHeader from "../_components/profile/ProfileHeader";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ProfileTabs from "../_components/profile/profileTabs";

const PatientProfile = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <div className="space-y-6">
        {/* Profile Header */}
        <ProfileHeader user={session?.user} />

        {/* Profile Tabs */}
        <ProfileTabs user={session?.user} />
      </div>
    </div>
  );
};

export default PatientProfile;
