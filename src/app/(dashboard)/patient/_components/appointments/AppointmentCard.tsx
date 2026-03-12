"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getViewUrl } from "@/handlers/doctorHandler";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createRoomForAppointment } from "@/handlers/chatHandler";

interface Appointment {
  _id: string;
  doctorName: string;
  doctorImage: string;
  specialization: string[];
  status: string;
  time: string;
  day: string;
  type: string;
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

const AppointmentCard = ({ apt }: { apt: Appointment }) => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const isOnline = apt.type === "online";

  const {data: session, status} = useSession()
  const user = session?.user
  const client = useStreamVideoClient();
  const router = useRouter()

  const handleJoinCall = async () => {
    if (!client || !user || !isOnline) return;

    try {
      const callId = apt._id; 
      const call = client.call("default", callId);

      const startAt = new Date(apt.day);
      const [hours, minutes] = apt.time.split(':');
      startAt.setHours(parseInt(hours), parseInt(minutes));

      await call.getOrCreate({
        data: {
          starts_at: startAt.toISOString(),
          custom: {
            description: `Appointment with Dr. ${apt.doctorName}`,
          },
        },
      });

      router.push(`/meeting/${callId}`);
    } catch (error) {
      console.error("Stream Meeting Error:", error);
    }
  };

  useEffect(() => {
    const fetchImg = async () => {
      if (apt.doctorImage) {
        try {
          const url = await getViewUrl(apt.doctorImage);
          setImgUrl(url);
        } catch (err) {
          console.error("Card Image Error", err);
        }
      }
    };
    fetchImg();
  }, [apt.doctorImage]);

  const appointmentDate = apt.day
    ? new Date(apt.day).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "No Date";

  const appointmentTime = apt.time
    ? new Date(apt.time).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "No Time";

  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-slate-300 group py-4">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* 1. Left Section: Profile & Status Indicator */}
          <div className="relative flex items-center gap-4 p-4 sm:p-6 flex-1">
            <div
              className={`absolute left-0 top-0 bottom-0 w-1 ${getStatusColor(apt.status).includes("bg-green") ? "bg-emerald-500" : "bg-amber-500"}`}
            />

            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 shadow-inner bg-slate-100 flex items-center justify-center ring-4 ring-white">
              {imgUrl ? (
                <Image
                  src={imgUrl}
                  alt={apt.doctorName}
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                  sizes="80px"
                />
              ) : (
                <span className="text-slate-400 text-xl font-bold uppercase">
                  {apt.doctorName?.charAt(0)}
                </span>
              )}
            </div>

            <div className="flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-slate-900 text-lg leading-tight">
                  {apt.doctorName}
                </h3>
                <Badge
                  className={`${getStatusColor(apt.status)} text-[10px] uppercase tracking-wider px-2 py-0 border-none`}
                >
                  {apt.status}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-1">
                {apt.specialization.map((spec, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-medium text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-100 capitalize"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Appointment Meta Info */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{appointmentDate}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{appointmentTime}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium capitalize">
                  {isOnline ? (
                    <Video className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <MapPin className="w-4 h-4 text-blue-500" />
                  )}
                  <span>{apt.type}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Right Section: Action Buttons */}
          <div className="flex items-center bg-slate-50/50 sm:bg-transparent border-t sm:border-t-0 sm:border-l border-slate-100 p-4 sm:p-6">
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              {apt.status === "confirmed" && isOnline && (
                <Button
                onClick={handleJoinCall}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm col-span-2 lg:col-span-1 h-10 px-6">
                  <Video className="w-4 h-4 mr-2" /> Join Call
                </Button>
              )}

                <Button
                  variant="outline"
                  onClick={async () => {
                    try {
                      const room = await createRoomForAppointment(apt._id);
                      router.push(`/patient/messages?room=${room._id}`);
                    } catch (error) {
                      console.error("failed to open chat", error);
                    }
                  }}
                  className="h-10 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm font-medium"
                >
                  Message
                </Button>

              <Button
                variant="ghost"
                className="h-10 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 font-medium transition-colors"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
