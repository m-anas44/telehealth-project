import { UserRole } from "@/app/data/sideLinks";

export interface UserInfo {
  name?: string;
  email?: string;
  role?: UserRole;
  image?: string | null;
}

export interface SidebarProps {
  user?: UserInfo | null;
  currentPage?: string;
  onPageChange?: (page: string) => void;
  onSignOut?: () => void;
  notificationsCount?: number;
}