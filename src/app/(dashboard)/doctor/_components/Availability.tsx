"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  getAvailability,
  getConsultationSettings,
  updateAvailability,
  updateConsultationSettings,
} from "@/handlers/doctorHandler";
import toast from "react-hot-toast";

export interface WeeklyAvailability {
  day: string;
  isAvailable: boolean;
  startTime?: string;
  endTime?: string;
}

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const defaultWeekly: WeeklyAvailability[] = DAYS.map((day) => ({
  day,
  isAvailable: !["Saturday", "Sunday"].includes(day),
  startTime: "09:00",
  endTime: "17:00",
}));

const Availability = ({ user }: { user: any }) => {
  const [weekly, setWeekly] = useState<WeeklyAvailability[]>(defaultWeekly);
  const [weeklyLoading, setWeeklyLoading] = useState(false);
  const [consultationLoading, setConsultationLoading] = useState(false);
  const [consultationDuration, setConsultationDuration] = useState(30);
  const [bufferTime, setBufferTime] = useState(0);
  const [consultationTypes, setConsultationTypes] = useState({
    video: true,
    inPerson: true,
    phone: false,
  });

  useEffect(() => {
    getAvailability().then((data) => {
      if (data?.weekly) setWeekly(data.weekly);
    });

    getConsultationSettings().then((data) => {
      if (!data) return;
      setConsultationDuration(data.consultationDuration || 15);
      setBufferTime(data.bufferTime || 0);
      setConsultationTypes(
        data.consultationTypes || {
          video: true,
          inPerson: true,
          phone: false,
        },
      );
    });
  }, []);

  const updateDay = (
    index: number,
    key: keyof WeeklyAvailability,
    value: any,
  ) => {
    const copy = [...weekly];
    copy[index] = { ...copy[index], [key]: value };
    setWeekly(copy);
  };

  const onSave = async () => {
    try {
      setWeeklyLoading(true);
      await updateAvailability({ weekly });
      toast.success("Availability updated");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setWeeklyLoading(false);
    }
  };

  const onSaveConsultationSettings = async () => {
    // ✅ simple validation
    const hasAtLeastOne =
      consultationTypes.video ||
      consultationTypes.inPerson ||
      consultationTypes.phone;

    if (!hasAtLeastOne) {
      toast.error("Select at least one consultation type");
      return;
    }

    try {
      setConsultationLoading(true);
      await updateConsultationSettings({
        consultationDuration,
        bufferTime,
        consultationTypes,
      });
      toast.success("Consultation settings updated");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setConsultationLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#0891b2]" />
            Weekly Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {weekly.map((item, index) => (
            <div
              key={item.day}
              className="flex items-center gap-4 p-4 bg-[#f8fafc] rounded-lg"
            >
              <input
                type="checkbox"
                checked={item.isAvailable}
                onChange={(e) =>
                  updateDay(index, "isAvailable", e.target.checked)
                }
                className="w-5 h-5"
              />

              <div className="flex-1 font-medium">{item.day}</div>

              <div className="flex gap-2">
                <Input
                  type="time"
                  value={item.startTime}
                  disabled={!item.isAvailable}
                  onChange={(e) =>
                    updateDay(index, "startTime", e.target.value)
                  }
                  className="w-32"
                />
                <span className="text-gray-500">to</span>
                <Input
                  type="time"
                  value={item.endTime}
                  disabled={!item.isAvailable}
                  onChange={(e) => updateDay(index, "endTime", e.target.value)}
                  className="w-32"
                />
              </div>
            </div>
          ))}
          <Button
            className="w-full bg-[#089dcd] hover:bg-[#078ab6] cursor-pointer"
            onClick={onSave}
            disabled={weeklyLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            {weeklyLoading ? "Saving..." : "Update Schedule"}
          </Button>
        </CardContent>
      </Card>

      {/* Consultation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#089dcd]" />
            Consultation Settings
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label>Default Consultation Duration</Label>
            <select
              className="w-full mt-2 p-2 border rounded-lg"
              value={consultationDuration}
              onChange={(e) => setConsultationDuration(Number(e.target.value))}
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </div>

          <div>
            <Label>Consultation Types</Label>
            <div className="space-y-2 mt-2">
              {(["video", "inPerson", "phone"] as const).map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={consultationTypes[type]}
                    onChange={(e) =>
                      setConsultationTypes((prev) => ({
                        ...prev,
                        [type]: e.target.checked,
                      }))
                    }
                    className="w-5 h-5"
                  />
                  <span>
                    {type === "inPerson"
                      ? "In-Person Visit"
                      : `${type[0].toUpperCase()}${type.slice(1)} Consultation`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Buffer Time Between Appointments</Label>
            <select
              className="w-full mt-2 p-2 border rounded-lg"
              value={bufferTime}
              onChange={(e) => setBufferTime(Number(e.target.value))}
            >
              <option value={0}>No buffer</option>
              <option value={5}>5 minutes</option>
              <option value={10}>10 minutes</option>
              <option value={15}>15 minutes</option>
            </select>
          </div>

          <Button
            className="w-full bg-[#089dcd] hover:bg-[#078ab6]"
            onClick={onSaveConsultationSettings}
            disabled={consultationLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            {consultationLoading ? "Saving..." : "Update Settings"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Availability;
