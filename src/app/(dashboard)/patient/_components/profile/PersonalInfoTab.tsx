"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2, RefreshCw } from "lucide-react";
import { updatePatientInfo, getPatientFullProfile } from "@/handlers/patientHandler";
import toast from "react-hot-toast";

const PersonalInfoTab = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    city: "",
    age: "",
    bloodGroup: "",
    emergencyContact: "",
  });

  // 1. Fetch data on Mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getPatientFullProfile();
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          gender: data.gender || "",
          city: data.city || "",
          age: data.age || "",
          bloodGroup: data.bloodGroup || "",
          emergencyContact: data.emergencyContact || "",
        });
      } catch (err: any) {
        toast.error("Could not load profile details");
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updatePatientInfo(formData);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin h-8 w-8 text-cyan-600" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={formData.name} onChange={handleChange} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={formData.email} disabled className="mt-2 bg-gray-50" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="age">Age</Label>
            <Input id="age" type="number" value={formData.age} onChange={handleChange} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <select id="gender" value={formData.gender} onChange={handleChange} className="w-full mt-2 p-2 border rounded-lg h-10">
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <Label htmlFor="bloodGroup">Blood Group</Label>
            <select id="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full mt-2 p-2 border rounded-lg h-10">
              <option value="">Select</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" value={formData.phone} onChange={handleChange} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" value={formData.city} onChange={handleChange} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="emergencyContact">Emergency Contact</Label>
            <Input id="emergencyContact" value={formData.emergencyContact} onChange={handleChange} className="mt-2" />
          </div>
        </div>

        <Button className="bg-[#0891b2] hover:bg-[#0e7490]" onClick={handleSubmit} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoTab;