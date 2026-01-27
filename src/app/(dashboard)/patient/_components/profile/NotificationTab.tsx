import React from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Save } from 'lucide-react';

const NotificationTab = () => {
  return (
    <div className='space-y-6'>
        <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#0891b2]" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Appointment Reminders</p>
                  <p className="text-sm text-gray-600">Get notified about upcoming appointments</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </div>
              <div className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Message Notifications</p>
                  <p className="text-sm text-gray-600">New messages from doctors</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </div>
              <div className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Lab Results</p>
                  <p className="text-sm text-gray-600">When new test results are available</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </div>
              <div className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Marketing & Updates</p>
                  <p className="text-sm text-gray-600">News and product updates</p>
                </div>
                <input type="checkbox" className="w-5 h-5 rounded" />
              </div>
              <Button className="bg-[#0891b2]">
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
    </div>
  )
}

export default NotificationTab