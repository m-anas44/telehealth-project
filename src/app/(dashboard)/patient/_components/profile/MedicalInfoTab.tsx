import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";

const MedicalInfoTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emergencyName">Contact Name</Label>
              <Input
                id="emergencyName"
                placeholder="Full name"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="emergencyRelation">Relationship</Label>
              <Input
                id="emergencyRelation"
                placeholder="e.g., Spouse, Parent"
                className="mt-2"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="emergencyPhone">Contact Phone</Label>
            <Input
              id="emergencyPhone"
              placeholder="+1 (555) 123-4567"
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Allergies & Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="allergies">Known Allergies</Label>
            <Input
              id="allergies"
              placeholder="e.g., Penicillin, Peanuts"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="conditions">Chronic Conditions</Label>
            <Input
              id="conditions"
              placeholder="e.g., Diabetes, Hypertension"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="medications">Current Medications</Label>
            <Input
              id="medications"
              placeholder="List your current medications"
              className="mt-2"
            />
          </div>
          <Button className="bg-[#0891b2]">
            <Save className="w-4 h-4 mr-2" />
            Save Medical Info
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalInfoTab;
