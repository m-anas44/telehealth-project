"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Save, Loader2, Activity } from "lucide-react";
import toast from "react-hot-toast";
import { updatePatientHealthSummary } from "@/handlers/patientHandler";

interface HealthSummaryProps {
  initialAllergies?: string[];
  initialConditions?: string[];
}

const HealthSummarySection = ({
  initialAllergies = [],
  initialConditions = [],
}: HealthSummaryProps) => {
  const [loading, setLoading] = useState(false);
  const [allergies, setAllergies] = useState<string[]>(initialAllergies);
  const [conditions, setConditions] = useState<string[]>(initialConditions);
  const [newAllergy, setNewAllergy] = useState("");
  const [newCondition, setNewCondition] = useState("");

  const addItem = (type: "allergy" | "condition") => {
    if (type === "allergy" && newAllergy.trim()) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy("");
    } else if (type === "condition" && newCondition.trim()) {
      setConditions([...conditions, newCondition.trim()]);
      setNewCondition("");
    }
  };

  const handleSaveSummary = async () => {
    setLoading(true);
    try {
      await updatePatientHealthSummary({
        allergies,
        conditions,
      });

      toast.success("Health summary updated!");
    } catch (error: any) {
      toast.error(error.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-md ring-1 ring-slate-200">
      <CardHeader className="border-b">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-[#0891b2]">
          <Activity className="w-5 h-5" /> Health Tags
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-2 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Allergies */}
          <div className="space-y-3 pt-4">
            <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full" /> Known
              Allergies
            </Label>
            <div className="flex gap-2">
              <Input
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="e.g. Peanuts"
                onKeyUp={(e) => e.key === "Enter" && addItem("allergy")}
              />
              <Button
                onClick={() => addItem("allergy")}
                size="icon"
                className="bg-slate-900 shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-12 p-2 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              {allergies.map((item, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1.5 bg-white border px-3 py-1 rounded-lg text-xs font-medium shadow-sm"
                >
                  {item}
                  <X
                    className="w-3 h-3 cursor-pointer text-red-400 hover:text-red-600"
                    onClick={() =>
                      setAllergies(allergies.filter((_, i) => i !== idx))
                    }
                  />
                </span>
              ))}
            </div>
          </div>

          {/* Conditions */}
          <div className="space-y-3 pt-4">
            <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-500 rounded-full" /> Chronic
              Conditions
            </Label>
            <div className="flex gap-2">
              <Input
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="e.g. Asthma"
                onKeyUp={(e) => e.key === "Enter" && addItem("condition")}
              />
              <Button
                onClick={() => addItem("condition")}
                size="icon"
                className="bg-slate-900 shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-12 p-2 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              {conditions.map((item, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1.5 bg-white border px-3 py-1 rounded-lg text-xs font-medium shadow-sm"
                >
                  {item}
                  <X
                    className="w-3 h-3 cursor-pointer text-cyan-400 hover:text-cyan-600"
                    onClick={() =>
                      setConditions(conditions.filter((_, i) => i !== idx))
                    }
                  />
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pb-4">
          <Button
            onClick={handleSaveSummary}
            disabled={loading}
            className="w-full md:w-auto bg-[#0891b2] hover:bg-[#0e7490]"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Update Summary
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthSummarySection;
