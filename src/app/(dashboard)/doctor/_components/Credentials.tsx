import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Credentials = ({ user }: { user: any }) => {
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
            <Input placeholder="e.g., MD123456" className="mt-2" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>License State</Label>
              <Input placeholder="e.g., California" className="mt-2" />
            </div>
            <div>
              <Label>License Expiration</Label>
              <Input type="date" className="mt-2" />
            </div>
          </div>
          <div>
            <Label>Board Certification</Label>
            <Input
              placeholder="e.g., American Board of Internal Medicine"
              className="mt-2"
            />
          </div>
          <div>
            <Label>Medical School</Label>
            <Input
              placeholder="e.g., Harvard Medical School"
              className="mt-2"
            />
          </div>
          <div>
            <Label>Residency Program</Label>
            <Input
              placeholder="e.g., Johns Hopkins Hospital"
              className="mt-2"
            />
          </div>
          <Button className="bg-[#0891b2]">
            <Save className="w-4 h-4 mr-2" />
            Save Credentials
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Document Uploads</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 bg-[#f8fafc] rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-sm text-gray-600 mb-2">Medical License (PDF)</p>
            <Button variant="outline" size="sm">
              Upload Document
            </Button>
          </div>
          <div className="p-4 bg-[#f8fafc] rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-sm text-gray-600 mb-2">
              Board Certification (PDF)
            </p>
            <Button variant="outline" size="sm">
              Upload Document
            </Button>
          </div>
          <div className="p-4 bg-[#f8fafc] rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-sm text-gray-600 mb-2">DEA Certificate (PDF)</p>
            <Button variant="outline" size="sm">
              Upload Document
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Credentials;
