"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Filter,
  Loader2,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BookAppointmentModal from "../../_components/appointments/BookAppointmentModal";
import DoctorCard from "../../_components/appointments/DoctorCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getDoctors } from "@/handlers/doctorHandler";

export default function BookAppointmentPage() {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchDoctors = useCallback(async (query: string) => {
    setLoading(true);
    const data = await getDoctors({ query, limit: 12 });
    console.log(data);
    if (data) {
      setDoctors(data.profiles);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchDoctors(searchQuery);
    }, 400); // Wait 400ms after user stops typing

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, fetchDoctors]);

  const handleOpenBooking = (doctor: any) => {
    setSelectedDoctor(doctor);
    setBookingStep(2);
    setShowBooking(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* --- Breadcrumbs --- */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/patient/appointments">Appointments</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Find Your Doctor
          </h1>
          <p className="text-muted-foreground mt-1">
            Search from thousands of certified specialists.
          </p>
        </div>

        {/* AI Suggestion Banner */}
        <div className="flex items-center gap-3 bg-cyan-50 border border-cyan-100 p-3 rounded-xl">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <Sparkles className="w-5 h-5 text-[#0891b2]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-cyan-900 uppercase tracking-wider">
              AI Recommendation
            </p>
            <p className="text-sm text-cyan-700">
              Dr. Sarah is your most visited specialist.
            </p>
          </div>
        </div>
      </div>

      {/* --- Search & Filter Bar --- */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by name, specialty, or hospital..."
            className="pl-10 h-11 border-none bg-gray-50 focus-visible:ring-1"
          />
        </div>
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-40 h-11 bg-gray-50 border-none">
              <SelectValue placeholder="Specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cardio">Cardiology</SelectItem>
              <SelectItem value="derma">Dermatology</SelectItem>
              <SelectItem value="gp">General Physician</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="h-11 px-5 border-dashed">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* --- Doctor Grid --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-[#0891b2] mb-4" />
          <p className="text-gray-500 animate-pulse">Loading doctors...</p>
        </div>
      ) : doctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor._id}
              doctor={{
                id: doctor._id,
                name: doctor.userId.name,
                bio: doctor.bio,
                specialization:
                  doctor.specialization?.length > 0
                    ? doctor.specialization
                    : "Not Specified",
                experience: doctor.experienceYears,
                city: doctor.userId.city,
                consultationTypes: doctor.consultationTypes,
                image: doctor.userId.image,
                isActive: doctor.isActive ? "Available" : "Away",
              }}
              handleOpenBooking={() => handleOpenBooking(doctor)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed">
          <p className="text-gray-500">
            No doctors found matching your search.
          </p>
        </div>
      )}

      {/* --- The Modal (Reused) --- */}
      {selectedDoctor && (
        <BookAppointmentModal
          doctors={[
            {
              id: selectedDoctor._id,
              name: selectedDoctor.userId.name,
              specialty: selectedDoctor.specialty,
              avatar: selectedDoctor.userId.name.charAt(0),
            },
          ]}
          bookingStep={bookingStep}
          setBookingStep={setBookingStep}
          showBooking={showBooking}
          setShowBooking={setShowBooking}
        />
      )}
    </div>
  );
}
