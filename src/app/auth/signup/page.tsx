"use client";

import React, { useState } from "react";
import { ZodError } from "zod";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { signUpHandler } from "@/handlers/authHandler";
import { signupSchema } from "@/schemas/auth/signup.schema";
import { useRouter } from "next/navigation";

const Signup: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"patient" | "doctor">("patient");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTabChange = (value: "patient" | "doctor") => {
    setActiveTab(value);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    });
    setError(null);
    setFieldErrors({});
    setSuccess(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setFieldErrors({});
    setError(null);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setError(null);
    setSuccess(null);

    if (!formData.terms) {
      setError("You must accept the Terms & Privacy Policy.");
      return;
    }

    const validation = signupSchema.safeParse({
      ...formData,
      role: activeTab,
    });

    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        errors[key] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    try {
      setLoading(true);

      const res = await signUpHandler({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: activeTab,
      });

      if (res.success) {
        setSuccess(res.message || "Account created successfully!");

        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          terms: false,
        });
        setTimeout(() => {
          router.push("/auth/signin");
        }, 500);
      } else {
        setError(res.message || "Signup failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-[#f0f9ff] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="border-2">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-[#10b981] rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Join HealthConnect to access quality healthcare
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={(v) => {
                handleTabChange(activeTab);
                setActiveTab(v as any);
              }}
            >
              <TabsList className="grid w-full grid-cols-2 mb-2">
                <TabsTrigger value="patient">Patient</TabsTrigger>
                <TabsTrigger value="doctor">Doctor</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSignup} className="space-y-4">
                {error && (
                  <div className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded p-2">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="text-green-700 text-sm text-center bg-green-50 border border-green-200 rounded p-2">
                    {success}
                  </div>
                )}

                {["name", "email", "password", "confirmPassword"].map(
                  (field) => (
                    <div key={field} className="space-y-1">
                      <Label htmlFor={field}>
                        {field === "confirmPassword"
                          ? "Confirm Password"
                          : field.charAt(0).toUpperCase() + field.slice(1)}
                      </Label>
                      <Input
                        id={field}
                        name={field}
                        type={
                          field === "password" || field === "confirmPassword"
                            ? "password"
                            : field === "email"
                              ? "email"
                              : "text"
                        }
                        placeholder={
                          field === "name"
                            ? "John Doe"
                            : field === "email"
                              ? "you@example.com"
                              : field === "password"
                                ? "Enter your password"
                                : "Confirm password"
                        }
                        value={(formData as any)[field]}
                        onChange={handleChange}
                      />
                      {fieldErrors[field] && (
                        <p className="text-xs text-red-500">
                          {fieldErrors[field]}
                        </p>
                      )}
                    </div>
                  ),
                )}

                <div className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleChange}
                  />
                  <span>I agree to the Terms & Privacy Policy</span>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#10b981] hover:bg-emerald-700 cursor-pointer"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
