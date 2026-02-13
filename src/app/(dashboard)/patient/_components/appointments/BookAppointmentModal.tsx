"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle2, MapPin, Search, Video } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const BookAppointmentModal = ({
  doctors,
  bookingStep,
  setBookingStep,
  showBooking,
  setShowBooking,
}: any) => {
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const handleBookAppointment = () => {
    // Mock booking
    setShowBooking(false);
    setBookingStep(1);
    setSelectedDoctor(null);
    setSelectedDate("");
    setSelectedTime("");
  };
   const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
  ];
  
  return (
    <div>
      <Dialog open={showBooking} onOpenChange={setShowBooking}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book New Appointment</DialogTitle>
            <DialogDescription>
              Step {bookingStep} of 3 -{" "}
              {bookingStep === 1
                ? "Select Doctor"
                : bookingStep === 2
                  ? "Choose Date & Time"
                  : "Confirm Booking"}
            </DialogDescription>
          </DialogHeader>

          {/* Step 1: Select Doctor */}
          {bookingStep === 1 && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name or specialty..."
                  className="pl-10"
                />
              </div>
              <div className="space-y-3">
                {doctors.map((doctor: any) => (
                  <Card
                    key={doctor.id}
                    className={`cursor-pointer transition-all ${
                      selectedDoctor?.id === doctor.id
                        ? "border-2 border-[#0891b2] bg-[#e0f2fe]"
                        : "hover:border-[#0891b2]"
                    }`}
                    onClick={() => setSelectedDoctor(doctor)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-[#0891b2] rounded-full flex items-center justify-center text-white font-semibold">
                          {doctor.avatar}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {doctor.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {doctor.specialty} • {doctor.experience} experience
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-[#f59e0b]">
                              ★ {doctor.rating}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              Available Today
                            </Badge>
                          </div>
                        </div>
                        {selectedDoctor?.id === doctor.id && (
                          <CheckCircle2 className="w-6 h-6 text-[#0891b2]" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button
                className="w-full bg-[#0891b2]"
                disabled={!selectedDoctor}
                onClick={() => setBookingStep(2)}
              >
                Continue
              </Button>
            </div>
          )}

          {/* Step 2: Select Date & Time */}
          {bookingStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label>Select Date</Label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="mt-2"
                />
              </div>
              {selectedDate && (
                <div>
                  <Label>Available Time Slots</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        className={selectedTime === time ? "bg-[#0891b2]" : ""}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setBookingStep(1)}
                >
                  Back
                </Button>
                <Button
                  className="flex-1 bg-[#0891b2]"
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setBookingStep(3)}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {bookingStep === 3 && (
            <div className="space-y-4">
              <Card className="bg-[#f8fafc]">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label className="text-gray-600">Doctor</Label>
                    <p className="font-semibold">{selectedDoctor?.name}</p>
                    <p className="text-sm text-gray-600">
                      {selectedDoctor?.specialty}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Date & Time</Label>
                    <p className="font-semibold">
                      {selectedDate &&
                        new Date(selectedDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                      at {selectedTime}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Consultation Type</Label>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" className="flex-1">
                        <Video className="w-4 h-4 mr-2" />
                        Video Call
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <MapPin className="w-4 h-4 mr-2" />
                        In-Person
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Reason for Visit (Optional)</Label>
                    <Input
                      placeholder="Brief description..."
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setBookingStep(2)}
                >
                  Back
                </Button>
                <Button
                  className="flex-1 bg-[#10b981]"
                  onClick={handleBookAppointment}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Confirm Booking
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookAppointmentModal;
