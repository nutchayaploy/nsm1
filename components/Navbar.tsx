'use client';

import React from 'react';
import { Sparkles, Shield, User, LogIn, Bell } from 'lucide-react';
import { Member, SystemConfig } from '../lib/types';

interface NavbarProps {
  config: SystemConfig;
  currentMember: Member | null;
  isAdmin: boolean;
  onOpenLogin: (adminMode?: boolean) => void;
  onOpenAdmin: () => void;
  onOpenMember: () => void;
  onLogout: () => void;
}

export default function Navbar({
  config,
  currentMember,
  isAdmin,
  onOpenLogin,
  onOpenAdmin,
  onOpenMember,
  onLogout,
}: NavbarProps) {
  return (
    <header className="w-full sticky top-0 z-40">
      {/* 1. Announcement Banner */}
      {config.announcementActive && config.announcement && (
        <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 text-white text-[11px] sm:text-xs py-1.5 px-4 text-center font-medium shadow-sm flex items-center justify-center gap-2">
          <Bell className="w-3.5 h-3.5 animate-bounce" />
          <span className="truncate">{config.announcement}</span>
        </div>
      )}

      {/* 2. Main Navbar */}
      <div className="bg-white/90 backdrop-blur-md border-b border-sky-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div
            onClick={onOpenMember}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src="/nsm-logo.webp"
              alt="NSM Logo"
              className="h-10 sm:h-11 w-auto object-contain drop-shadow-sm group-hover:scale-105 transition"
            />
            <div className="h-8 w-px bg-sky-200 hidden sm:block" />
            <div>
              <div className="text-sm sm:text-base font-black text-sky-950 tracking-tight flex items-center gap-1.5">
                <span>NSM Dino Club</span>
                <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                  🦖 สะสมแต้ม
                </span>
              </div>
              <div className="text-[10px] text-gray-500 hidden sm:block truncate max-w-xs">
                จัดทำโดย NSM (องค์การพิพิธภัณฑ์วิทยาศาสตร์แห่งชาติ)
              </div>
            </div>
          </div>

          {/* User Status / Action Buttons */}
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>เจ้าหน้าที่ (Admin)</span>
                </span>
                <button
                  onClick={onOpenAdmin}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
                >
                  แผงควบคุม
                </button>
              </div>
            ) : currentMember ? (
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-gray-800">{currentMember.fullName}</div>
                  <div className="text-[10px] text-sky-600 font-semibold">{currentMember.points} แต้ม</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center text-xs font-bold text-sky-700">
                  {currentMember.fullName.charAt(0)}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenLogin(false)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>เข้าสู่ระบบ / เช็คแต้ม</span>
                </button>
                <button
                  onClick={() => onOpenLogin(true)}
                  className="p-1.5 text-gray-400 hover:text-amber-600 rounded-xl hover:bg-amber-50 transition border border-gray-100"
                  title="สำหรับเจ้าหน้าที่ อพวช."
                >
                  <Shield className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
