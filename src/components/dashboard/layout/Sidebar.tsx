"use client";

import React, { useState } from 'react';
import { ChevronRight, LogOut, Menu, X } from 'lucide-react';
import { sidebarLinksByRole, UserRole, SidebarLink } from '@/app/data/sideLinks';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarProps } from '@/types/dashboardTypes';

export const Sidebar: React.FC<SidebarProps> = ({
  user = null,
  currentPage = 'overview',
  onPageChange = () => {},
  onSignOut = () => {},
  notificationsCount = 0,
}) => {
  const role: UserRole = (user?.role as UserRole) || 'patient';
  const links: SidebarLink[] =
    sidebarLinksByRole[role] || sidebarLinksByRole.patient;

  // ✅ ADDED: drawer state
  const [open, setOpen] = useState(false);

  const getInitials = (name = '') => {
    return name
      .split(' ')
      .map((n) => n[0] || '')
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <>
      {/* ✅ Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 z-50 p-0.5 bg-emerald-200 rounded-r-md shadow-lg"
        onClick={() => setOpen(true)}
      >
        <ChevronRight className="w-4 h-10" />
      </button>

      {/* ✅ Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="bg-[#f8fafc]">
        <aside
          className={`
            fixed left-0 top-0 z-50
            h-screen w-64 bg-white border-r border-gray-200 flex flex-col
            transform transition-transform duration-300
            ${open ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0
          `}
        >
          {/* ✅ Mobile Close Button */}
          <div className="md:hidden flex justify-end p-4">
            <button onClick={() => setOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0891b2] rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">HealthConnect</h3>
                <p className="text-xs text-gray-500 capitalize">
                  {role} Portal
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {links.map((item) => (
              <button
                key={item.page}
                type="button"
                onClick={() => {
                  onPageChange(item.page);
                  setOpen(false); // ✅ auto close on mobile
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentPage === item.page
                    ? 'bg-[#e0f2fe] text-[#0891b2]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-3">
              <Avatar>
                {user?.image ? (
                  <AvatarImage
                    src={user.image}
                    alt={user?.name || 'User avatar'}
                  />
                ) : (
                  <AvatarFallback className="bg-[#0891b2] text-white">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {user?.name || 'Guest'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || ''}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={onSignOut}
              type="button"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </aside>
      </div>
    </>
  );
};
