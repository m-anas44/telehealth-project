"use client";

import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Loader2, Camera } from "lucide-react";
import { getUploadUrl, getViewUrl } from "@/handlers/doctorHandler";
import toast from "react-hot-toast";
import { updateProfilePicture } from "@/handlers/userHandler";

const ProfileHeader = ({ user }: { user: any }) => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfilePic = async () => {
      if (user?.image) {
        try {
          const url = await getViewUrl(user.image);
          setImgUrl(url);
        } catch (err) {
          console.error("Failed to load profile picture", err);
        }
      }
    };
    fetchProfilePic();
  }, [user?.image]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Image must be less than 2MB");
    }

    setUploading(true);
    const toastId = toast.loading("Uploading photo...");

    try {
      const { url, key } = await getUploadUrl(
        file.name,
        file.type,
        "profilePicture",
      );

      await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      await updateProfilePicture(key);

      const newViewUrl = await getViewUrl(key);
      setImgUrl(newViewUrl);

      toast.success("Profile photo updated successfully!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Upload failed", { id: toastId });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <Avatar className="w-24 h-24 border-2 border-gray-100">
                {/* imgUrl contains the temporary signed URL from S3 */}
                <AvatarImage
                  src={imgUrl || ""}
                  alt={user?.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-[#0891b2] text-white text-2xl font-bold">
                  {user?.name ?? <Loader2 className="animate-spin" />}
                </AvatarFallback>
              </Avatar>

              {uploading && (
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {user?.name || "Doctor Name"}
                </h2>
                <Badge className="bg-[#10b981] hover:bg-[#10b981]">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Doctor ID: D-
                {user?.id ? user.id.slice(-8).toUpperCase() : "XXXXXX"}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="border-cyan-200 text-cyan-700 hover:bg-cyan-50"
              >
                <Camera className="w-4 h-4 mr-2" />
                {uploading ? "Updating..." : "Change Photo"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileHeader;
