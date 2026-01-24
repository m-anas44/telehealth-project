"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  getProfessionalInfo,
  updateProfessionalInfo,
} from "@/handlers/doctorHandler";
import { specOptions } from "@/app/data/doctorDashboard";
import SpecializationSelector from "@/components/doctor/SpecializationSelector";

const ProfessionInfo = ({ user }: { user: any }) => {
  const [loading, setLoading] = useState(false);
  const [initial, setInitial] = useState<any>({});

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState("");
  const [specialization, setSpecialization] = useState<string[]>([]);
  const [experienceYears, setExperienceYears] = useState<number | "">("");
  const [bio, setBio] = useState("");
  const [clinicalAddress, setClinicalAddress] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const info = await getProfessionalInfo();
        if (!mounted) return;
        if (info) {
          setInitial(info);
          setSpecialization(info.profile.specialization || []);
          setExperienceYears(info.profile.experienceYears ?? "");
          setBio(info.profile.bio ?? "");
          setClinicalAddress(info.profile.clinicalAddress ?? "");
          setPhone(info.user.phone ?? "");
          setName((p: any) => p || info.user.name || "");
          setEmail((e: any) => e || info.user.email || "");
        }
      } catch (err) {
        // ignore for now
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async () => {
    const payload: any = {};
    if (name && name !== user?.name) payload.name = name;
    if (email && email !== user?.email) payload.email = email;
    if (phone) payload.phone = phone;
    if (specialization && specialization.length > 0)
      payload.specialization = specialization;
    if (experienceYears !== "" && experienceYears !== undefined)
      payload.experienceYears = Number(experienceYears);
    if (bio) payload.bio = bio;
    if (clinicalAddress) payload.clinicalAddress = clinicalAddress;

    if (Object.keys(payload).length === 0) {
      toast.error("Please change at least one field before saving.");
      return;
    }

    setLoading(true);
    try {
      await updateProfessionalInfo(payload);
      toast.success("Profile saved");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <div>
            <SpecializationSelector
              options={specOptions}
              value={specialization}
              onChange={(vals) => setSpecialization(vals)}
              maxSelect={3}
            />
          </div>
          <div>
            <Label htmlFor="experience">Years of Experience</Label>
            <Input
              id="experience"
              type="number"
              value={experienceYears}
              onChange={(e) =>
                setExperienceYears(e.target.value ? Number(e.target.value) : "")
              }
              placeholder="e.g., 15"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell patients about your experience, approach to care, and areas of expertise..."
              className="mt-2 min-h-30"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="clinicAddress">Clinic Address</Label>
            <Input
              id="clinicAddress"
              value={clinicalAddress}
              onChange={(e) => setClinicalAddress(e.target.value)}
              placeholder="123 Medical Center, City, State, ZIP"
              className="mt-2"
            />
          </div>
          <Button
            className="bg-[#0891b2]"
            onClick={handleSave}
            disabled={loading}
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionInfo;
