"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { appointments } from "@/app/data/doctorDashboard";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface DoctorScheduleProps {
  onPatientSelect: (patient: any) => void;
}

const SchedulePage: React.FC<DoctorScheduleProps> = ({ onPatientSelect }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const currentWeek = weekDays.map((day, index) => ({
    day,
    date: index + 13,
    appointments:
      index === 2 ? appointments.length : Math.floor(Math.random() * 5) + 1,
  }));
  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-center">
                <h3 className="font-semibold text-gray-900">
                  {selectedDate.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
                <p className="text-sm text-gray-500">
                  Week of January 13-19, 2026
                </p>
              </div>
              <Button variant="outline" size="icon">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-[#0891b2]">Set Availability</Button>
            </div>
          </div>

          {/* Week View */}
          <div className="grid grid-cols-7 gap-2">
            {currentWeek.map((day, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg text-center cursor-pointer transition-colors ${
                  index === 2
                    ? "bg-[#0891b2] text-white"
                    : "bg-[#f8fafc] hover:bg-gray-100"
                }`}
              >
                <p
                  className={`text-sm mb-1 ${index === 2 ? "text-white/80" : "text-gray-500"}`}
                >
                  {day.day}
                </p>
                <p className="text-xl font-semibold mb-1">{day.date}</p>
                <p
                  className={`text-xs ${index === 2 ? "text-white/80" : "text-gray-500"}`}
                >
                  {day.appointments} apt
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#0891b2]" />
            Today's Appointments
          </CardTitle>
          <Badge className="bg-[#10b981]">
            {appointments.filter((a) => a.status === "confirmed").length}{" "}
            Confirmed
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="flex items-center gap-4 p-4 bg-[#f8fafc] rounded-lg border-2 border-gray-200 hover:border-[#0891b2] transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="text-center px-3 py-2 bg-white rounded-lg border">
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {apt.time}
                  </p>
                  <p className="text-xs text-gray-500">{apt.duration}</p>
                </div>
                <Avatar>
                  <AvatarFallback className="bg-[#0891b2] text-white">
                    {apt.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">
                      {apt.patient}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {apt.type === "Video Consultation" ? (
                        <Video className="w-3 h-3 mr-1" />
                      ) : (
                        <MapPin className="w-3 h-3 mr-1" />
                      )}
                      {apt.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{apt.reason}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge
                  className={
                    apt.status === "confirmed" ? "bg-[#10b981]" : "bg-[#f59e0b]"
                  }
                >
                  {apt.status}
                </Badge>
                <Button
                  className="bg-[#0891b2]"
                  onClick={() =>
                    onPatientSelect({ name: apt.patient, avatar: apt.avatar })
                  }
                >
                  {apt.type === "Video Consultation" ? (
                    <>
                      <Video className="w-4 h-4 mr-2" />
                      Join Call
                    </>
                  ) : (
                    "View Details"
                  )}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Availability Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#10b981]" />
            Weekly Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {weekDays.map((day, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{day}day</p>
                  <p className="text-sm text-gray-600">9:00 AM - 5:00 PM</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={index < 5}
                  className="w-5 h-5 rounded"
                />
              </div>
            ))}
          </div>
          <Button className="w-full mt-4 bg-[#10b981]">
            Update Availability
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedulePage;
