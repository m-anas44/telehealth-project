"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { appointments } from "@/app/data/doctorDashboard";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Video,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AppointmentList from "../_components/schedule/AppointmentList";

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
      // eslint-disable-next-line security/detect-object-injection
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
      <AppointmentList />
    </div>
  );
};

export default SchedulePage;
