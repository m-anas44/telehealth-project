import React from "react";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  MessageSquare,
  User,
  Users,
  UserCheck,
  BarChart3,
} from "lucide-react";

export type UserRole = "patient" | "doctor" | "admin";

export interface SidebarLink {
  icon: React.ReactNode;
  label: string;
  page: string;
}

export type SidebarLinksByRole = Record<UserRole, SidebarLink[]>;

export const sidebarLinksByRole: SidebarLinksByRole = {
  patient: [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Overview",
      page: "overview",
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Appointments",
      page: "appointments",
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: "Medical History",
      page: "medical-history",
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      label: "Messages",
      page: "chat",
    },
    {
      icon: <User className="w-5 h-5" />,
      label: "Profile",
      page: "profile",
    },
  ],

  doctor: [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Overview",
      page: "overview",
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Schedule",
      page: "schedule",
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Patients",
      page: "patients",
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: "Consultations",
      page: "consultation",
    },
    {
      icon: <User className="w-5 h-5" />,
      label: "Profile",
      page: "profile",
    },
  ],

  admin: [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Overview",
      page: "overview",
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Manage Users",
      page: "users",
    },
    {
      icon: <UserCheck className="w-5 h-5" />,
      label: "Doctor Verification",
      page: "doctors",
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      label: "Analytics",
      page: "analytics",
    },
  ],
};
