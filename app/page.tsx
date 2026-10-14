'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Award, Shield, Phone, ArrowRight, Zap, CheckCircle2, Search, Heart } from 'lucide-react';
import { Member, Quest, SystemConfig, PointTransaction } from '../lib/types';
import {
  getStoredMembers,
  saveMembers,
  getStoredQuests,
  saveQuests,
  getStoredConfig,
  saveConfig,
  getStoredTransactions,
  saveTransactions,
  getSavedMemberId,
  saveMemberId,
  getSavedIsAdmin,
  saveIsAdmin,
  getStageForPoints,
} from '../lib/storage';
import { sounds } from '../lib/sound';
import Navbar from '../components/Navbar';
import MemberView from '../components/MemberView';
import AdminDashboard from '../components/AdminDashboard';
import LoginModal from '../components/LoginModal';

export default function HomePage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [view, setView] = useState<'member' | 'admin'>('member');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginAdminMode, setLoginAdminMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Quick search input on landing hero
  const [heroSearch, setHeroSearch] = useState('');

  // Initial load from storage
  useEffect(() => {
    const loadedMembers = getStoredMembers();
    const loadedQuests = getStoredQuests();
    const loadedConfig = getStoredConfig();
    const loadedTx = getStoredTransactions();
    const savedMid = getSavedMemberId();
    const savedAdmin = getSavedIsAdmin();

    setMembers(loadedMembers);
    setQuests(loadedQuests);
    setConfig(loadedConfig);
    setTransactions(loadedTx);
    setIsAdmin(savedAdmin);

    if (savedMid) {
      const found = loadedMembers.find(m => m.memberId === savedMid);
      if (found) setCurrentMember(found);
    } else if (loadedMembers.length > 0 && !savedAdmin) {
      // Default to first member to demonstrate interactive pet immediately!
      setCurrentMember(loadedMembers[0]);
    }

    if (savedAdmin) {
      setView('admin');
    }

    setIsLoaded(true);
  }, []);

  // Save changes to storage
  useEffect(() => {
    if (!isLoaded) return;
    saveMembers(members);
  }, [members, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    saveQuests(quests);
  }, [quests, isLoaded]);

  useEffect(() => {
    if (!isLoaded || !config) return;
    saveConfig(config);
  }, [config, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    saveTransactions(transactions);
  }, [transactions, isLoaded]);

  if (!isLoaded || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-50 text-sky-700 font-bold text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center text-2xl animate-bounce">
            🦖
          </div>
          <span>กำลังโหลดระบบสมาชิก NSM Dino Club...</span>
        </div>
      </div>
    );
  }

  // Auth Handlers
  const handleMemberLogin = (member: Member) => {
    setCurrentMember(member);
    saveMemberId(member.memberId);
    setIsAdmin(false);
    saveIsAdmin(false);
    setView('member');
  };

  const handleAdminLogin = () => {
    setIsAdmin(true);
    saveIsAdmin(true);
    setView('admin');
  };

  const handleLogout = () => {
    setCurrentMember(null);
    saveMemberId(null);
    setIsAdmin(false);
    saveIsAdmin(false);
    setView('member');
  };

  const handleRegisterMember = (name: string, phone: string) => {
    const newId = `NSM-${String(members.length + 1).padStart(3, '0')}`;
    const newMember: Member = {
      memberId: newId,
      fullName: name,
      phone,
      points: 20, // Welcome points
      dinoSpecies: 'trex',
      dinoName: 'น้องเร็กซ์จิ๋ว',
      joinDate: new Date().toISOString().split('T')[0],
      completedQuests: [],
    };

    const newTx: PointTransaction = {
      id: `tx-${Date.now()}`,
      memberId: newId,
      amount: 20,
      type: 'earn',
      reason: 'ของขวัญต้อนรับสมาชิกใหม่ NSM',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setMembers(prev => [newMember, ...prev]);
    setTransactions(prev => [newTx, ...prev]);
    setCurrentMember(newMember);
    saveMemberId(newId);
    setView('member');

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });
    sounds.playLevelUp();
  };

  // Member quest complete
  const handleCompleteQuest = (quest: Quest) => {
    if (!currentMember) return;

    const alreadyDone = (currentMember.completedQuests || []).includes(quest.id);
    if (alreadyDone) return;

    const newPoints = currentMember.points + quest.points;
    const updatedMember: Member = {
      ...currentMember,
      points: newPoints,
      completedQuests: [...(currentMember.completedQuests || []), quest.id],
    };

    const newTx: PointTransaction = {
      id: `tx-${Date.now()}`,
      memberId: currentMember.memberId,
      amount: quest.points,
      type: 'earn',
      reason: `ภารกิจ: ${quest.title}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setCurrentMember(updatedMember);
    setMembers(prev => prev.map(m => (m.memberId === currentMember.memberId ? updatedMember : m)));
    setTransactions(prev => [newTx, ...prev]);
  };

  // Admin member management handlers
  const handleAddMember = (newMember: Member) => {
    setMembers(prev => [newMember, ...prev]);
  };

  const handleUpdateMember = (updated: Member) => {
    setMembers(prev => prev.map(m => (m.memberId === updated.memberId ? updated : m)));
    if (currentMember && currentMember.memberId === updated.memberId) {
      setCurrentMember(updated);
    }
  };

  const handleDeleteMember = (memberId: string) => {
    setMembers(prev => prev.filter(m => m.memberId !== memberId));
    if (currentMember && currentMember.memberId === memberId) {
      setCurrentMember(null);
      saveMemberId(null);
    }
  };

  const handleAdjustPoints = (memberId: string, amount: number, reason: string) => {
    setMembers(prev =>
      prev.map(m => {
        if (m.memberId === memberId) {
          const nextPoints = Math.max(0, m.points + amount);
          return { ...m, points: nextPoints };
        }
        return m;
      })
    );

    if (currentMember && currentMember.memberId === memberId) {
      setCurrentMember(prev => (prev ? { ...prev, points: Math.max(0, prev.points + amount) } : null));
    }

    const newTx: PointTransaction = {
      id: `tx-${Date.now()}`,
      memberId,
      amount,
      type: 'admin_adjust',
      reason,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setTransactions(prev => [newTx, ...prev]);
  };

  // Admin Quests handlers
  const handleAddQuest = (newQuest: Quest) => {
    setQuests(prev => [newQuest, ...prev]);
  };

  const handleUpdateQuest = (updated: Quest) => {
    setQuests(prev => prev.map(q => (q.id === updated.id ? updated : q)));
  };

  const handleDeleteQuest = (questId: string) => {
    setQuests(prev => prev.filter(q => q.id !== questId));
  };

  // Google Sheets Sync handler
  const handleSyncGoogleSheets = (newMembers: Member[], url: string) => {
    setMembers(newMembers);
    setConfig(prev => (prev ? { ...prev, googleSheetsUrl: url, lastSyncedAt: new Date().toLocaleTimeString('th-TH') } : null));
    if (currentMember) {
      const match = newMembers.find(m => m.memberId === currentMember.memberId || m.phone === currentMember.phone);
      if (match) setCurrentMember(match);
    }
  };

  // Hero Quick Search submit
  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = heroSearch.trim();
    if (!query) return;

    const found = members.find(
      m =>
        m.phone.replace(/[^0-9]/g, '') === query.replace(/[^0-9]/g, '') ||
        m.memberId.toLowerCase() === query.toLowerCase()
    );

    if (found) {
      handleMemberLogin(found);
    } else {
      setIsLoginOpen(true);
      setLoginAdminMode(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Navigation Bar */}
      <Navbar
        config={config}
        currentMember={currentMember}
        isAdmin={isAdmin}
        onOpenLogin={adminMode => {
          setLoginAdminMode(!!adminMode);
          setIsLoginOpen(true);
        }}
        onOpenAdmin={() => {
          if (isAdmin) {
            setView('admin');
          } else {
            setLoginAdminMode(true);
            setIsLoginOpen(true);
          }
        }}
        onOpenMember={() => setView('member')}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
        {view === 'admin' && isAdmin ? (
          <AdminDashboard
            members={members}
            quests={quests}
            config={config}
            onAddMember={handleAddMember}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
            onAdjustPoints={handleAdjustPoints}
            onAddQuest={handleAddQuest}
            onUpdateQuest={handleUpdateQuest}
            onDeleteQuest={handleDeleteQuest}
            onSaveConfig={setConfig}
            onSyncGoogleSheets={handleSyncGoogleSheets}
            onSwitchToMemberView={() => setView('member')}
            onLogoutAdmin={handleLogout}
          />
        ) : currentMember ? (
          <MemberView
            member={currentMember}
            allMembers={members}
            quests={quests}
            config={config}
            transactions={transactions}
            onCompleteQuest={handleCompleteQuest}
            onSwitchMember={mid => {
              const found = members.find(m => m.memberId === mid);
              if (found) {
                setCurrentMember(found);
                saveMemberId(mid);
              }
            }}
            onLogout={handleLogout}
            onOpenAdmin={() => {
              if (isAdmin) {
                setView('admin');
              } else {
                setLoginAdminMode(true);
                setIsLoginOpen(true);
              }
            }}
          />
        ) : (
          /* Landing Hero for Guests */
          <div className="max-w-2xl mx-auto text-center py-10 sm:py-16 space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-4xl shadow-xl shadow-sky-200 mx-auto animate-bounce">
              🦖
            </div>
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>องค์การพิพิธภัณฑ์วิทยาศาสตร์แห่งชาติ (อพวช.)</span>
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                สะสมแต้ม เลี้ยงไดโนเสาร์ <br />
                <span className="text-sky-600">ก้าวสู่นักวิทยาศาสตร์ NSM</span>
              </h1>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                สนุกกับการชมนิทรรศการและกิจกรรมวิทยาศาสตร์ ทุกๆ แต้มจะช่วยให้ไข่ไดโนเสาร์ฟักตัวและเติบโตสู่วัยผู้ใหญ่!
              </p>
            </div>

            {/* Direct Phone / Member ID check box */}
            <form onSubmit={handleHeroSearchSubmit} className="max-w-md mx-auto">
              <div className="relative flex items-center">
                <Phone className="w-5 h-5 absolute left-4 text-sky-500" />
                <input
                  type="text"
                  placeholder="กรอกเบอร์โทร หรือ รหัสสมาชิก..."
                  value={heroSearch}
                  onChange={e => setHeroSearch(e.target.value)}
                  className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white border border-sky-200 focus:outline-none focus:border-sky-500 shadow-md text-sm font-medium"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
                >
                  เช็คแต้ม
                </button>
              </div>
            </form>

            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <button
                onClick={() => {
                  setLoginAdminMode(false);
                  setIsLoginOpen(true);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition"
              >
                เข้าสู่ระบบ / สมัครสมาชิกใหม่
              </button>
              <button
                onClick={() => {
                  setLoginAdminMode(true);
                  setIsLoginOpen(true);
                }}
                className="px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl text-xs sm:text-sm border border-gray-200 shadow-sm transition"
              >
                สำหรับเจ้าหน้าที่ (Admin)
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-white/70 border-t border-sky-100 py-4 text-center text-xs text-gray-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>
            © 2026 {config.museumName} • NSM Dino Gamification Point System
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-gray-400">พัฒนาด้วย Next.js & Tailwind CSS โทนสีฟ้าสดใส</span>
          </div>
        </div>
      </footer>

      {/* Login & Registration Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        members={members}
        onMemberLogin={handleMemberLogin}
        onAdminLogin={handleAdminLogin}
        onRegisterMember={handleRegisterMember}
        defaultAdminMode={loginAdminMode}
      />
    </div>
  );
}
