"use client";

import React, { useState } from "react";
import { Upload, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DocumentUploadModal from "../_components/medicalHistory/DocumentUploadModal";
import MDTabs from "../_components/medicalHistory/MDTabs";

const MedicalHistory = () => {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search documents..." className="pl-10 w-80" />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
        <Button className="bg-[#10b981]" onClick={() => setShowUpload(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Tabs */}
      <MDTabs />

      {/* Upload Dialog */}
      <DocumentUploadModal
        showUpload={showUpload}
        setShowUpload={setShowUpload}
      />
    </div>
  );
};

export default MedicalHistory;
