import React from "react";
import { FileText, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const PrescriptionsTab = ({prescriptions}: any) => {
  return (
    <div>
      {prescriptions.map((prescription: any) => (
        <Card key={prescription.id}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-[#d1fae5] rounded-lg flex items-center justify-center shrink-0">
                <FileText className="w-7 h-7 text-[#10b981]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="font-semibold text-gray-900">
                    {prescription.medication}
                  </h4>
                  <Badge className="bg-[#10b981]">{prescription.status}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Dosage</p>
                    <p className="text-sm font-medium text-gray-900">
                      {prescription.dosage}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="text-sm font-medium text-gray-900">
                      {prescription.duration}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Prescribed By</p>
                    <p className="text-sm font-medium text-gray-900">
                      {prescription.doctor}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(prescription.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PrescriptionsTab;
