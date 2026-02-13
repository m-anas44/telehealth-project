import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DocumentUploadModal = ({ showUpload, setShowUpload }: any) => {
  return (
    <div>
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Medical Document</DialogTitle>
            <DialogDescription>
              Upload your medical records, test results, or other health
              documents
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Type
              </label>
              <select className="w-full p-2 border rounded-lg">
                <option>Lab Report</option>
                <option>Prescription</option>
                <option>Imaging (X-Ray, CT, MRI)</option>
                <option>Vaccination Record</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Name
              </label>
              <Input placeholder="e.g., Blood Test Results - January 2026" />
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#0891b2] transition-colors cursor-pointer">
              <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-700 font-medium mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-gray-500">PDF, JPG, PNG up to 10MB</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowUpload(false)}
              >
                Cancel
              </Button>
              <Button className="flex-1 bg-[#10b981]">
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentUploadModal;
