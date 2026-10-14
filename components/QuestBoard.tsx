'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Award, Sparkles, HelpCircle, ArrowRight, Check, MapPin, Tag } from 'lucide-react';
import { Quest, Member, QuestCategory } from '../lib/types';
import { sounds } from '../lib/sound';

interface QuestBoardProps {
  member: Member;
  quests: Quest[];
  onCompleteQuest: (quest: Quest) => void;
}

export default function QuestBoard({ member, quests, onCompleteQuest }: QuestBoardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeQuizQuest, setActiveQuizQuest] = useState<Quest | null>(null);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const completedQuestIds = member.completedQuests || [];

  const categories: { id: string; label: string; icon: string }[] = [
    { id: 'all', label: 'ทั้งหมด', icon: '🌟' },
    { id: 'exhibition', label: 'ชมนิทรรศการ', icon: '🦕' },
    { id: 'workshop', label: 'เวิร์กช็อป', icon: '🔬' },
    { id: 'quiz', label: 'ตอบคำถามวิทย์', icon: '🧠' },
    { id: 'shop', label: 'ของที่ระลึก', icon: '🛍️' },
    { id: 'special', label: 'พิเศษ', icon: '✨' },
  ];

  const filteredQuests = quests.filter(q => {
    if (!q.active) return false;
    if (selectedCategory === 'all') return true;
    return q.category === selectedCategory;
  });

  const handleQuestClick = (quest: Quest) => {
    if (completedQuestIds.includes(quest.id)) return;

    if (quest.category === 'quiz' && quest.quizQuestion) {
      setActiveQuizQuest(quest);
      setQuizSelectedOption(null);
      setQuizResult('idle');
    } else {
      // Direct completion / check-in
      sounds.playCoin();
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.6 },
      });
      onCompleteQuest(quest);
    }
  };

  const handleQuizAnswer = () => {
    if (!activeQuizQuest || quizSelectedOption === null) return;

    const isCorrect = quizSelectedOption === (activeQuizQuest.quizCorrectIndex ?? 0);
    if (isCorrect) {
      setQuizResult('correct');
      sounds.playLevelUp();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.5 },
      });
      setTimeout(() => {
        onCompleteQuest(activeQuizQuest);
        setActiveQuizQuest(null);
      }, 1500);
    } else {
      setQuizResult('wrong');
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Award className="w-5 h-5 text-sky-600" />
            <span>ภารกิจสะสมแต้ม NSM (Quests)</span>
          </h3>
          <p className="text-xs text-gray-500">
            พิชิตภารกิจวิทยาศาสตร์เพื่อรับแต้มและช่วยน้องไดโนเสาร์เติบโต
          </p>
        </div>
        <div className="text-xs bg-sky-50 text-sky-700 font-semibold px-3 py-1 rounded-full border border-sky-100 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          สำเร็จแล้ว: {completedQuestIds.length}/{quests.length} ภารกิจ
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-4">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
              selectedCategory === c.id
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-sky-50 border border-gray-100'
            }`}
          >
            <span>{c.icon}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Quests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredQuests.map(quest => {
          const isDone = completedQuestIds.includes(quest.id);

          return (
            <div
              key={quest.id}
              className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                isDone
                  ? 'bg-slate-50 border-gray-200 opacity-70'
                  : 'bg-white hover:bg-sky-50/40 border-sky-100 shadow-sm hover:shadow-md hover:border-sky-300'
              }`}
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl p-2 rounded-xl bg-sky-50 border border-sky-100">{quest.icon}</span>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 leading-snug">{quest.title}</h4>
                      <span className="inline-block text-[10px] font-medium text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md mt-0.5">
                        {quest.badge}
                      </span>
                    </div>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <span className="text-sm font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                      +{quest.points} แต้ม
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 mt-1 mb-3">
                  {quest.description}
                </p>
              </div>

              <div className="flex justify-end items-center pt-2 border-t border-gray-50">
                {isDone ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                    <CheckCircle2 className="w-4 h-4" />
                    สำเร็จแล้ว
                  </span>
                ) : (
                  <button
                    onClick={() => handleQuestClick(quest)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition transform active:scale-95"
                  >
                    <span>{quest.category === 'quiz' ? 'ตอบคำถามรับแต้ม' : 'เช็คอินรับแต้ม'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredQuests.length === 0 && (
        <div className="text-center py-8 text-gray-400 text-sm bg-white rounded-2xl border border-dashed border-gray-200">
          ไม่มีภารกิจในหมวดหมู่นี้
        </div>
      )}

      {/* QUIZ MODAL */}
      {activeQuizQuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-sky-100 relative">
            <div className="text-center mb-4">
              <span className="text-4xl inline-block mb-1">🧠</span>
              <h3 className="text-base font-bold text-gray-800">{activeQuizQuest.title}</h3>
              <p className="text-xs text-amber-600 font-semibold mt-1">
                ตอบถูกรับทันที +{activeQuizQuest.points} แต้ม!
              </p>
            </div>

            <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-100 mb-4 text-xs font-medium text-gray-800 leading-relaxed">
              {activeQuizQuest.quizQuestion}
            </div>

            {/* Quiz Options */}
            <div className="space-y-2 mb-4">
              {activeQuizQuest.quizOptions?.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuizSelectedOption(idx);
                    setQuizResult('idle');
                  }}
                  className={`w-full text-left p-3 rounded-xl text-xs font-medium transition border flex items-center justify-between ${
                    quizSelectedOption === idx
                      ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-sky-50/50 border-gray-200'
                  }`}
                >
                  <span>{opt}</span>
                  {quizSelectedOption === idx && <Check className="w-4 h-4 shrink-0" />}
                </button>
              ))}
            </div>

            {/* Quiz Result Alerts */}
            {quizResult === 'correct' && (
              <div className="mb-4 p-2.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 text-center flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-500 animate-spin" />
                ถูกต้องยอดเยี่ยม! รับแต้มและกำลังอัปเกรดน้องไดโนเสาร์...
              </div>
            )}
            {quizResult === 'wrong' && (
              <div className="mb-4 p-2.5 bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 text-center">
                ยังไม่ถูกต้อง ลองตอบใหม่อีกครั้งนะ!
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setActiveQuizQuest(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
              >
                ไว้คราวหลัง
              </button>
              <button
                disabled={quizSelectedOption === null || quizResult === 'correct'}
                onClick={handleQuizAnswer}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white disabled:opacity-50 transition shadow-sm"
              >
                ส่งคำตอบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
