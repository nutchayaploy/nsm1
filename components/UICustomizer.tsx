'use client';

import React, { useState } from 'react';
import { Palette, Bell, Award, Check, Sparkles, RefreshCw } from 'lucide-react';
import { SystemConfig, StageThreshold } from '../lib/types';
import { DEFAULT_STAGES } from '../lib/mockData';

interface UICustomizerProps {
  config: SystemConfig;
  onSaveConfig: (newConfig: SystemConfig) => void;
}

const COLOR_PRESETS = [
  { name: 'Sky Blue (ฟ้าสดใส อพวช.)', hex: '#0284c7', bg: 'bg-sky-600' },
  { name: 'Cyan Horizon (ฟ้าครามอมเขียว)', hex: '#06b6d4', bg: 'bg-cyan-500' },
  { name: 'Science Blue (น้ำเงินวิทยาศาสตร์)', hex: '#2563eb', bg: 'bg-blue-600' },
  { name: 'Emerald Lab (เขียวมรกตวิจัย)', hex: '#10b981', bg: 'bg-emerald-500' },
  { name: 'Solar Amber (ส้มอำพันสุริยะ)', hex: '#f59e0b', bg: 'bg-amber-500' },
];

export default function UICustomizer({ config, onSaveConfig }: UICustomizerProps) {
  const [themeColor, setThemeColor] = useState(config.themeColor);
  const [museumName, setMuseumName] = useState(config.museumName);
  const [announcement, setAnnouncement] = useState(config.announcement);
  const [announcementActive, setAnnouncementActive] = useState(config.announcementActive);
  const [stages, setStages] = useState<StageThreshold[]>(config.stages || DEFAULT_STAGES);
  const [savedAlert, setSavedAlert] = useState(false);

  const handleStageChange = (index: number, field: keyof StageThreshold, value: unknown) => {
    const updated = [...stages];
    updated[index] = { ...updated[index], [field]: value };
    setStages(updated);
  };

  const handleResetStages = () => {
    if (confirm('ต้องการคืนค่าเกณฑ์วิวัฒนาการเป็นค่าเริ่มต้นหรือไม่?')) {
      setStages(DEFAULT_STAGES);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      ...config,
      themeColor,
      museumName,
      announcement,
      announcementActive,
      stages,
    });
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {savedAlert && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>บันทึกการปรับแต่ง UI/UX เรียบร้อยแล้ว!</span>
        </div>
      )}

      {/* 1. THEME COLOR PICKER */}
      <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Palette className="w-5 h-5 text-sky-600" />
          <h4 className="text-sm font-bold text-gray-800">ธีมสีหลักของระบบ (Primary Theme)</h4>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {COLOR_PRESETS.map(preset => (
            <button
              key={preset.hex}
              type="button"
              onClick={() => setThemeColor(preset.hex)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                themeColor === preset.hex
                  ? 'border-sky-500 bg-sky-50 shadow-sm'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className={`w-4 h-4 rounded-full ${preset.bg}`} />
              <span className="text-gray-700">{preset.name}</span>
              {themeColor === preset.hex && <Check className="w-3.5 h-3.5 text-sky-600 ml-auto" />}
            </button>
          ))}
        </div>
      </div>

      {/* 2. MUSEUM & ANNOUNCEMENT BANNER */}
      <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Bell className="w-5 h-5 text-sky-600" />
          <h4 className="text-sm font-bold text-gray-800">ชื่อระบบและข้อความประกาศ (Announcement Banner)</h4>
        </div>

        <div className="space-y-3 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">ชื่อหน่วยงาน / พิพิธภัณฑ์</label>
            <input
              type="text"
              value={museumName}
              onChange={e => setMuseumName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-600">ข้อความประกาศแถบหัวเว็บ</label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={announcementActive}
                  onChange={e => setAnnouncementActive(e.target.checked)}
                  className="rounded text-sky-600"
                />
                <span className="text-xs text-gray-600">เปิดแสดงแถบประกาศ</span>
              </label>
            </div>
            <input
              type="text"
              value={announcement}
              onChange={e => setAnnouncement(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
      </div>

      {/* 3. EVOLUTION THRESHOLDS & STAGE NAMES */}
      <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-sky-600" />
            <h4 className="text-sm font-bold text-gray-800">เกณฑ์คะแนนวิวัฒนาการไดโนเสาร์ 5 ระยะ (Evolution Thresholds)</h4>
          </div>
          <button
            type="button"
            onClick={handleResetStages}
            className="text-xs text-gray-500 hover:text-sky-600 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>คืนค่าเดิม</span>
          </button>
        </div>

        <div className="space-y-3">
          {stages.map((st, idx) => (
            <div key={st.stage} className="p-3.5 bg-sky-50/40 rounded-2xl border border-sky-100 flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs">
              <div className="w-8 h-8 rounded-xl bg-white border border-sky-200 flex items-center justify-center font-bold text-sky-700 shadow-sm shrink-0">
                {idx + 1}
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                <div>
                  <label className="block text-[10px] text-gray-500 font-semibold mb-0.5">ชื่อระยะ</label>
                  <input
                    type="text"
                    value={st.nameTh}
                    onChange={e => handleStageChange(idx, 'nameTh', e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 font-semibold mb-0.5">แต้มขั้นต่ำ (Min Points)</label>
                  <input
                    type="number"
                    min="0"
                    value={st.minPoints}
                    onChange={e => handleStageChange(idx, 'minPoints', Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg bg-white font-bold text-sky-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 font-semibold mb-0.5">ไอเทมประจำตัว</label>
                  <input
                    type="text"
                    value={st.item}
                    onChange={e => handleStageChange(idx, 'item', e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg bg-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow transition"
        >
          บันทึกการตั้งค่าทั้งหมด
        </button>
      </div>
    </form>
  );
}
