"use client";

import React, { useEffect, useState } from "react";
import HealthSummarySection from "./HealthSummarySection";
import MedicalVaultSection from "./MedicalVaultSection";
import { Loader2 } from "lucide-react";
import { getPatientMedicalHistory } from "@/handlers/patientHandler";

const MedicalInfoTab = () => {
  const [loading, setLoading] = useState(true);
  const [medicalData, setMedicalData] = useState<any>(null);

  const fetchRecords = async () => {
    try {
      const response = await getPatientMedicalHistory();
      setMedicalData(response.data);
    } catch (error: any) {
      // silent fail
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0891b2]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Health Summary (Allergies & Conditions) */}
      <HealthSummarySection
        initialAllergies={medicalData?.allergies || []}
        initialConditions={medicalData?.chronicConditions || []}
      />

      {/* 2. Medical Vault (Uploaded Documents) */}
      <MedicalVaultSection
        existingDocuments={medicalData?.documents || []} 
      />
    </div>
  );
};

export default MedicalInfoTab