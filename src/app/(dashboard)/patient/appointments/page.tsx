"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter, Plus, Search } from "lucide-react";
import AppointmentCard from "../_components/appointments/AppointmentCard";
import PastAppointmentCard from "../_components/appointments/PastAppointmentCard";
import BookAppointmentModal from "../_components/appointments/BookAppointmentModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import AIAppointment from "../_components/appointments/AIAppointment";
import { getPatientAppointments } from "@/handlers/appointmentHanlder";

interface AppointmentTypes {
  data: {
    pending: [];
    confirmed: [];
    completed: [];
    cancelled: [];
  };
}

const Appointments = () => {
  const [showBooking, setShowBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [loading, setLoading] = useState(true);

  // States for real data
  const [upcomingApts, setUpcomingApts] = useState([]);
  const [pastApts, setPastApts] = useState([]);

  // Fetch data on mount
  useEffect(() => {
    const fetchApts = async () => {
      try {
        setLoading(true);
        const { data }: AppointmentTypes = await getPatientAppointments();
        console.log("doctors apointment data: ", data)
        const upcoming = [...data.pending, ...data.confirmed];
        const past = [...data?.completed];

        setUpcomingApts(upcoming);
        setPastApts(past);
      } catch (err) {
        console.error("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };
    fetchApts();
  }, []);

  const doctors = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      experience: "15 years",
      rating: 4.9,
      avatar: "SJ",
      available: true,
    },
    {
      id: "2",
      name: "Dr. Michael Chen",
      specialty: "General Physician",
      experience: "10 years",
      rating: 4.8,
      avatar: "MC",
      available: true,
    },
    {
      id: "3",
      name: "Dr. Emily Davis",
      specialty: "Dermatologist",
      experience: "12 years",
      rating: 4.9,
      avatar: "ED",
      available: true,
    },
  ];

  const appointments = [
    {
      id: "1",
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      date: "2026-01-18",
      time: "10:00 AM",
      type: "Video Consultation",
      status: "confirmed",
    },
    {
      id: "2",
      doctor: "Dr. Michael Chen",
      specialty: "General Physician",
      date: "2026-01-22",
      time: "2:30 PM",
      type: "In-Person",
      status: "pending",
    },
  ];

  const pastAppointments = [
    {
      id: "3",
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      date: "2026-01-05",
      time: "11:00 AM",
      type: "Video Consultation",
      status: "completed",
    },
    {
      id: "4",
      doctor: "Dr. Emily Davis",
      specialty: "Dermatologist",
      date: "2025-12-28",
      time: "3:00 PM",
      type: "In-Person",
      status: "completed",
    },
  ];

  return (
    <div className="space-y-6">
      <AIAppointment />
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search appointments..."
              className="pl-10 w-80"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
        <Button className="bg-[#0891b2]" onClick={() => setShowBooking(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Book Appointment
        </Button>
      </div>

      {/* Appointments Tabs */}
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({appointments.length})
          </TabsTrigger>
          <TabsTrigger value="past">Past Consultations</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-4">
          {appointments.map((apt) => (
            <AppointmentCard apt={apt} key={apt.id} />
          ))}
        </TabsContent>

        <TabsContent value="past" className="space-y-4 mt-4">
          {pastAppointments.map((apt) => (
            <PastAppointmentCard apt={apt} key={apt.id} />
          ))}
        </TabsContent>
      </Tabs>

      {/* Booking Dialog */}
      <BookAppointmentModal
        doctors={doctors}
        bookingStep={bookingStep}
        setBookingStep={setBookingStep}
        showBooking={showBooking}
        setShowBooking={setShowBooking}
      />
    </div>
  );
};

export default Appointments;
