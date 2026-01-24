"use client";
import React, { useState } from "react";
import { Search, Filter, FileText, Activity } from "lucide-react";
import { patients } from "@/app/data/doctorDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface DoctorPatientsProps {
  onPatientSelect: (patient: any) => void;
}

const PatientsPage: React.FC<DoctorPatientsProps> = ({ onPatientSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High":
        return "bg-[#ef4444]";
      case "Medium":
        return "bg-[#f59e0b]";
      case "Low":
        return "bg-[#10b981]";
      default:
        return "bg-gray-500";
    }
  };
  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search patients by name, condition, or ID..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline">Export</Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#e0f2fe] rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#0891b2]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">142</p>
                <p className="text-sm text-gray-600">Total Patients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#d1fae5] rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#10b981]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">128</p>
                <p className="text-sm text-gray-600">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#fef3c7] rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#f59e0b]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">23</p>
                <p className="text-sm text-gray-600">High Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#fee2e2] rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#ef4444]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-600">Pending Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient List */}
      <Card>
        <CardHeader>
          <CardTitle>Patient List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {patients.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center gap-4 p-4 bg-[#f8fafc] rounded-lg border-2 border-gray-200 hover:border-[#0891b2] transition-colors cursor-pointer"
                onClick={() => onPatientSelect(patient)}
              >
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-[#0891b2] text-white">
                    {patient.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">
                      {patient.name}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {patient.age}y, {patient.gender}
                    </Badge>
                    <Badge className={getRiskColor(patient.riskLevel)}>
                      {patient.riskLevel} Risk
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <p className="text-xs text-gray-500">Condition</p>
                      <p className="font-medium">{patient.condition}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Last Visit</p>
                      <p className="font-medium">
                        {new Date(patient.lastVisit).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Next Appointment</p>
                      <p className="font-medium">
                        {patient.nextAppointment
                          ? new Date(
                              patient.nextAppointment,
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          : "Not scheduled"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Records
                  </Button>
                  <Button size="sm" className="bg-[#0891b2]">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientsPage;
