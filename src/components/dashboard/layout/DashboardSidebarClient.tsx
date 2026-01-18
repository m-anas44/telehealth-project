"use client";

import { Sidebar } from "@/components/dashboard/layout/Sidebar";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardSidebarClient({ user }: { user: any }) {
  const router = useRouter();
  const pathname = usePathname();

  const currentPage = pathname.split("/").pop() || "overview";

  return (
    <Sidebar
      user={user}
      currentPage={currentPage}
      onPageChange={(page) => router.push(`/${user.role}/${page}`)}
      onSignOut={() => signOut({ callbackUrl: "/auth/signin" })}
    />
  );
}
