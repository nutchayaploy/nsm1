'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Award, Check, Sparkles } from 'lucide-react';
import { Quest, QuestCategory } from '../lib/types';

interface AdminQuestManagerProps {
  quests: Quest[];
  onAddQuest: (quest: Quest) => void;
  onUpdateQuest: (quest: Quest) => void;
  onDeleteQuest: (questId: string) => void;
}

export default function AdminQuestManager({
  quests,
  onAddQuest,
  onUpdateQuest,
  onDeleteQuest,
}: AdminQuestManagerProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<QuestCategory>('exhibition');
  const [points, setPoints] = useState<number>(50);
  const [icon, setIcon] = useState('🦕');
  const [badge, setBadge] = useState('กิจกรรมใหม่');
  const [quizQuestion, setQuizQuestion] = useState('');
  const [quizOptions, setQuizOptions] = useState<string[]>(['ตัวเลือกที่ 1', 'ตัวเลือกที่ 2', 'ตัวเลือกที่ 3', 'ตัวเลือกที่ 4']);
  const [quizCorrectIndex, setQuizCorrectIndex] = useState(0);

  const handleOpenAdd = () => {
    setTitle('');
    setDescription('');
    setCategory('exhibition');
    setPoints(50);
    setIcon('🦕');
    setBadge('กิจกรรมใหม่');
    setQuizQuestion('');
    setQuizOptions(['ตัวเลือก 1', 'ตัวเลือก 2', 'ตัวเลือก 3', 'ตัวเลือก 4']);
    setQuizCorrectIndex(0);
    setShowAddModal(true);
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newQuest: Quest = {
      id: `q-${Date.now().toString().slice(-4)}`,
      title: title.trim(),
      description: description.trim(),
      category,
      points: Number(points) || 10,
      icon: icon || '✨',
      badge: badge.trim() || 'ภารกิจ',
      active: true,
      ...(category === 'quiz' && {
        quizQuestion: quizQuestion.trim(),
        quizOptions: quizOptions.filter(o => o.trim().length > 0),
        quizCorrectIndex,
      }),
    };

    onAddQuest(newQuest);
    setShowAddModal(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuest) return;
    onUpdateQuest(editingQuest);
    setEditingQuest(null);
  };

  const handleToggleActive = (quest: Quest) => {
    onUpdateQuest({
      ...quest,
      active: !quest.active,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-sky-600" />
            <span>จัดการภารกิจสะสมแต้มทั้งหมด ({quests.length} ภารกิจ)</span>
          </h3>
          <p className="text-xs text-gray-500">
            สร้างหรือแก้ไขภารกิจเพื่อกระตุ้นให้ผู้เข้าชมร่วมกิจกรรมและสะสมแต้ม
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มภารกิจใหม่</span>
        </button>
      </div>

      {/* Quests Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-sky-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-sky-50/60 text-sky-900 border-b border-sky-100 font-semibold">
              <tr>
                <th className="py-3 px-4">ไอคอน</th>
                <th className="py-3 px-4">ชื่อภารกิจ</th>
                <th className="py-3 px-4">หมวดหมู่</th>
                <th className="py-3 px-4 text-center">แต้มรางวัล</th>
                <th className="py-3 px-4 text-center">สถานะ</th>
                <th className="py-3 px-4 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {quests.map(q => (
                <tr key={q.id} className="hover:bg-sky-50/30 transition">
                  <td className="py-3 px-4 text-2xl">{q.icon}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-gray-900">{q.title}</div>
                    <div className="text-xs text-gray-500 line-clamp-1">{q.description}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-medium">
                      {q.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                      +{q.points} แต้ม
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleActive(q)}
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold transition ${
                        q.active
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-gray-100 text-gray-400 border border-gray-200'
                      }`}
                    >
                      {q.active ? 'เปิดใช้งาน' : 'ปิด'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setEditingQuest(q)}
                        className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-gray-700 rounded-lg transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`ยืนยันการลบภารกิจ ${q.title}?`)) {
                            onDeleteQuest(q.id);
                          }
                        }}
                        className="p-1.5 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD QUEST MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-sky-100 max-h-[90vh] overflow-y-auto animate-fade-in">
            <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Plus className="w-5 h-5 text-sky-600" />
              <span>สร้างภารกิจสะสมแต้มใหม่</span>
            </h3>

            <form onSubmit={handleSaveNew} className="space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">ไอคอน</label>
                  <input
                    type="text"
                    required
                    value={icon}
                    onChange={e => setIcon(e.target.value)}
                    className="w-full text-center text-xl px-2 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">ชื่อภารกิจ</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น ชมนิทรรศการหุ่นยนต์"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">คำอธิบายภารกิจ</label>
                <textarea
                  rows={2}
                  placeholder="รายละเอียดสิ่งที่ต้องทำ..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">หมวดหมู่</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as QuestCategory)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500"
                  >
                    <option value="exhibition">ชมนิทรรศการ</option>
                    <option value="workshop">เวิร์กช็อป</option>
                    <option value="quiz">ตอบคำถามวิทย์</option>
                    <option value="shop">ของที่ระลึก</option>
                    <option value="special">พิเศษ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">แต้มรางวัล (+)</label>
                  <input
                    type="number"
                    min="1"
                    value={points}
                    onChange={e => setPoints(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {category === 'quiz' && (
                <div className="p-3 bg-sky-50 rounded-2xl border border-sky-100 space-y-2">
                  <span className="text-xs font-bold text-sky-800">ตั้งค่าคำถามวิทยาศาสตร์</span>
                  <input
                    type="text"
                    placeholder="คำถาม เช่น อะไรคือดาวเคราะห์ดวงที่ 3?"
                    value={quizQuestion}
                    onChange={e => setQuizQuestion(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-xl text-xs bg-white"
                  />
                  <div className="space-y-1">
                    {quizOptions.map((opt, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <input
                          type="radio"
                          name="quizCorrect"
                          checked={quizCorrectIndex === i}
                          onChange={() => setQuizCorrectIndex(i)}
                          title="คลิกเพื่อตั้งเป็นคำตอบที่ถูก"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={e => {
                            const next = [...quizOptions];
                            next[i] = e.target.value;
                            setQuizOptions(next);
                          }}
                          className="flex-1 px-2.5 py-1 text-xs border border-gray-200 rounded-lg bg-white"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-500">* เลือกวงกลมที่หน้าตัวเลือกที่ถูกต้อง</p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
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
                  บันทึกภารกิจ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT QUEST MODAL */}
      {editingQuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-sky-100 max-h-[90vh] overflow-y-auto animate-fade-in">
            <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-sky-600" />
              <span>แก้ไขภารกิจ</span>
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">ไอคอน</label>
                  <input
                    type="text"
                    required
                    value={editingQuest.icon}
                    onChange={e => setEditingQuest({ ...editingQuest, icon: e.target.value })}
                    className="w-full text-center text-xl px-2 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">ชื่อภารกิจ</label>
                  <input
                    type="text"
                    required
                    value={editingQuest.title}
                    onChange={e => setEditingQuest({ ...editingQuest, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">คำอธิบาย</label>
                <textarea
                  rows={2}
                  value={editingQuest.description}
                  onChange={e => setEditingQuest({ ...editingQuest, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">แต้มรางวัล (+)</label>
                  <input
                    type="number"
                    min="1"
                    value={editingQuest.points}
                    onChange={e => setEditingQuest({ ...editingQuest, points: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">ป้ายกำกับ</label>
                  <input
                    type="text"
                    value={editingQuest.badge}
                    onChange={e => setEditingQuest({ ...editingQuest, badge: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingQuest(null)}
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
    </div>
  );
}
