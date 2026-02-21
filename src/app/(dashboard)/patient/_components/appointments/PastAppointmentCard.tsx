import { Card, CardContent } from "@/components/ui/card";
import { Calendar, CheckCircle2, Clock, Video, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

const PastAppointmentCard = ({ apt }: { apt: Appointment }) => {
  const isOnline = apt.type === "online";

  const formattedDate = apt.day
    ? new Date(apt.day).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "No Date";

  const formattedTime = apt.time
    ? new Date(apt.time).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "No Time";

  return (
    <Card className="bg-gray-50">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-300 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900">
                {apt.doctorName}
              </h3>

              <Badge variant="outline">
                {apt.specialization?.[0] || "Specialist"}
              </Badge>

              <Badge className="bg-gray-500 capitalize">
                {apt.status}
              </Badge>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formattedDate}
              </span>

              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formattedTime}
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
            <Button variant="outline">View Summary</Button>
            <Button variant="outline">Download Report</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PastAppointmentCard;