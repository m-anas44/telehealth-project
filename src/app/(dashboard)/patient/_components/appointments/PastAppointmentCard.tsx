import { Card, CardContent } from "@/components/ui/card";
import { Calendar, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const PastAppointmentCard = (apt: any) => {
  return (
    <div>
      <Card key={apt.id} className="bg-gray-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-300 rounded-xl flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-900">{apt.doctor}</h3>
                <Badge variant="outline">{apt.specialty}</Badge>
                <Badge className="bg-gray-500">Completed</Badge>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(apt.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {apt.time}
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
    </div>
  );
};

export default PastAppointmentCard;
