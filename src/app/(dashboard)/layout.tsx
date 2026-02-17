import React from "react";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import DashboardSidebarClient from "@/components/dashboard/layout/DashboardSidebarClient";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen">
      <DashboardSidebarClient user={session.user} />
      <main className="flex-1 p-3 md:p-6 md:ml-64">{children}</main>
    </div>
  );
}
