"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Eye, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  getCredentials,
  updateCredentials,
  getUploadUrl,
  saveDocument,
  getViewUrl,
} from "@/handlers/doctorHandler";
import toast from "react-hot-toast";

const toDateInputValue = (dateString?: string) => {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split("T")[0];
};



const Credentials = ({ user }: { user: any }) => {
  const [loading, setLoading] = useState(false);
  const [licenseNo, setLicenseNo] = useState("");
  const [licenseState, setLicenseState] = useState("");
  const [licenseExpiration, setLicenseExpiration] = useState("");
  const [boardNameOfCertification, setBoardNameOfCertification] = useState("");
  const [medicalSchool, setMedicalSchool] = useState("");
  const [residencyProgram, setResidencyProgram] = useState("");
  const [documents, setDocuments] = useState<any>({});

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchCredentials = async () => {
      const profile = await getCredentials();
      console.log(profile);
      if (profile) {
        setLicenseNo(profile.licenseNo ?? "");
        setLicenseState(profile.licenseState ?? "");
        setLicenseExpiration(
          profile.licenseExpiration
            ? toDateInputValue(profile.licenseExpiration)
            : "",
        );
        setBoardNameOfCertification(profile.boardNameOfCertification ?? "");
        setMedicalSchool(profile.medicalSchool ?? "");
        setResidencyProgram(profile.residencyProgram ?? "");
        setDocuments(profile.documents ?? {});
      }
    };
    fetchCredentials();
  }, []);

  const handleView = async (key: string) => {
    try {
      const signedUrl = await getViewUrl(key);
      if (signedUrl) {
        window.open(signedUrl, "_blank");
      } else {
        toast.error("Could not generate secure view link");
      }
    } catch (err) {
      toast.error("Error accessing document");
    }
  };

  const handleSave = async () => {
    const payload: any = {};
    if (licenseNo) payload.licenseNo = licenseNo;
    if (licenseState) payload.licenseState = licenseState;
    if (licenseExpiration)
      payload.licenseExpiration = new Date(licenseExpiration).toISOString();
    if (boardNameOfCertification)
      payload.boardNameOfCertification = boardNameOfCertification;
    if (medicalSchool) payload.medicalSchool = medicalSchool;
    if (residencyProgram) payload.residencyProgram = residencyProgram;

    if (Object.keys(payload).length === 0) {
      toast.error("Please provide at least one credential to update", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    setLoading(true);
    try {
      await updateCredentials(payload);
      toast.success("Your credentials saved", {
        duration: 3000,
        position: "top-center",
      });
    } catch (err: any) {
      toast.error(err?.message || "Failed to save credentials", {
        duration: 3000,
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const onPickFile = (category: string) => {
    setUploadCategory(category);
    fileInputRef.current?.click();
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadCategory) return;

    setUploading(true);
    try {
      const { url, key } = await getUploadUrl(
        file.name,
        file.type,
        uploadCategory,
      );
      // upload to signed url
      await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      await saveDocument({
        key,
        category: uploadCategory,
        fileName: file.name,
      });
      toast.success("Document uploaded", {
        duration: 3000,
        position: "top-center",
      });
      // refresh documents
      const profile = await getCredentials();
      setDocuments(profile.documents ?? {});
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Upload failed", {
        duration: 3000,
        position: "top-center",
      });
    } finally {
      setUploading(false);
      setUploadCategory(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

 const DocumentRow = ({ title, category }: { title: string, category: string }) => {
  // Aapke schema ke mutabiq category object access ho raha hai
  // e.g., documents.medicalLicense
  const doc = documents[category];
  
  // S3 Key aapke 'publicId' field mein store ho rahi hai
  const s3Key = doc?.publicId; 

  return (
    <div className="p-4 bg-[#f8fafc] rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-gray-700">{title}</p>
        {s3Key ? (
          <button
            onClick={() => handleView(s3Key)} // publicId as Key bhej rahe hain
            className="mt-1 text-xs text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" /> View Uploaded Document
          </button>
        ) : (
          <p className="text-xs text-gray-400 mt-1 italic">No file uploaded yet</p>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="border-cyan-200 text-cyan-700 hover:bg-cyan-50"
        onClick={() => onPickFile(category)}
        disabled={uploading}
      >
        {uploading && uploadCategory === category ? (
          "Processing..."
        ) : (
          <>{doc?.publicId ? "Replace File" : "Upload File"}</>
        )}
      </Button>
    </div>
  );
};

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#f59e0b]" />
            Medical Credentials
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Medical License Number</Label>
            <Input
              value={licenseNo}
              onChange={(e) => setLicenseNo(e.target.value)}
              placeholder="e.g., MD123456"
              className="mt-2"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>License State</Label>
              <Input
                value={licenseState}
                onChange={(e) => setLicenseState(e.target.value)}
                placeholder="e.g., California"
                className="mt-2"
              />
            </div>
            <div>
              <Label>License Expiration</Label>
              <Input
                type="date"
                value={licenseExpiration}
                onChange={(e) => setLicenseExpiration(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <div>
            <Label>Board Certification</Label>
            <Input
              value={boardNameOfCertification}
              onChange={(e) => setBoardNameOfCertification(e.target.value)}
              placeholder="e.g., American Board of Internal Medicine"
              className="mt-2"
            />
          </div>
          <div>
            <Label>Medical School</Label>
            <Input
              value={medicalSchool}
              onChange={(e) => setMedicalSchool(e.target.value)}
              placeholder="e.g., Harvard Medical School"
              className="mt-2"
            />
          </div>
          <div>
            <Label>Residency Program</Label>
            <Input
              value={residencyProgram}
              onChange={(e) => setResidencyProgram(e.target.value)}
              placeholder="e.g., Johns Hopkins Hospital"
              className="mt-2"
            />
          </div>
          <Button
            className="bg-[#0891b2]"
            onClick={handleSave}
            disabled={loading}
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Saving..." : "Save Credentials"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Document Uploads</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFile}
          />
          <DocumentRow 
            title="Medical License (PDF/Image)" 
            category="medicalLicense" 
          />
          
          <DocumentRow 
            title="Board Certification" 
            category="boardCertification"
          />
          
          <DocumentRow 
            title="DEA Certificate" 
            category="deaCertificate" 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Credentials;
