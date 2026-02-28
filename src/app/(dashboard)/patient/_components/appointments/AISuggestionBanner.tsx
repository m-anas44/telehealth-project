"use client";

import { getDoctorSuggestionFromAI } from "@/handlers/aiHandler";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import BookAppointmentModal from "./BookAppointmentModal";

const AISuggestionBanner = ({ allDoctors }: { allDoctors: any[] }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getDoctorSuggestionFromAI();
        setData(res);
      } catch (err) {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const recommendedDoctor = useMemo(() => {
    if (!data?.doctorId || !allDoctors?.length) return [];

    return allDoctors
      .filter((doc) => doc.userId?._id === data.doctorId)
      .map((doc) => ({
        id: doc.userId._id,
        name: doc.userId.name,
        image: doc.userId.image,
        specialization: doc.specialization,
        availability: doc.availability,
        consultationDuration: doc.consultationDuration,
        bufferTime: doc.bufferTime,
        clinicalAddress: doc.clinicalAddress,
        consultationTypes: doc.consultationTypes,
        isActive: doc.isActive,
      }));
  }, [allDoctors, data]);

  if (!loading && !data) return null;

  return (
    <div
      className={`flex min-w-75 items-start gap-3 border p-3 rounded-xl transition-all duration-500 animate-in fade-in slide-in-from-top-2 ${data?.type === "INCOMPLETE_PROFILE" ? "bg-amber-50 border-amber-100" : "bg-cyan-50 border-cyan-100"}`}
    >
      <div className="bg-white p-2 rounded-lg shadow-sm">
        {loading ? (
          <Loader2 className="w-5 h-5 text-[#0891b2] animate-spin" />
        ) : (
          <Sparkles
            className={`w-5 h-5 ${data?.type === "INCOMPLETE_PROFILE" ? "text-amber-500" : "text-[#0891b2]"}`}
          />
        )}
      </div>
      <div className="flex-1">
        <p
          className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${data?.type === "INCOMPLETE_PROFILE" ? "text-amber-900" : "text-cyan-900"}`}
        >
          {data?.type === "INCOMPLETE_PROFILE"
            ? "Action Required"
            : "AI Recommendation"}
        </p>
        {loading ? (
          <div className="h-4 w-3/4 bg-cyan-100 animate-pulse rounded" />
        ) : (
          <div className="max-w-75">
            <p
              className={`text-xs leading-tight mb-2 ${data?.type === "INCOMPLETE_PROFILE" ? "text-amber-700" : "text-cyan-700"}`}
            >
              {data?.type === "INCOMPLETE_PROFILE"
                ? data.message
                : data.reasoning}
            </p>
            {data?.type === "INCOMPLETE_PROFILE" ? (
              <Link
                href="/dashboard/profile"
                className="flex items-center text-xs font-bold text-amber-600 hover:text-amber-700 shrink-0 mt-1"
              >
                Update <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            ) : (
              <button
                className="flex items-center text-xs font-bold text-blue-600 hover:text-blue-700 shrink-0 cursor-pointer"
                onClick={() => setShowBooking(true)}
                disabled={recommendedDoctor.length === 0}
              >
                {recommendedDoctor.length > 0
                  ? "Start Booking"
                  : "Doctor Not Found"}{" "}
                <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            )}
          </div>
        )}
      </div>

      {showBooking && recommendedDoctor.length > 0 && (
        <BookAppointmentModal
          doctors={recommendedDoctor}
          bookingStep={bookingStep}
          setBookingStep={setBookingStep}
          showBooking={showBooking}
          setShowBooking={setShowBooking}
        />
      )}
    </div>
  );
};

export default AISuggestionBanner;
