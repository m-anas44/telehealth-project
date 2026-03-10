"use client";
import React, { useState } from "react";
import {
  Download,
  Eye,
  CheckCircle2,
  Calendar,
  User,
  FileText,
  Microscope,
  ClipboardCheck,
  Bone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getViewUrl } from "@/handlers/patientHandler";
import toast from "react-hot-toast";

const DOC_CATEGORIES = [
  { value: "report", label: "Lab Report", icon: Microscope },
  { value: "xray", label: "X-Ray / Scan", icon: Bone },
  { value: "prescription", label: "Prescription", icon: FileText },
  { value: "other", label: "Other Document", icon: ClipboardCheck },
];

const DocumentTab = ({ documents }: any) => {
  const fetchDocument = async (documentKey: string) => {
    if (documentKey) {
      try {
        const url = await getViewUrl(documentKey);
        if (url) {
          window.open(url, "_blank");
        } else {
          toast.error("Can't view this time!");
        }
      } catch (err) {
        console.error("Failed to load patient document: ", err);
      }
    }
  };
  return (
    <div className="grid gap-4">
      {documents.map((doc: any) => (
        <Card
          key={doc._id}
          className="hover:border-[#0891b2] transition-colors"
        >
          <CardContent className="py-1">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#e0f2fe] rounded-lg flex items-center justify-center shrink-0">
                {React.createElement(
                  DOC_CATEGORIES.find((c) => c.value === doc.category)?.icon ||
                    FileText,
                  { className: "w-5 h-5" },
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900">{doc.name}</h4>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(doc.uploadedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <Badge variant="outline">
                    {doc.fileType?.split("/")[1].toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                {doc.key && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => fetchDocument(doc?.key || "")}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DocumentTab;
