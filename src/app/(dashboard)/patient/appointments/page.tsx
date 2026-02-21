"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter, Loader2, Plus, Search } from "lucide-react";
import AppointmentCard from "../_components/appointments/AppointmentCard";
import PastAppointmentCard from "../_components/appointments/PastAppointmentCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import AIAppointment from "../_components/appointments/AIAppointment";
import { getPatientAppointments } from "@/handlers/appointmentHanlder";

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

interface AppointmentResponse {
  data: {
    pending: Appointment[];
    confirmed: Appointment[];
    completed: Appointment[];
    cancelled: Appointment[];
  };
}

const Appointments = () => {
  const [showBooking, setShowBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [loading, setLoading] = useState(true);

  // States for real data
  const [upcomingApts, setUpcomingApts] = useState<Appointment[]>([]);
  const [pastApts, setPastApts] = useState<Appointment[]>([]);
  const [missedApts, setMissedApts] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchApts = async () => {
      try {
        setLoading(true);

        const res: AppointmentResponse = await getPatientAppointments();
        const categorized = res?.data;

        if (categorized) {
          setUpcomingApts([
            ...(categorized.pending || []),
            ...(categorized.confirmed || []),
          ]);

          setPastApts([...(categorized.completed || [])]);
          setMissedApts([...(categorized.cancelled || [])]);
        }
      } catch (err) {
        console.error("Failed to load appointments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApts();
  }, []);

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
            Upcoming ({upcomingApts.length})
          </TabsTrigger>
          <TabsTrigger value="past">Past Consultations</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            <TabsContent value="upcoming" className="space-y-4 mt-4">
              {upcomingApts.length > 0 ? (
                upcomingApts.map((apt) => (
                  <AppointmentCard apt={apt} key={apt._id} />
                ))
              ) : (
                <div className="text-center py-10 rounded-lg text-gray-500">
                  No upcoming appointments found
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4 mt-4">
              {pastApts.length > 0 ? (
                pastApts.map((apt) => (
                  <AppointmentCard apt={apt} key={apt._id} />
                ))
              ) : (
                <div className="text-center py-10 rounded-lg text-gray-500">
                  No past appointments found
                </div>
              )}
            </TabsContent>

            <TabsContent value="cancelled" className="space-y-4 mt-4">
              {missedApts.length > 0 ? (
                missedApts.map((apt) => (
                  <AppointmentCard apt={apt} key={apt._id} />
                ))
              ) : (
                <div className="text-center py-10 rounded-lg text-gray-500">
                  No cancelled appointments found
                </div>
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default Appointments;
