import React from "react";
import ProfileHeader from "../_components/profile/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalInfoTab from "../_components/profile/PersonalInfoTab";
import MedicalInfoTab from "../_components/profile/MedicalInfoTab";
import SecurityTab from "../_components/profile/SecurityTab";
import NotificationTab from "../_components/profile/NotificationTab";

const PatientProfile = () => {
  const user = null;
  return (
    <div>
      <div className="space-y-6">
        {/* Profile Header */}
        <ProfileHeader user={user} />

        {/* Profile Settings */}
        <Tabs defaultValue="personal">
          <TabsList>
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            <TabsTrigger value="medical">Medical Information</TabsTrigger>
            <TabsTrigger value="security">Security & Privacy</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal" className="mt-6">
            <PersonalInfoTab user={user} />
          </TabsContent>

          {/* Medical Information */}
          <TabsContent value="medical" className="mt-6">
            <MedicalInfoTab />
          </TabsContent>

          {/* Security & Privacy */}
          <TabsContent value="security" className="mt-6">
            <SecurityTab />
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="mt-6">
            <NotificationTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientProfile;
