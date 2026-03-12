"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Video, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getDoctorAppointments,
  confirmAppointment,
} from "@/handlers/doctorHandler";
import { useSession } from "next-auth/react";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { createRoomForAppointment } from "@/handlers/chatHandler";

interface Appointment {
  _id: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  type: "online" | "in-person" | "phone";
  time: string;
  day: string;
  patientId: {
    name: string;
    email: string;
  };
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-[#10b981]";
    case "pending":
      return "bg-[#f59e0b]";
    case "cancelled":
      return "bg-[#ef4444]";
    case "completed":
      return "bg-gray-500";
    default:
      return "bg-gray-400";
  }
};

const AppointmentList = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState<string | null>(null);
  const { data: session } = useSession();
  const user = session?.user;
  const client = useStreamVideoClient();
  const router = useRouter();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await getDoctorAppointments();
      setAppointments(response.data || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleConfirmAppointment = async (appointmentId: string) => {
    try {
      setConfirming(appointmentId);
      await confirmAppointment(appointmentId);
      await fetchAppointments();
    } catch (error) {
      console.error("Error confirming appointment:", error);
    } finally {
      setConfirming(null);
    }
  };

  const confirmedCount = appointments.filter(
    (a) => a.status === "confirmed",
  ).length;

  const getAppointmentTime = (_: string, time: string) => {
    try {
      const appointmentDate = new Date(time);
      return appointmentDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "N/A";
    }
  };

  const getDuration = () => "30 min";

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#0891b2]" />
            Appointments
          </CardTitle>
          <Badge className="bg-[#10b981]">{confirmedCount} Confirmed</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 bg-[#f8fafc] rounded-lg border-2 border-gray-200"
                >
                  <Skeleton className="w-20 h-16 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-10 w-24" />
                </div>
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No appointments found
            </p>
          ) : (
            appointments.map((apt) => {
              const handleJoinCall = async () => {
                if (!client || !user || apt.status !== "confirmed") return;

                try {
                  const callId = apt._id;
                  const call = client.call("default", callId);

                  const startAt = new Date(apt.day);
                  const [hours, minutes] = apt.time.split(":");
                  startAt.setHours(parseInt(hours), parseInt(minutes));

                  await call.getOrCreate({
                    data: {
                      starts_at: startAt.toISOString(),
                      custom: {
                        description: `Consultation with ${apt.patientId?.name || "Patient"}`,
                      },
                    },
                  });

                  router.push(`/meeting/${callId}`);
                } catch (error) {
                  console.error("Stream Meeting Error:", error);
                }
              };
              return (
                <div
                  key={apt._id}
                  className="flex items-center gap-4 p-4 bg-[#f8fafc] rounded-lg border-2 border-gray-200 hover:border-[#0891b2] transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-center px-3 py-2 bg-white rounded-lg border">
                      <p className="text-xs text-gray-500">Time</p>
                      <p className="font-semibold text-gray-900 text-sm">
                        {getAppointmentTime(apt.day, apt.time)}
                      </p>
                      <p className="text-xs text-gray-500">{getDuration()}</p>
                    </div>
                    <Avatar>
                      <AvatarFallback className="bg-[#0891b2] text-white">
                        {getInitials(apt.patientId.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">
                          {apt.patientId.name}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {apt.type === "online" ? (
                            <Video className="w-3 h-3 mr-1" />
                          ) : (
                            <MapPin className="w-3 h-3 mr-1" />
                          )}
                          {apt.type === "online"
                            ? "Video Consultation"
                            : apt.type === "in-person"
                              ? "In-Person"
                              : "Phone"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {apt.patientId.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={`${getStatusColor(apt.status)}`}>
                      {apt.status}
                    </Badge>
                    {apt.status === "pending" ? (
                      <Button
                        className="bg-[#0891b2]"
                        onClick={() => handleConfirmAppointment(apt._id)}
                        disabled={confirming === apt._id}
                      >
                        {confirming === apt._id ? "Confirming..." : "Confirm"}
                      </Button>
                    ) : (
                      <>
                        {apt.type === "online" && (
                          <Button
                            className="bg-[#0891b2]"
                            onClick={handleJoinCall}
                          >
                            <Video className="w-4 h-4 mr-2" />
                            Join Call
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          onClick={async () => {
                            try {
                              const room = await createRoomForAppointment(
                                apt._id,
                              );
                              router.push(`/doctor/messages?room=${room._id}`);
                            } catch (err) {
                              console.error("failed to open chat", err);
                            }
                          }}
                          className="h-10 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm font-medium"
                        >
                          Message
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentList;
