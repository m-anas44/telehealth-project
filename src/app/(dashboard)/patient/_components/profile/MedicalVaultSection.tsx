"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileSearch,
  Upload,
  Trash2,
  Microscope,
  Bone,
  FileText,
  ClipboardCheck,
  Loader2,
  Save,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getUploadUrl,
  updatePatientMedicalRecords,
} from "@/handlers/patientHandler";
import axios from "axios";

const DOC_CATEGORIES = [
  { value: "report", label: "Lab Report", icon: Microscope },
  { value: "xray", label: "X-Ray / Scan", icon: Bone },
  { value: "prescription", label: "Prescription", icon: FileText },
  { value: "other", label: "Other Document", icon: ClipboardCheck },
];

interface Attachment {
  name: string;
  category: string;
  file: File;
}

const MedicalVaultSection = ({
  existingDocuments = [],
}: {
  existingDocuments: any[];
}) => {
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).map((f) => ({
        name: f.name.split(".")[0],
        category: "report",
        file: f,
      }));
      setAttachments([...attachments, ...newFiles]);
    }
  };

  const handleVaultSync = async () => {
    if (attachments.length === 0) return;

    setLoading(true);
    try {
      const uploadedDocs = await Promise.all(
        attachments.map(async (item) => {
          const { url, key } = await getUploadUrl(
            item.file.name,
            item.file.type,
            "medicalRecords",
          );

          await axios.put(url, item.file, {
            headers: { "Content-Type": item.file.type },
          });

          return {
            name: item.name,
            category: item.category,
            key: key,
            fileType: item.file.type,
          };
        }),
      );

      await updatePatientMedicalRecords({
        documents: uploadedDocs,
      });

      toast.success("Medical documents uploaded successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Sync failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-md ring-1 ring-slate-200">
      <CardHeader className="border-b flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
          <FileSearch className="w-5 h-5 text-slate-400" /> Medical Vault
        </CardTitle>
        {/* Mobile par ye button accessible rehta hai Header ke sath */}
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          size="sm"
          className="border-[#0891b2] text-[#0891b2] hover:bg-cyan-50"
        >
          <Upload className="w-4 h-4 mr-2" /> Add Files
        </Button>
      </CardHeader>

      <CardContent className="px-6 py-2 space-y-6">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept="image/*,.pdf"
          onChange={handleFileSelect}
        />

        <div className="grid gap-3">
          {/* --- EXISTING DOCUMENTS --- */}
          {existingDocuments.map((doc, idx) => (
            <div
              key={`existing-${idx}`}
              className="flex flex-col md:flex-row gap-4 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl opacity-80"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="p-3 bg-white rounded-xl shadow-sm text-slate-400">
                  {React.createElement(
                    DOC_CATEGORIES.find((c) => c.value === doc.category)
                      ?.icon || FileText,
                    { className: "w-5 h-5" },
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-600 truncate">
                    {doc.name}
                  </p>
                  <p className="text-[10px] text-slate-400 italic">
                    Saved Record
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase bg-slate-100 px-2 py-1 rounded text-slate-500">
                  {doc.category}
                </span>
                <a href={doc.url} target="_blank" rel="noreferrer">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#0891b2] hover:bg-cyan-50 h-8"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" /> View
                  </Button>
                </a>
              </div>
            </div>
          ))}

          {/* --- NEW ATTACHMENTS --- */}
          {attachments.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-row gap-4 p-4 bg-white border rounded-2xl hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="p-3 bg-slate-100 rounded-xl">
                  {React.createElement(
                    DOC_CATEGORIES.find((c) => c.value === item.category)
                      ?.icon || FileText,
                    { className: "w-5 h-5" },
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Input
                    value={item.name}
                    onChange={(e) => {
                      const updated = [...attachments];
                      updated[idx].name = e.target.value;
                      setAttachments(updated);
                    }}
                    className="h-7 border-none bg-transparent p-0 font-medium shadow-none focus-visible:ring-0"
                  />
                  <p className="text-[10px] text-slate-400 truncate">
                    {item.file.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={item.category}
                  onChange={(e) => {
                    const updated = [...attachments];
                    updated[idx].category = e.target.value;
                    setAttachments(updated);
                  }}
                  className="bg-slate-50 border-none text-xs rounded-lg p-2 flex-1 md:w-32 outline-none"
                >
                  {DOC_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setAttachments(attachments.filter((_, i) => i !== idx))
                  }
                  className="text-slate-300 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {attachments.length === 0 && (
            <div
              className="py-12 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 mb-2 opacity-20" />
              <p className="text-sm font-medium">
                Add medical reports or X-rays
              </p>
              <p className="text-[10px]">Click to browse files</p>
            </div>
          )}
        </div>

        <Button
          disabled={loading || attachments.length === 0}
          onClick={handleVaultSync}
          className="w-full md:w-auto bg-[#0891b2] rounded-xl shadow-lg shadow-cyan-50 h-12 px-8"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <Save className="w-5 h-5 mr-2" />
          )}
          Secure Vault Records
        </Button>
      </CardContent>
    </Card>
  );
};

export default MedicalVaultSection;
