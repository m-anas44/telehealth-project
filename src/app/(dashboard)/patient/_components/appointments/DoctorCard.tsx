"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Star,
  MapPin,
  Video,
  UserCheck,
  Phone,
  Clock,
  ChevronRight,
} from "lucide-react";
import { getViewUrl } from "@/handlers/doctorHandler";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DoctorCard = ({ doctor, handleOpenBooking }: any) => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImg = async () => {
      if (doctor.image) {
        try {
          const url = await getViewUrl(doctor.image);
          setImgUrl(url);
        } catch (err) {
          console.error("Card Image Error", err);
        }
      }
    };
    fetchImg();
  }, [doctor.image]);

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-gray-100 overflow-hidden bg-white p-0">
      <CardContent className="p-0">
        {/* Top Section: Avatar & Basic Info */}
        <div className="p-5 flex gap-4">
          <div className="relative w-20 h-20">
            <Avatar className="w-20 h-20 rounded-full border-2 border-white shadow-sm">
              <AvatarImage src={imgUrl || ""} className="object-cover" />
              <AvatarFallback className="bg-cyan-600 text-white text-xl font-bold">
                {doctor.name[0]}
              </AvatarFallback>
            </Avatar>
            {doctor.isActive && (
              <div className="absolute bottom-2 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>

          <div className="flex-1 space-y-1">
            <div className="">
              <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#0891b2] transition-colors">
                {doctor.name}
              </h3>
              <p className="text-[10px] text-muted-foreground line-clamp-2">{doctor.bio}</p>
            </div>

            {/* Specialization Badges */}
            <div className="flex flex-wrap gap-1 mt-1">
              {doctor.specialization?.map((spec: string, idx: number) => (
                <span
                  key={idx}
                  className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                >
                  {spec}
                </span>
              ))}
            </div>

            <div className="flex items-center text-gray-500 gap-1 mt-2">
              <MapPin className="w-3.5 h-3.5 text-[#0891b2]" />
              <span className="text-xs">
                {doctor.city || "Remote / No City"}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 border-y border-gray-50 bg-gray-50/50">
          <div className="p-3 text-center border-r border-gray-50">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
              Experience
            </p>
            <p className="text-sm font-bold text-gray-700">
              {doctor.experienceYears || doctor.experience} Years
            </p>
          </div>
          <div className="p-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
              Availability
            </p>
            <div className="flex justify-center gap-2 mt-0.5">
              {doctor.consultationTypes?.video && (
                <Video className="w-4 h-4 text-cyan-600" />
              )}
              {doctor.consultationTypes?.inPerson && (
                <UserCheck className="w-4 h-4 text-emerald-600" />
              )}
              {doctor.consultationTypes?.phone && (
                <Phone className="w-4 h-4 text-blue-600" />
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4">
          <Button
            className="w-full bg-[#0891b2] hover:bg-[#07809e] shadow-md hover:shadow-lg transition-all rounded-xl h-11 group/btn"
            onClick={handleOpenBooking}
          >
            Book Appointment
            <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
