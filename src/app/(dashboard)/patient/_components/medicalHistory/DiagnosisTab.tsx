import React from 'react'
import {
  FileText,
  Calendar,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const DiagnosisTab = ({diagnoses}: any) => {
  return (
    <div>
        {diagnoses.map((diagnosis: any) => (
            <Card key={diagnosis.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-[#fef3c7] rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="w-7 h-7 text-[#f59e0b]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="font-semibold text-gray-900">
                        {diagnosis.diagnosis}
                      </h4>
                      <Badge
                        className={
                          diagnosis.status === "Active"
                            ? "bg-[#ef4444]"
                            : "bg-[#f59e0b]"
                        }
                      >
                        {diagnosis.status}
                      </Badge>
                    </div>
                    <p className="text-gray-700 mb-3">{diagnosis.notes}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Diagnosed on{" "}
                        {new Date(diagnosis.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {diagnosis.doctor}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
    </div>
  )
}

export default DiagnosisTab