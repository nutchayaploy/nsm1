'use client';

import React, { useState } from 'react';
import { User, Phone, ShieldCheck, Lock, Sparkles, AlertCircle, ArrowRight, Check } from 'lucide-react';
import { Member } from '../lib/types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  onMemberLogin: (member: Member) => void;
  onAdminLogin: () => void;
  onRegisterMember: (name: string, phone: string) => void;
  defaultAdminMode?: boolean;
}

export default function LoginModal({
  isOpen,
  onClose,
  members,
  onMemberLogin,
  onAdminLogin,
  onRegisterMember,
  defaultAdminMode = false,
}: LoginModalProps) {
  const [role, setRole] = useState<'member' | 'admin'>(defaultAdminMode ? 'admin' : 'member');

  // Member Login Form
  const [memberIdentifier, setMemberIdentifier] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');

  // Admin Login Form
  const [adminUsername, setAdminUsername] = useState('adminnsm');
  const [adminPassword, setAdminPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (isRegistering) {
      if (!regName.trim() || !regPhone.trim()) {
        setErrorMessage('กรุณากรอกชื่อและเบอร์โทรศัพท์');
        return;
      }
      onRegisterMember(regName.trim(), regPhone.trim());
      onClose();
      return;
    }

    const cleanInput = memberIdentifier.trim();
    if (!cleanInput) {
      setErrorMessage('กรุณากรอกเบอร์โทร หรือรหัสสมาชิก');
      return;
    }

    // Match phone or memberId
    const found = members.find(
      m =>
        m.phone.replace(/[^0-9]/g, '') === cleanInput.replace(/[^0-9]/g, '') ||
        m.memberId.toLowerCase() === cleanInput.toLowerCase()
    );

    if (found) {
      onMemberLogin(found);
      onClose();
    } else {
      setErrorMessage('ไม่พบข้อมูลสมาชิก กรุณาตรวจสอบเบอร์โทร หรือกดสมัครสมาชิกใหม่ด้านล่าง');
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (adminUsername.trim() === 'adminnsm' && adminPassword === '072517') {
      onAdminLogin();
      onClose();
    } else {
      setErrorMessage('ชื่อผู้ใช้หรือรหัสผ่านแอดมินไม่ถูกต้อง (ลองตรวจสอบ: adminnsm / 072517)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-sky-100 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
        >
          ✕
        </button>

        {/* Role Selector Tabs */}
        <div className="flex gap-1.5 p-1 bg-sky-50 rounded-2xl mb-6 border border-sky-100">
          <button
            type="button"
            onClick={() => {
              setRole('member');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
              role === 'member'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-gray-500 hover:text-sky-600'
            }`}
          >
            <span>🦖 สมาชิกทั่วไป</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole('admin');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
              role === 'admin'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-gray-500 hover:text-sky-600'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>เจ้าหน้าที่ (Admin)</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. MEMBER LOGIN / REGISTER FORM */}
        {role === 'member' && (
          <div>
            <div className="text-center mb-5">
              <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-2xl mx-auto flex items-center justify-center text-3xl mb-2 shadow-inner">
                🦖
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {isRegistering ? 'สมัครสมาชิก NSM Dino Club' : 'เข้าสู่ระบบเช็คแต้มสะสม'}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {isRegistering
                  ? 'ลงทะเบียนง่ายๆ รับไข่ไดโนเสาร์ฟองแรกฟรีทันที!'
                  : 'กรอกเบอร์โทร หรือรหัสสมาชิก เพื่อดูแลน้องไดโนเสาร์ของคุณ'}
              </p>
            </div>

            <form onSubmit={handleMemberSubmit} className="space-y-3.5 text-xs sm:text-sm">
              {isRegistering ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      ชื่อ-นามสกุล / ชื่อเล่น
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น ด.ช. ภูมิใจ รักวิทย์"
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      เบอร์โทรศัพท์ (ใช้สำหรับเข้าสู่ระบบ)
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="08XXXXXXXX"
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    เบอร์โทรศัพท์ หรือ รหัสสมาชิก
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="เช่น 0812345678 หรือ NSM-001"
                      value={memberIdentifier}
                      onChange={e => setMemberIdentifier(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500 font-medium text-gray-800"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    * ไม่ต้องจำ Password แค่กรอกเบอร์โทรที่เคยให้ไว้
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <span>{isRegistering ? 'รับไข่ไดโนเสาร์ทันที' : 'เข้าสู่ระบบ'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Toggle Register / Login */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setErrorMessage('');
                  }}
                  className="text-xs text-sky-600 hover:text-sky-800 font-medium underline"
                >
                  {isRegistering
                    ? 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบที่นี่'
                    : 'ยังไม่เป็นสมาชิก? สมัครสมาชิกใหม่ฟรี'}
                </button>
              </div>

              {/* Quick Demo Test Accounts for Review */}
              {!isRegistering && (
                <div className="pt-4 border-t border-gray-100">
                  <div className="text-[11px] font-semibold text-gray-400 mb-2 text-center">
                    หรือทดลองเข้าสู่ระบบด้วยบัญชีตัวอย่าง:
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    {members.slice(0, 4).map(m => (
                      <button
                        key={m.memberId}
                        type="button"
                        onClick={() => {
                          onMemberLogin(m);
                          onClose();
                        }}
                        className="p-2 rounded-xl bg-sky-50/70 hover:bg-sky-100 text-sky-800 text-left border border-sky-100 transition truncate"
                      >
                        <div className="font-bold truncate">{m.fullName.split(' ')[0]}</div>
                        <div className="text-[10px] text-gray-500">{m.points} แต้ม ({m.memberId})</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

        {/* 2. ADMIN LOGIN FORM */}
        {role === 'admin' && (
          <div>
            <div className="text-center mb-5">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl mx-auto flex items-center justify-center mb-2 shadow-inner border border-amber-200">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">เข้าสู่ระบบแอดมิน (เจ้าหน้าที่ อพวช.)</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                กรุณากรอกรหัสผ่านเพื่อจัดการสมาชิกและระบบ Google Sheets
              </p>
            </div>

            <form onSubmit={handleAdminSubmit} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">ชื่อผู้ใช้ (Username)</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={adminUsername}
                    onChange={e => setAdminUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 font-medium text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">รหัสผ่าน (Password)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••"
                    value={adminPassword}
                    onChange={e => setAdminPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200 text-[11px] text-amber-800">
                💡 รหัสแอดมินค่าเริ่มต้น: <strong>adminnsm</strong> / <strong>072517</strong>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <span>เข้าสู่ระบบเจ้าหน้าที่</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
