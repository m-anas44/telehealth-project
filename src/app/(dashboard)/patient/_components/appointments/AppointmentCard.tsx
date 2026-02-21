"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getViewUrl } from "@/handlers/doctorHandler";
import Image from "next/image";

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
      })
    : "No Time";

  return (
    <Card className="py-1">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 bg-[#0891b2] rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
            {imgUrl ? (
              <Image
                src={imgUrl}
                alt={apt.doctorName}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <span className="text-white text-xl font-semibold">
                {apt.doctorName?.charAt(0)}
              </span>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900">{apt.doctorName}</h3>
              {apt.specialization.map((spec, i) => (
                <Badge variant="outline" className="capitalize" key={i}>
                  {spec}
                </Badge>
              ))}
              <Badge className={getStatusColor(apt.status)}>{apt.status}</Badge>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> {appointmentDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {appointmentTime}
              </span>
              <span className="flex items-center gap-1 capitalize">
                {isOnline ? (
                  <Video className="w-4 h-4" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
                {apt.type}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            {apt.status === "confirmed" && isOnline && (
              <Button className="bg-[#10b981]">
                <Video className="w-4 h-4 mr-2" /> Join Call
              </Button>
            )}
            <Button variant="outline">Reschedule</Button>
            <Button
              variant="outline"
              className="text-[#ef4444] hover:bg-red-50"
            >
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
