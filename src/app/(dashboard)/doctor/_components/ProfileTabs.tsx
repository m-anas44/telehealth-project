import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfessionInfo from "./ProfessionInfo";
import Availability from "./Availability";
import Credentials from "./Credentials";
import PersonalSettings from "./PersonalSettings";

const ProfileTabs = ({ user }: { user: any }) => {
  return (
    <div>
      <Tabs defaultValue="professional">
        <TabsList>
          <TabsTrigger value="professional">Professional Info</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
          <TabsTrigger value="personal">Personal Settings</TabsTrigger>
        </TabsList>

        {/* Professional Information */}
        <TabsContent value="professional" className="space-y-6 mt-6">
          <ProfessionInfo user={user} />
        </TabsContent>

        {/* Availability */}
        <TabsContent value="availability" className="space-y-6 mt-6">
          <Availability user={user} />
        </TabsContent>

        {/* Credentials */}
        <TabsContent value="credentials" className="space-y-6 mt-6">
          <Credentials user={user} />
        </TabsContent>

        {/* Personal Settings */}
        <TabsContent value="personal" className="space-y-6 mt-6">
          <PersonalSettings user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileTabs;
