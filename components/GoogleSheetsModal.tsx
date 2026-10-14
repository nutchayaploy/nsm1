'use client';

import React, { useState } from 'react';
import { Sheet, RefreshCw, Check, AlertCircle, Copy, ExternalLink, Download, Code } from 'lucide-react';
import { Member } from '../lib/types';
import { fetchGoogleSheetMembers, GOOGLE_APPS_SCRIPT_TEMPLATE } from '../lib/googleSheets';

interface GoogleSheetsModalProps {
  currentUrl: string;
  members: Member[];
  onClose: () => void;
  onSyncSuccess: (newMembers: Member[], url: string) => void;
}

export default function GoogleSheetsModal({
  currentUrl,
  members,
  onClose,
  onSyncSuccess,
}: GoogleSheetsModalProps) {
  const [sheetUrl, setSheetUrl] = useState(currentUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showScript, setShowScript] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const handleSync = async () => {
    if (!sheetUrl.trim()) {
      setStatusMessage({ type: 'error', text: 'กรุณากรอกลิงก์ Google Sheets' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    const result = await fetchGoogleSheetMembers(sheetUrl);

    setIsLoading(false);
    if (result.success && result.members) {
      setStatusMessage({
        type: 'success',
        text: `ดึงข้อมูลสำเร็จ! พบสมาชิกทั้งหมด ${result.members.length} รายชื่อ`,
      });
      onSyncSuccess(result.members, sheetUrl);
    } else {
      setStatusMessage({
        type: 'error',
        text: result.error || 'เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาตรวจสอบลิงก์และการแชร์ชีต',
      });
    }
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_TEMPLATE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleExportCsv = () => {
    const headers = ['memberId', 'fullName', 'phone', 'points', 'dinoSpecies', 'joinDate'];
    const rows = members.map(m => [
      m.memberId,
      `"${m.fullName}"`,
      `"${m.phone}"`,
      m.points,
      m.dinoSpecies || 'trex',
      m.joinDate,
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `nsm_members_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-sky-100 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Sheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800">เชื่อมต่อ Google Sheets แบบ Real-time</h3>
              <p className="text-xs text-gray-500">ซิงค์รายชื่อสมาชิกและแต้มจาก Google Sheets ทันที</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* Input Sheet URL */}
        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              ลิงก์ Google Sheets (แชร์แบบ Anyone with link can view หรือ Publish to web)
            </label>
            <input
              type="url"
              placeholder="https://docs.google.com/spreadsheets/d/.../edit"
              value={sheetUrl}
              onChange={e => setSheetUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500 font-mono text-gray-800"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              * วางลิงก์ Google Sheets แบบปกติได้เลย ระบบจะแปลงเป็น CSV Export ให้อัตโนมัติ
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSync}
              disabled={isLoading}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'กำลังซิงค์ข้อมูล...' : 'ซิงค์ข้อมูลเดี๋ยวนี้ (Sync Now)'}</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-medium transition"
              title="ส่งออกรายชื่อเป็นไฟล์ CSV"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 mb-4 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Expected Columns Guide */}
        <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-100 mb-4 text-xs">
          <h4 className="font-bold text-sky-900 mb-2">โครงสร้างคอลัมน์ใน Google Sheets ที่รองรับ:</h4>
          <div className="grid grid-cols-2 gap-1.5 text-gray-600">
            <div>• <code className="bg-white px-1.5 py-0.5 rounded border text-sky-700 font-mono">รหัสสมาชิก</code> (memberId)</div>
            <div>• <code className="bg-white px-1.5 py-0.5 rounded border text-sky-700 font-mono">ชื่อ-นามสกุล</code> (fullName)</div>
            <div>• <code className="bg-white px-1.5 py-0.5 rounded border text-sky-700 font-mono">เบอร์โทร</code> (phone)</div>
            <div>• <code className="bg-white px-1.5 py-0.5 rounded border text-sky-700 font-mono">แต้มสะสม</code> (points)</div>
            <div>• <code className="bg-white px-1.5 py-0.5 rounded border text-sky-700 font-mono">สถานะไดโนเสาร์</code> (dinoSpecies)</div>
            <div>• <code className="bg-white px-1.5 py-0.5 rounded border text-sky-700 font-mono">วันที่สมัคร</code> (joinDate)</div>
          </div>
        </div>

        {/* Google Apps Script 2-Way Sync Helper */}
        <div className="border-t border-gray-100 pt-3">
          <button
            type="button"
            onClick={() => setShowScript(!showScript)}
            className="w-full flex items-center justify-between text-xs text-gray-600 hover:text-sky-700 font-semibold"
          >
            <span className="flex items-center gap-1.5">
              <Code className="w-4 h-4 text-sky-600" />
              <span>ต้องการซิงค์สองทางอัตโนมัติ (Google Apps Script API)?</span>
            </span>
            <span className="text-sky-600">{showScript ? 'ซ่อน' : 'ดูโค้ด'}</span>
          </button>

          {showScript && (
            <div className="mt-3 space-y-2">
              <div className="flex justify-between items-center text-[11px] text-gray-500">
                <span>คัดลอกโค้ดนี้ไปวางใน Google Apps Script:</span>
                <button
                  type="button"
                  onClick={handleCopyScript}
                  className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-800 font-semibold"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedScript ? 'คัดลอกแล้ว!' : 'คัดลอกโค้ด'}</span>
                </button>
              </div>
              <pre className="p-3 bg-gray-900 text-gray-100 rounded-xl text-[10px] font-mono overflow-x-auto max-h-40 leading-relaxed">
                {GOOGLE_APPS_SCRIPT_TEMPLATE}
              </pre>
            </div>
          )}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}
