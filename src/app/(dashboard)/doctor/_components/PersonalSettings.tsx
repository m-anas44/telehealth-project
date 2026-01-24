import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const PersonalSettings = ({ user }: { user: any }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input id="currentPassword" type="password" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" className="mt-2" />
          </div>
          <Button className="bg-[#0891b2]">Update Password</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-lg">
            <div>
              <p className="font-medium text-gray-900">
                New Appointment Notifications
              </p>
              <p className="text-sm text-gray-600">
                Get notified when patients book appointments
              </p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
          </div>
          <div className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Patient Messages</p>
              <p className="text-sm text-gray-600">
                New messages from patients
              </p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
          </div>
          <div className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Lab Results Ready</p>
              <p className="text-sm text-gray-600">
                When lab results are available for review
              </p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalSettings;
