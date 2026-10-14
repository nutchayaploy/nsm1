'use client';

import React, { useState } from 'react';
import { Users, Award, Palette, Sheet, LogOut, ArrowLeft, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { Member, Quest, SystemConfig, StageThreshold } from '../lib/types';
import AdminMemberManager from './AdminMemberManager';
import AdminQuestManager from './AdminQuestManager';
import UICustomizer from './UICustomizer';
import GoogleSheetsModal from './GoogleSheetsModal';

interface AdminDashboardProps {
  members: Member[];
  quests: Quest[];
  config: SystemConfig;
  onAddMember: (member: Member) => void;
  onUpdateMember: (member: Member) => void;
  onDeleteMember: (memberId: string) => void;
  onAdjustPoints: (memberId: string, amount: number, reason: string) => void;
  onAddQuest: (quest: Quest) => void;
  onUpdateQuest: (quest: Quest) => void;
  onDeleteQuest: (questId: string) => void;
  onSaveConfig: (config: SystemConfig) => void;
  onSyncGoogleSheets: (members: Member[], url: string) => void;
  onSwitchToMemberView: () => void;
  onLogoutAdmin: () => void;
}

export default function AdminDashboard({
  members,
  quests,
  config,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onAdjustPoints,
  onAddQuest,
  onUpdateQuest,
  onDeleteQuest,
  onSaveConfig,
  onSyncGoogleSheets,
  onSwitchToMemberView,
  onLogoutAdmin,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'members' | 'quests' | 'customizer'>('members');
  const [showSheetsModal, setShowSheetsModal] = useState(false);

  // Quick stats
  const totalPoints = members.reduce((acc, m) => acc + (m.points || 0), 0);
  const activeQuestsCount = quests.filter(q => q.active).length;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Admin Top Header Card */}
      <div className="bg-white/95 rounded-3xl p-6 shadow-xl shadow-sky-100/50 border border-sky-100 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3.5">
            <img
              src="/nsm-logo.webp"
              alt="NSM Logo"
              className="h-12 w-auto object-contain drop-shadow-sm"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>แผงควบคุมเจ้าหน้าที่ อพวช. (Admin Dashboard)</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <span>ระบบสมาชิกและสัตว์เลี้ยงไดโนเสาร์ NSM</span>
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                จัดทำโดย NSM (องค์การพิพิธภัณฑ์วิทยาศาสตร์แห่งชาติ) • แอดมิน: <strong className="text-sky-700">adminnsm</strong>
              </p>
            </div>
          </div>

          {/* Action Buttons in Header */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Google Sheets Sync Button */}
            <button
              onClick={() => setShowSheetsModal(true)}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition"
            >
              <Sheet className="w-4 h-4" />
              <span>ซิงค์ Google Sheets</span>
            </button>

            {/* Switch to Customer Portal */}
            <button
              onClick={onSwitchToMemberView}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl text-xs sm:text-sm font-semibold border border-sky-200 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ดูหน้าจอสมาชิก</span>
            </button>

            {/* Logout Admin */}
            <button
              onClick={onLogoutAdmin}
              className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition border border-gray-200"
              title="ออกจากระบบแอดมิน"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Summary Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
          <div className="p-3.5 bg-sky-50/60 rounded-2xl border border-sky-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-gray-500 font-medium">สมาชิกทั้งหมด</div>
              <div className="text-lg font-black text-sky-950">{members.length} คน</div>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-gray-500 font-medium">แต้มหมุนเวียนรวม</div>
              <div className="text-lg font-black text-amber-950">{totalPoints.toLocaleString()} แต้ม</div>
            </div>
          </div>

          <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-gray-500 font-medium">ภารกิจที่เปิดอยู่</div>
              <div className="text-lg font-black text-purple-950">{activeQuestsCount} ภารกิจ</div>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              🦖
            </div>
            <div>
              <div className="text-[11px] text-gray-500 font-medium">ไดโนเสาร์โตเต็มวัย</div>
              <div className="text-lg font-black text-emerald-950">
                {members.filter(m => m.points >= 1000).length} ตัว
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex gap-2 p-1.5 bg-sky-100/60 rounded-2xl border border-sky-200/80 max-w-lg mx-auto">
        <button
          onClick={() => setActiveTab('members')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'members'
              ? 'bg-white text-sky-700 shadow-sm'
              : 'text-gray-600 hover:text-sky-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>จัดการสมาชิก</span>
        </button>

        <button
          onClick={() => setActiveTab('quests')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'quests'
              ? 'bg-white text-sky-700 shadow-sm'
              : 'text-gray-600 hover:text-sky-700'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>จัดการภารกิจ</span>
        </button>

        <button
          onClick={() => setActiveTab('customizer')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'customizer'
              ? 'bg-white text-sky-700 shadow-sm'
              : 'text-gray-600 hover:text-sky-700'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>ปรับแต่ง UX/UI</span>
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'members' && (
        <AdminMemberManager
          members={members}
          stages={config.stages}
          quests={quests}
          onAddMember={onAddMember}
          onUpdateMember={onUpdateMember}
          onDeleteMember={onDeleteMember}
          onAdjustPoints={onAdjustPoints}
        />
      )}

      {activeTab === 'quests' && (
        <AdminQuestManager
          quests={quests}
          onAddQuest={onAddQuest}
          onUpdateQuest={onUpdateQuest}
          onDeleteQuest={onDeleteQuest}
        />
      )}

      {activeTab === 'customizer' && (
        <UICustomizer
          config={config}
          onSaveConfig={onSaveConfig}
        />
      )}

      {/* Google Sheets Modal */}
      {showSheetsModal && (
        <GoogleSheetsModal
          currentUrl={config.googleSheetsUrl}
          members={members}
          onClose={() => setShowSheetsModal(false)}
          onSyncSuccess={(newMembers, url) => {
            onSyncGoogleSheets(newMembers, url);
            setShowSheetsModal(false);
          }}
        />
      )}
    </div>
  );
}
