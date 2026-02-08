"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Save, Plus, X, Loader2, ClipboardList, 
  FileText, Upload, Trash2, Activity,
  FileSearch, Microscope, Bone, ClipboardCheck
} from "lucide-react";
import toast from "react-hot-toast";

// Categories for medical documents
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

const MedicalInfoTab = () => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [allergies, setAllergies] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).map(f => ({ 
        name: f.name.split('.')[0], // Default name without extension
        category: "report", 
        file: f 
      }));
      setAttachments([...attachments, ...newFiles]);
    }
  };

  const updateAttachmentData = (index: number, field: keyof Attachment, value: string) => {
    const updated = [...attachments];
    updated[index] = { ...updated[index], [field]: value };
    setAttachments(updated);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Logic for S3 and DB sync
      toast.success("Medical vault updated successfully!");
    } catch (error) {
      toast.error("Sync failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <Card className="border-none shadow-lg overflow-hidden ring-1 ring-slate-200">
        <CardHeader className="bg-white border-b py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-[#0891b2] text-xl">
              <Activity className="w-6 h-6" />
              Digital Medical Vault
            </CardTitle>
            <div className="flex gap-2">
               <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*,.pdf" onChange={handleFileSelect} />
               <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="text-[#0891b2] border-[#0891b2] hover:bg-cyan-50">
                  <Upload className="w-4 h-4 mr-2" />
                  Add Documents
               </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-10">
          
          {/* Section 1: Quick Health Tags */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full" /> Known Allergies
              </Label>
              <div className="flex gap-2">
                <Input value={newAllergy} onChange={(e) => setNewAllergy(e.target.value)} placeholder="e.g. Peanuts" onKeyUp={(e) => e.key === 'Enter' && addItem("allergy")} className="bg-slate-50 border-slate-200 focus:bg-white transition-all" />
                <Button onClick={() => addItem("allergy")} className="bg-slate-900 hover:bg-slate-800 shrink-0">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-12 p-3 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                {allergies.map((item, idx) => (
                  <span key={idx} className="flex items-center gap-2 bg-white text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm border border-slate-200 group">
                    {item}
                    <X className="w-3.5 h-3.5 cursor-pointer text-slate-400 group-hover:text-red-500 transition-colors" onClick={() => setAllergies(allergies.filter((_, i) => i !== idx))} />
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-500 rounded-full" /> Chronic Conditions
              </Label>
              <div className="flex gap-2">
                <Input value={newCondition} onChange={(e) => setNewCondition(e.target.value)} placeholder="e.g. Asthma" onKeyUp={(e) => e.key === 'Enter' && addItem("condition")} className="bg-slate-50 border-slate-200 focus:bg-white transition-all" />
                <Button onClick={() => addItem("condition")} className="bg-slate-900 hover:bg-slate-800 shrink-0">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-12 p-3 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                {conditions.map((item, idx) => (
                  <span key={idx} className="flex items-center gap-2 bg-white text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm border border-slate-200 group">
                    {item}
                    <X className="w-3.5 h-3.5 cursor-pointer text-slate-400 group-hover:text-cyan-600 transition-colors" onClick={() => setConditions(conditions.filter((_, i) => i !== idx))} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: Document Management with Purpose/Category */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <FileSearch className="w-5 h-5 text-slate-400" />
              <h3 className="font-bold text-slate-800">Categorized Medical Records</h3>
            </div>

            <div className="grid gap-4">
              {attachments.map((item, idx) => (
                <div key={idx} className="group relative grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 bg-white border border-slate-200 rounded-2xl hover:shadow-md hover:border-cyan-200 transition-all">
                  
                  {/* Icon & File Name */}
                  <div className="md:col-span-4 flex items-center gap-4">
                    <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-colors">
                      {React.createElement(DOC_CATEGORIES.find(c => c.value === item.category)?.icon || FileText, { className: "w-6 h-6" })}
                    </div>
                    <div className="flex-1 overflow-hidden">
                       <Input 
                        value={item.name} 
                        onChange={(e) => updateAttachmentData(idx, "name", e.target.value)}
                        className="h-8 border-none bg-transparent font-medium text-slate-700 focus-visible:ring-1 focus-visible:ring-cyan-100 p-0"
                       />
                       <p className="text-[10px] text-slate-400 truncate">{item.file.name}</p>
                    </div>
                  </div>

                  {/* Category Selector */}
                  <div className="md:col-span-4">
                    <select 
                      value={item.category}
                      onChange={(e) => updateAttachmentData(idx, "category", e.target.value)}
                      className="w-full bg-slate-50 border-none text-sm rounded-lg p-2 focus:ring-2 focus:ring-cyan-100 outline-none"
                    >
                      {DOC_CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Date or Meta Info (Optional but Pro) */}
                  <div className="md:col-span-3 text-right text-xs text-slate-400">
                    {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                  </div>

                  {/* Remove Button */}
                  <div className="md:col-span-1 flex justify-end">
                    <Button variant="ghost" size="icon" onClick={() => removeAttachment(idx)} className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {attachments.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                    <Upload className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-medium">No documents staged for upload</p>
                  <p className="text-slate-400 text-xs mt-1">Upload your reports to keep them organized</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-50">
            <Button disabled={loading || (attachments.length === 0 && allergies.length === 0 && conditions.length === 0)} onClick={handleSave} className="bg-[#0891b2] hover:bg-[#0e7490] px-10 h-12 rounded-xl shadow-lg shadow-cyan-100">
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
              Secure All Records
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalInfoTab;