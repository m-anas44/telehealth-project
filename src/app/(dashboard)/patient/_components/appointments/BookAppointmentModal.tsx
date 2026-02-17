"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
  Video,
  Calendar as CalendarIcon,
  Phone,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { getViewUrl } from "@/handlers/doctorHandler";
import toast from "react-hot-toast";
import {
  createAppointment,
  getBookedSlots,
} from "@/handlers/appointmentHanlder";

const BookAppointmentModal = ({
  doctors,
  bookingStep,
  setBookingStep,
  showBooking,
  setShowBooking,
}: any) => {
  const [selectedDoctor] = useState<any>(doctors?.[0] || null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedMode, setSelectedMode] = useState<string>("");
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  useEffect(() => {
    const fetchImg = async () => {
      if (selectedDoctor.image) {
        try {
          const url = await getViewUrl(selectedDoctor.image);
          console.log("modal: ", selectedDoctor);
          setImgUrl(url);
        } catch (err) {
          console.error("Card Image Error", err);
        }
      }
    };
    fetchImg();
  }, [selectedDoctor.image]);

  useEffect(() => {
    if (selectedDate && selectedDoctor) {
      const fetchBooked = async () => {
        setIsLoadingSlots(true);
        try {
          const slots = await getBookedSlots(selectedDoctor.id, selectedDate);
          setBookedSlots(slots);
        } catch (err) {
          console.error("Failed to fetch booked slots");
        } finally {
          setIsLoadingSlots(false); // End loading
        }
      };
      fetchBooked();
    }
  }, [selectedDate, selectedDoctor]);

  const docAvailability = selectedDoctor?.availability?.weekly || [];
  const availableDays = docAvailability
    .filter((d: any) => d.isAvailable)
    .map((d: any) => d.day);

  const availableSlots = useMemo(() => {
    if (!selectedDate || !selectedDoctor) return [];

    const dateObj = new Date(selectedDate);
    const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });

    const dayConfig = docAvailability.find((a: any) => a.day === dayName);
    if (
      !dayConfig ||
      !dayConfig.isAvailable ||
      !dayConfig.startTime ||
      !dayConfig.endTime
    )
      return [];

    const slots = [];
    const duration = selectedDoctor.consultationDuration || 15;
    const buffer = selectedDoctor.bufferTime || 0;
    const totalStep = duration + buffer;

    const timeToMinutes = (time: string) => {
      const [hrs, mins] = time.split(":").map(Number);
      return hrs * 60 + mins;
    };

    const minutesToTime = (totalMinutes: number) => {
      const hrs = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      const period = hrs >= 12 ? "PM" : "AM";
      const displayHrs = hrs % 12 || 12;

      // Use .padStart(2, "0") on the hour to match "03:20 PM" format
      return `${displayHrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")} ${period}`;
    };

    let current = timeToMinutes(dayConfig.startTime);
    const end = timeToMinutes(dayConfig.endTime);

    while (current + duration <= end) {
      slots.push(minutesToTime(current));
      current += totalStep;
    }

    return slots;
  }, [selectedDate, selectedDoctor, docAvailability]);

  const isDoctorFullyUnavailable = availableDays.length === 0;

  const handleClose = () => {
    setShowBooking(false);
    setBookingStep(1);
    setSelectedDate("");
    setSelectedTime("");
  };

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime || !selectedMode || !selectedDoctor)
      return;

    setIsSubmitting(true);
    try {
      // 1. Prepare the Date objects for the backend
      // selectedDate is "YYYY-MM-DD", selectedTime is "HH:MM AM/PM"
      const [time, modifier] = selectedTime.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (modifier === "PM" && hours < 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      const appointmentDateTime = new Date(selectedDate);
      appointmentDateTime.setHours(hours, minutes, 0, 0);

      const modeMapping: Record<string, string> = {
        video: "online",
        inPerson: "in-person",
        phone: "phone",
      };

      const payload = {
        doctorId: selectedDoctor.id,
        day: new Date(selectedDate),
        time: appointmentDateTime,
        type: modeMapping[selectedMode],
      };

      await createAppointment(payload);

      toast.success("Appointment booked successfully!", { duration: 2000 });
      handleClose();
    } catch (error: any) {
      toast.error("Booking appointment failed", { duration: 2000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={showBooking} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl overflow-hidden p-0 sm:rounded-3xl border-none shadow-2xl">
        <div className="grid md:grid-cols-5 h-full max-h-[90vh]">
          {/* Left Sidebar: Doctor Info */}
          <div className="md:col-span-2 bg-slate-50 p-4 md:p-8 border-r border-slate-100">
            <div className="space-y-3 md:space-y-6">
              <div className="flex flex-row md:flex-col gap-3 items-center md:items-start">
                <div className="relative w-20 h-20">
                  <Avatar className="w-20 h-20 rounded-full border-2 border-white shadow-sm">
                    <AvatarImage src={imgUrl || ""} className="object-cover" />
                    <AvatarFallback className="bg-cyan-600 text-white text-xl font-bold">
                      {selectedDoctor.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  {selectedDoctor.isActive && (
                    <div className="absolute bottom-2 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {selectedDoctor?.name}
                  </h3>
                  <p className="text-sm text-cyan-600 font-medium">
                    {selectedDoctor?.specialization?.join(" • ")}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-slate-500 text-xs line-clamp-2">
                    <MapPin className="w-3 h-3" />{" "}
                    {selectedDoctor?.clinicalAddress || "Clinic Location"}
                  </div>
                </div>
              </div>

              <div className="pt-3 md:pt-6 border-t border-slate-200">
                <Label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  Doctor Availability
                </Label>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day) => {
                      const isAvail = availableDays.some((d: string) =>
                        d.startsWith(day),
                      );
                      return (
                        <Badge
                          key={day}
                          variant="outline"
                          className={cn(
                            "px-2 py-0.5 text-[10px] border-none",
                            isAvail
                              ? "bg-cyan-100 text-cyan-700"
                              : "bg-slate-100 text-slate-400 opacity-50",
                          )}
                        >
                          {day}
                        </Badge>
                      );
                    },
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Content: Booking Steps */}
          <div className="md:col-span-3 p-8 bg-white overflow-y-auto">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl md:text-2xl font-black text-slate-800">
                {bookingStep === 1 && "Select Date"}
                {bookingStep === 2 && "Select Time"}
                {bookingStep === 3 && "Review Details"}
              </DialogTitle>
              <DialogDescription>
                {bookingStep === 1
                  ? "Choose your preferred slot"
                  : "Finalize your appointment info"}
              </DialogDescription>
            </DialogHeader>

            {isDoctorFullyUnavailable ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="p-4 bg-red-50 rounded-full text-red-500">
                  <AlertCircle className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-800">
                    No Availability Found
                  </p>
                  <p className="text-sm text-slate-500">
                    This doctor is not accepting appointments online at the
                    moment.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {bookingStep === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-bold flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-cyan-600" />
                        Select Date
                      </Label>

                      <Calendar
                        mode="single"
                        selected={
                          selectedDate ? new Date(selectedDate) : undefined
                        }
                        onSelect={(date) => {
                          if (!date) return;

                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(
                            2,
                            "0",
                          );
                          const day = String(date.getDate()).padStart(2, "0");

                          setSelectedDate(`${year}-${month}-${day}`);
                          setSelectedTime("");
                        }}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);

                          const dayName = date.toLocaleDateString("en-US", {
                            weekday: "long",
                          });

                          const isAvailableDay =
                            availableDays.includes(dayName);

                          return date < today || !isAvailableDay;
                        }}
                        className="rounded-xl border shadow-sm p-3"
                      />
                    </div>

                    <Button
                      className="w-full bg-[#0891b2] hover:bg-[#0e7490] rounded-xl h-12 shadow-lg shadow-cyan-100"
                      disabled={!selectedDate || isLoadingSlots}
                      onClick={() => setBookingStep(2)}
                    >
                      {isLoadingSlots ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Continue"
                      )}
                    </Button>
                  </div>
                )}
                {bookingStep === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <Label className="text-sm font-bold flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-600" />
                      Select Time Slot
                    </Label>

                    {isLoadingSlots ? (
                      <div className="h-60 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
                      </div>
                    ) : (
                      <ScrollArea className="h-60">
                        <div className="grid grid-cols-2 gap-2">
                          {availableSlots.map((time) => {
                            const isBooked = bookedSlots.includes(time);
                            return (
                              <Button
                                key={time}
                                disabled={isBooked} // DISABLE IF BOOKED
                                variant={
                                  selectedTime === time ? "default" : "outline"
                                }
                                className={cn(
                                  "rounded-xl h-11 text-xs font-semibold transition-all",
                                  selectedTime === time
                                    ? "bg-[#0891b2] hover:bg-[#0e7490]"
                                    : "hover:border-cyan-500 hover:bg-cyan-50",
                                  isBooked &&
                                    "opacity-40 bg-slate-100 border-none cursor-not-allowed", // VISUAL FEEDBACK
                                )}
                                onClick={() => setSelectedTime(time)}
                              >
                                {time}
                                <br />
                                {isBooked && " (Booked)"}
                              </Button>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    )}

                    <div className="flex gap-3">
                      <Button
                        variant="ghost"
                        className="flex-1 rounded-xl h-12"
                        onClick={() => setBookingStep(1)}
                      >
                        Back
                      </Button>

                      <Button
                        className="flex-1 bg-[#0891b2] hover:bg-[#0e7490] rounded-xl h-12"
                        disabled={!selectedTime}
                        onClick={() => setBookingStep(3)}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                )}

                {bookingStep === 3 && (
                  <div className="space-y-6 animate-in zoom-in-95 duration-200">
                    <Card className="border-none bg-slate-50 rounded-2xl shadow-inner p-2">
                      <CardContent className="p-2 md:p-4 space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Date:</span>
                          <span className="font-bold">
                            {new Date(selectedDate).toDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Time:</span>
                          <span className="font-bold text-[#0891b2]">
                            {selectedTime}
                          </span>
                        </div>
                        <div className="pt-3 border-t border-slate-200">
                          <Label className="text-[10px] font-bold uppercase text-slate-400">
                            Mode of Consultation
                          </Label>

                          <div className="flex items-center flex-wrap gap-3 mt-2">
                            {[
                              { key: "video", label: "Video", icon: Video },
                              { key: "phone", label: "Phone", icon: Phone },
                              {
                                key: "inPerson",
                                label: "In-Person",
                                icon: MapPin,
                              },
                            ].map(({ key, label, icon: Icon }) => {
                              const isEnabled =
                                selectedDoctor?.consultationTypes?.[key];
                              const isSelected = selectedMode === key;

                              return (
                                <Button
                                  key={key}
                                  type="button"
                                  disabled={!isEnabled || isSubmitting}
                                  variant={isSelected ? "default" : "outline"}
                                  className={`p-3 grow text-xs rounded-xl transition-all flex items-center justify-center
                                    ${
                                      isSelected && isEnabled
                                        ? "bg-[#0891b2] hover:bg-[#0e7490] text-white"
                                        : isEnabled
                                          ? "border-cyan-100 bg-white hover:bg-cyan-50"
                                          : "opacity-40 cursor-not-allowed bg-slate-100"
                                    }`}
                                  onClick={() =>
                                    isEnabled && setSelectedMode(key)
                                  }
                                >
                                  <Icon className="w-4 h-4" />
                                  <span>{label}</span>
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex gap-3">
                      <Button
                        variant="ghost"
                        className="flex-1 rounded-xl h-12"
                        onClick={() => setBookingStep(2)}
                      >
                        Back
                      </Button>
                      <Button
                        disabled={!selectedMode || isSubmitting}
                        onClick={handleConfirm}
                        className="flex-2 bg-green-600 hover:bg-green-700 text-white rounded-xl h-12 px-8 flex items-center gap-2 shadow-lg shadow-green-100 disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        {isSubmitting ? "Processing..." : "Confirm Appointment"}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookAppointmentModal;
