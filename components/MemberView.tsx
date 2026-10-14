'use client';

import React, { useState } from 'react';
import { User, Phone, Calendar, History, Sparkles, LogOut, ArrowRightLeft, ShieldAlert } from 'lucide-react';
import { Member, Quest, StageThreshold, PointTransaction, SystemConfig } from '../lib/types';
import DinoPet from './DinoPet';
import QuestBoard from './QuestBoard';
import { getStageForPoints } from '../lib/storage';

interface MemberViewProps {
  member: Member;
  allMembers: Member[];
  quests: Quest[];
  config: SystemConfig;
  transactions: PointTransaction[];
  onCompleteQuest: (quest: Quest) => void;
  onSwitchMember: (memberId: string) => void;
  onLogout: () => void;
  onOpenAdmin: () => void;
}

export default function MemberView({
  member,
  allMembers,
  quests,
  config,
  transactions,
  onCompleteQuest,
  onSwitchMember,
  onLogout,
  onOpenAdmin,
}: MemberViewProps) {
  const [activeTab, setActiveTab] = useState<'pet' | 'quests' | 'history'>('pet');

  const stageInfo = getStageForPoints(member.points, config.stages);
  const memberTransactions = transactions.filter(t => t.memberId === member.memberId);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Quick Demo Switcher Bar for Reviewers & Testing */}
      <div className="bg-sky-50/90 border border-sky-200/80 rounded-2xl p-2.5 px-4 flex flex-wrap items-center justify-between gap-2 shadow-sm text-xs">
        <div className="flex items-center gap-1.5 text-sky-800 font-medium">
          <ArrowRightLeft className="w-3.5 h-3.5 text-sky-600" />
          <span>ทดลองดูสัตว์เลี้ยงตัวอย่าง:</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {allMembers.slice(0, 5).map(m => {
            const mStage = getStageForPoints(m.points, config.stages);
            const isCurrent = m.memberId === member.memberId;
            return (
              <button
                key={m.memberId}
                onClick={() => onSwitchMember(m.memberId)}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  isCurrent
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-white hover:bg-sky-100 text-gray-700 border border-sky-100'
                }`}
              >
                {m.fullName.split(' ')[0]} ({m.points} แต้ม - {mStage.stage.nameTh.replace('ระยะ', '')})
              </button>
            );
          })}
        </div>
      </div>

      {/* Member Profile Card & Dinosaur Pet Stage */}
      <div className="bg-white/95 rounded-3xl p-6 sm:p-8 shadow-xl shadow-sky-100/50 border border-sky-100 backdrop-blur-sm">
        {/* Header Profile Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 mb-6 border-b border-sky-100 gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-white text-2xl font-black shadow-md shadow-sky-200">
              🦖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">{member.fullName}</h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-700 border border-sky-200">
                  {member.memberId}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-sky-500" />
                  {member.phone || 'ไม่ระบุเบอร์'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-sky-500" />
                  สมาชิกตั้งแต่ {member.joinDate}
                </span>
              </div>
            </div>
          </div>

          {/* Logout / Switch Button */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-rose-600 bg-gray-50 hover:bg-rose-50 rounded-xl border border-gray-200 hover:border-rose-200 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 p-1 bg-sky-50/70 rounded-2xl max-w-md mx-auto mb-6 border border-sky-100">
          <button
            onClick={() => setActiveTab('pet')}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'pet'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-gray-500 hover:text-sky-600'
            }`}
          >
            <span>🦖 สัตว์เลี้ยงของฉัน</span>
          </button>
          <button
            onClick={() => setActiveTab('quests')}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'quests'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-gray-500 hover:text-sky-600'
            }`}
          >
            <span>🎯 ภารกิจสะสมแต้ม</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-gray-500 hover:text-sky-600'
            }`}
          >
            <span>📜 ประวัติแต้ม</span>
          </button>
        </div>

        {/* TAB 1: PET INTERACTION */}
        {activeTab === 'pet' && (
          <div className="space-y-6 animate-fade-in">
            <DinoPet
              points={member.points}
              stageInfo={stageInfo}
              species={member.dinoSpecies}
              dinoName={member.dinoName || 'น้องไดโน NSM'}
            />

            {/* Stage Evolutionary Roadmap Card */}
            <div className="mt-8 pt-6 border-t border-sky-100">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 text-center">
                เส้นทางวิวัฒนาการไดโนเสาร์ NSM 5 ระยะ
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                {config.stages.map((st, i) => {
                  const isCurrent = st.stage === stageInfo.stage.stage;
                  const isPassed = member.points >= st.minPoints;

                  return (
                    <div
                      key={st.stage}
                      className={`p-3 rounded-2xl border text-xs transition ${
                        isCurrent
                          ? 'bg-sky-500 text-white font-bold border-sky-500 shadow-md scale-105'
                          : isPassed
                          ? 'bg-sky-50 text-sky-800 border-sky-200'
                          : 'bg-gray-50 text-gray-400 border-gray-100'
                      }`}
                    >
                      <div className="text-xl mb-1">
                        {i === 0 ? '🥚' : i === 1 ? '✨' : i === 2 ? '🐣' : i === 3 ? '🦖' : '🏆'}
                      </div>
                      <div className="text-[11px] font-bold leading-tight">{st.nameTh.replace('ระยะ', '')}</div>
                      <div className="text-[10px] opacity-80 mt-0.5">{st.minPoints}+ แต้ม</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: QUEST BOARD */}
        {activeTab === 'quests' && (
          <div className="animate-fade-in">
            <QuestBoard
              member={member}
              quests={quests}
              onCompleteQuest={onCompleteQuest}
            />
          </div>
        )}

        {/* TAB 3: TRANSACTION HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                <History className="w-4 h-4 text-sky-600" />
                <span>ประวัติการรับแต้มและการปรับปรุงคะแนน</span>
              </h3>
              <span className="text-xs text-gray-500">{memberTransactions.length} รายการ</span>
            </div>

            {memberTransactions.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-xs bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                ยังไม่มีประวัติการทำรายการ เริ่มต้นทำภารกิจเพื่อรับแต้มแรกได้เลย!
              </div>
            ) : (
              <div className="divide-y divide-gray-100 bg-white rounded-2xl border border-sky-100 overflow-hidden shadow-sm">
                {memberTransactions.map(t => (
                  <div key={t.id} className="p-3.5 flex justify-between items-center text-xs hover:bg-sky-50/30">
                    <div>
                      <div className="font-semibold text-gray-800">{t.reason}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{t.timestamp}</div>
                    </div>
                    <div className="text-right">
                      <span className={`font-bold px-2.5 py-1 rounded-lg ${
                        t.amount >= 0
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}>
                        {t.amount >= 0 ? `+${t.amount}` : t.amount} แต้ม
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Staff Admin Portal Access Link in Footer */}
      <div className="text-center pt-4">
        <button
          onClick={onOpenAdmin}
          className="inline-flex items-center gap-1.5 text-xs text-sky-600/70 hover:text-sky-800 hover:underline transition"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>สำหรับเจ้าหน้าที่ อพวช. (เข้าสู่ระบบ Admin)</span>
        </button>
      </div>
    </div>
  );
}
