"use client";
import React, { useState } from "react";
import {
  Download,
  Eye,
  CheckCircle2,
  Calendar,
  User,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const DocumentTab = ({ documents }: any) => {
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const getDocumentIcon = (type: string) => {
    return <FileText className="w-5 h-5 text-[#0891b2]" />;
  };
  return (
    <div className="grid gap-4">
      {documents.map((doc: any) => (
        <Card
          key={doc.id}
          className="hover:border-[#0891b2] transition-colors cursor-pointer"
          onClick={() => setSelectedDocument(doc)}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#e0f2fe] rounded-lg flex items-center justify-center shrink-0">
                {getDocumentIcon(doc.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900">{doc.name}</h4>
                  {doc.verified && (
                    <Badge className="bg-[#10b981]">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(doc.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {doc.doctor}
                  </span>
                  <Badge variant="outline">{doc.type}</Badge>
                  <span className="text-gray-500">
                    {doc.fileType} • {doc.size}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
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
