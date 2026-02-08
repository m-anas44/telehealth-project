import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalInfoTab from "./PersonalInfoTab";
import MedicalInfoTab from "./MedicalInfoTab";
import SecurityTab from "./SecurityTab";
import NotificationTab from "./NotificationTab";

const ProfileTabs = ({ user }: { user: any }) => {
  return (
    <div>
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
          <PersonalInfoTab />
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
  );
};

export default ProfileTabs;
