'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Sliders, ChevronDown, Award, Zap, Phone, User, Check, X } from 'lucide-react';
import { Member, Quest, StageThreshold } from '../lib/types';
import { getStageForPoints } from '../lib/storage';

interface AdminMemberManagerProps {
  members: Member[];
  stages: StageThreshold[];
  quests: Quest[];
  onAddMember: (member: Member) => void;
  onUpdateMember: (member: Member) => void;
  onDeleteMember: (memberId: string) => void;
  onAdjustPoints: (memberId: string, amount: number, reason: string) => void;
}

export default function AdminMemberManager({
  members,
  stages,
  quests,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onAdjustPoints,
}: AdminMemberManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState<string>('all');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [adjustingMember, setAdjustingMember] = useState<Member | null>(null);

  // New Member Form State
  const [newMemberId, setNewMemberId] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPoints, setNewPoints] = useState(0);

  // Adjust Points Form State
  const [adjustAmount, setAdjustAmount] = useState<number>(50);
  const [adjustReason, setAdjustReason] = useState('ชมนิทรรศการไดโนเสาร์');

  // Filter members
  const filteredMembers = members.filter(m => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone.includes(searchQuery) ||
      m.memberId.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterStage === 'all') return true;

    const stageInfo = getStageForPoints(m.points, stages);
    return stageInfo.stage.stage === filterStage;
  });

  const handleOpenAdd = () => {
    const nextId = `NSM-${String(members.length + 1).padStart(3, '0')}`;
    setNewMemberId(nextId);
    setNewFullName('');
    setNewPhone('');
    setNewPoints(0);
    setShowAddModal(true);
  };

  const handleSaveNewMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim()) return;

    onAddMember({
      memberId: newMemberId.trim() || `NSM-${Date.now().toString().slice(-4)}`,
      fullName: newFullName.trim(),
      phone: newPhone.replace(/[^0-9]/g, '').trim(),
      points: Number(newPoints) || 0,
      dinoSpecies: 'trex',
      dinoName: 'น้องไดโนเสาร์',
      joinDate: new Date().toISOString().split('T')[0],
      completedQuests: [],
    });

    setShowAddModal(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    onUpdateMember(editingMember);
    setEditingMember(null);
  };

  const handleConfirmAdjust = () => {
    if (!adjustingMember || !adjustAmount) return;
    onAdjustPoints(adjustingMember.memberId, adjustAmount, adjustReason);
    setAdjustingMember(null);
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar: Search, Stage Filter, Add Member Button */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="flex flex-1 items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาชื่อ, เบอร์โทร, หรือรหัสสมาชิก..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl text-xs sm:text-sm border border-gray-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* Filter Stage */}
          <select
            value={filterStage}
            onChange={e => setFilterStage(e.target.value)}
            className="px-3 py-2 bg-white rounded-xl text-xs sm:text-sm border border-gray-200 text-gray-700 focus:outline-none focus:border-sky-500"
          >
            <option value="all">ทุกระยะ (All Stages)</option>
            <option value="egg">ระยะไข่ (0-99)</option>
            <option value="hatching">ระยะฟักไข่ (100-249)</option>
            <option value="baby">ระยะแรกเกิด (250-499)</option>
            <option value="growing">ระยะกำลังโต (500-999)</option>
            <option value="adult">ระยะโตเต็มวัย (1000+)</option>
          </select>
        </div>

        {/* Add Member Button */}
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มสมาชิกใหม่</span>
        </button>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-sky-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-sky-50/60 text-sky-900 border-b border-sky-100 font-semibold">
              <tr>
                <th className="py-3 px-4">รหัสสมาชิก</th>
                <th className="py-3 px-4">ชื่อ-นามสกุล</th>
                <th className="py-3 px-4">เบอร์โทรศัพท์</th>
                <th className="py-3 px-4 text-center">แต้มสะสม</th>
                <th className="py-3 px-4 text-center">สถานะไดโนเสาร์</th>
                <th className="py-3 px-4 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredMembers.map(m => {
                const stageInfo = getStageForPoints(m.points, stages);

                return (
                  <tr key={m.memberId} className="hover:bg-sky-50/30 transition">
                    <td className="py-3 px-4 font-mono font-bold text-sky-700">{m.memberId}</td>
                    <td className="py-3 px-4 font-medium text-gray-900">{m.fullName}</td>
                    <td className="py-3 px-4 font-mono text-gray-600">{m.phone || '-'}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
                        {m.points.toLocaleString()} แต้ม
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{
                          backgroundColor: `${stageInfo.stage.accentColor}18`,
                          color: stageInfo.stage.accentColor,
                          border: `1px solid ${stageInfo.stage.accentColor}30`,
                        }}
                      >
                        <span>{stageInfo.stageIndex === 0 ? '🥚' : stageInfo.stageIndex === 1 ? '✨' : stageInfo.stageIndex === 2 ? '🐣' : stageInfo.stageIndex === 3 ? '🦖' : '🏆'}</span>
                        <span>{stageInfo.stage.nameTh}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setAdjustingMember(m);
                            setAdjustAmount(50);
                            setAdjustReason('ชมนิทรรศการไดโนเสาร์');
                          }}
                          className="px-2.5 py-1 text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg border border-amber-200 transition"
                          title="ปรับแต้ม"
                        >
                          ⚡ ปรับแต้ม
                        </button>
                        <button
                          onClick={() => setEditingMember(m)}
                          className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-gray-700 rounded-lg transition"
                          title="แก้ไข"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`ยืนยันการลบสมาชิก ${m.fullName} (${m.memberId})?`)) {
                              onDeleteMember(m.memberId);
                            }
                          }}
                          className="p-1.5 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-lg transition"
                          title="ลบ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            ไม่พบข้อมูลสมาชิกตามเงื่อนไขที่ระบุ
          </div>
        )}
      </div>

      {/* ADD MEMBER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-sky-100 animate-fade-in">
            <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-sky-600" />
              <span>เพิ่มสมาชิกใหม่</span>
            </h3>

            <form onSubmit={handleSaveNewMember} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">รหัสสมาชิก</label>
                <input
                  type="text"
                  required
                  value={newMemberId}
                  onChange={e => setNewMemberId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ด.ช. วิทยา ใฝ่รู้"
                  value={newFullName}
                  onChange={e => setNewFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">เบอร์โทรศัพท์ (สำหรับใช้ Login)</label>
                <input
                  type="tel"
                  placeholder="0812345678"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">แต้มสะสมเริ่มต้น</label>
                <input
                  type="number"
                  min="0"
                  value={newPoints}
                  onChange={e => setNewPoints(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-sky-600 text-white hover:bg-sky-700 transition"
                >
                  บันทึกข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MEMBER MODAL */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-sky-100 animate-fade-in">
            <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-sky-600" />
              <span>แก้ไขข้อมูลสมาชิก ({editingMember.memberId})</span>
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  required
                  value={editingMember.fullName}
                  onChange={e => setEditingMember({ ...editingMember, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">เบอร์โทรศัพท์</label>
                <input
                  type="tel"
                  value={editingMember.phone}
                  onChange={e => setEditingMember({ ...editingMember, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">แต้มสะสม</label>
                <input
                  type="number"
                  min="0"
                  value={editingMember.points}
                  onChange={e => setEditingMember({ ...editingMember, points: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="flex-1 py-2 rounded-xl text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-sky-600 text-white hover:bg-sky-700 transition"
                >
                  บันทึกการแก้ไข
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADJUST POINTS MODAL */}
      {adjustingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-sky-100 animate-fade-in">
            <h3 className="text-base font-bold text-gray-800 mb-1 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>ปรับแต้มสมาชิก</span>
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              {adjustingMember.fullName} ({adjustingMember.memberId}) • ปัจจุบันมี {adjustingMember.points} แต้ม
            </p>

            <div className="space-y-3.5 text-xs sm:text-sm">
              {/* Quick Preset Buttons */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">เลือกแต้มด่วน</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[+10, +30, +50, +100, -20, -50].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAdjustAmount(val)}
                      className={`py-1.5 rounded-xl font-bold transition text-xs ${
                        adjustAmount === val
                          ? 'bg-sky-600 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-sky-50 border border-gray-200'
                      }`}
                    >
                      {val > 0 ? `+${val}` : val}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">จำนวนแต้ม (สามารถติดลบได้)</label>
                <input
                  type="number"
                  value={adjustAmount}
                  onChange={e => setAdjustAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500 font-bold text-sky-700"
                />
              </div>

              {/* Select Reason from Quests */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">เลือกเหตุผลจากภารกิจ หรือพิมพ์เอง</label>
                <select
                  value={adjustReason}
                  onChange={e => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500 mb-2"
                >
                  <option value="ชมนิทรรศการไดโนเสาร์">ชมนิทรรศการไดโนเสาร์</option>
                  <option value="เข้าร่วมเวิร์กช็อปวิทยาศาสตร์">เข้าร่วมเวิร์กช็อปวิทยาศาสตร์</option>
                  <option value="ซื้อของที่ระลึก NSM Souvenir Shop">ซื้อของที่ระลึก NSM Souvenir Shop</option>
                  <option value="รางวัลพิเศษจากเจ้าหน้าที่">รางวัลพิเศษจากเจ้าหน้าที่</option>
                  <option value="ปรับปรุงแต้ม / คืนแต้ม">ปรับปรุงแต้ม / คืนแต้ม</option>
                  {quests.map(q => (
                    <option key={q.id} value={q.title}>ภารกิจ: {q.title} (+{q.points})</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="หรือพิมพ์ระบุเหตุผลเอง..."
                  value={adjustReason}
                  onChange={e => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 text-xs text-sky-800">
                แต้มหลังปรับปรุง: <strong>{Math.max(0, adjustingMember.points + adjustAmount)} แต้ม</strong>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustingMember(null)}
                  className="flex-1 py-2 rounded-xl text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAdjust}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition shadow-sm"
                >
                  ยืนยันปรับแต้ม
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
