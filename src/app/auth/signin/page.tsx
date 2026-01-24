"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
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

import { signInHandler } from "@/handlers/authHandler";
import { signinSchema } from "@/schemas/auth/signin";
import { useRouter } from "next/navigation";

const Signin: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"patient" | "doctor" | "admin">(
    "patient",
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleTabChange = (value: "patient" | "doctor" | "admin") => {
    setActiveTab(value);
    setFormData({
      email: "",
      password: "",
    });
    setError(null);
    setFieldErrors({});
    setSuccess(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors({});
    setError(null);
  };

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setFieldErrors({});

    const validation = signinSchema.safeParse({
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

      const res = await signInHandler({
        email: formData.email,
        password: formData.password,
        role: activeTab,
      });

      if (res.success) {
        setSuccess(res.message || "Signed in successfully");

        setTimeout(() => {
          router.push(`/${activeTab}`);
        }, 500);
      } else {
        setError(res.message || "Signin failed");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-[#f0f9ff] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          className="mb-4 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your HealthConnect portal
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
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="patient">Patient</TabsTrigger>
                <TabsTrigger value="doctor">Doctor</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSignin} className="space-y-4">
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

                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-white"
                  />
                  {fieldErrors.email && (
                    <p className="text-xs text-red-500">{fieldErrors.email}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-white"
                  />
                  {fieldErrors.password && (
                    <p className="text-xs text-red-500">
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#0891b2] hover:bg-[#0e7490]"
                  disabled={loading}
                >
                  {loading
                    ? "Signing in..."
                    : `Sign In as ${
                        activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
                      }`}
                </Button>
              </form>
            </Tabs>

            <div className="mt-6 text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <button className="text-[#0891b2] hover:underline font-medium">
                Create one now
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signin;
