import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Availability = ({ user }: { user: any }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#0891b2]" />
            Weekly Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => (
            <div
              key={day}
              className="flex items-center gap-4 p-4 bg-[#f8fafc] rounded-lg"
            >
              <input
                type="checkbox"
                defaultChecked={day !== "Saturday" && day !== "Sunday"}
                className="w-5 h-5 rounded"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{day}</p>
              </div>
              <div className="flex gap-2">
                <Input type="time" defaultValue="09:00" className="w-32" />
                <span className="flex items-center text-gray-500">to</span>
                <Input type="time" defaultValue="17:00" className="w-32" />
              </div>
            </div>
          ))}
          <Button className="w-full bg-[#10b981]">
            <Save className="w-4 h-4 mr-2" />
            Update Schedule
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#10b981]" />
            Consultation Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Default Consultation Duration</Label>
            <select className="w-full mt-2 p-2 border rounded-lg">
              <option>15 minutes</option>
              <option>30 minutes</option>
              <option>45 minutes</option>
              <option>60 minutes</option>
            </select>
          </div>
          <div>
            <Label>Consultation Types</Label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded"
                />
                <span>Video Consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded"
                />
                <span>In-Person Visit</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-5 h-5 rounded" />
                <span>Phone Consultation</span>
              </div>
            </div>
          </div>
          <div>
            <Label>Buffer Time Between Appointments</Label>
            <select className="w-full mt-2 p-2 border rounded-lg">
              <option>No buffer</option>
              <option>5 minutes</option>
              <option>10 minutes</option>
              <option>15 minutes</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Availability;
