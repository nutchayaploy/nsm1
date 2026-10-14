'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, Zap, Award, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { StageThreshold, DinoSpecies } from '../lib/types';
import { sounds } from '../lib/sound';

interface DinoPetProps {
  points: number;
  stageInfo: {
    stage: StageThreshold;
    stageIndex: number;
    nextStage: StageThreshold | null;
    progressPercent: number;
    pointsToNext: number;
  };
  species?: DinoSpecies;
  dinoName?: string;
  onInteracted?: () => void;
}

export default function DinoPet({
  points,
  stageInfo,
  species = 'trex',
  dinoName = 'น้องไดโน NSM',
  onInteracted,
}: DinoPetProps) {
  const [isInteracting, setIsInteracting] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [floatingTexts, setFloatingTexts] = useState<{ id: number; text: string; x: number; y: number }[]>([]);
  const [speechBubble, setSpeechBubble] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const { stage, stageIndex, nextStage, progressPercent, pointsToNext } = stageInfo;

  // Sound toggle
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
  };

  // Trigger celebration on initial load or evolution if high stage
  useEffect(() => {
    if (stage.stage === 'adult') {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0284c7', '#38bdf8', '#fbbf24', '#10b981'],
      });
    }
  }, [stage.stage]);

  // Handle tap / click on dino
  const handlePetClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsInteracting(true);
    setTapCount(prev => prev + 1);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let reactionText = '💖 เลิฟๆ';
    let bubble = '';

    if (stage.stage === 'egg') {
      sounds.playPop();
      reactionText = '🥚 ดุ๊กดิ๊ก~';
      bubble = 'กุกกัก... ข้างในกำลังโตนะ!';
    } else if (stage.stage === 'hatching') {
      sounds.playCrack();
      reactionText = '✨ เปรี๊ยะ!';
      bubble = 'ใกล้แล้ว! จะออกมาทักทายแล้วนะ!';
    } else if (stage.stage === 'baby') {
      sounds.playChirp();
      reactionText = '🐣 จิ๊บๆ น่ารัก!';
      bubble = 'สวัสดีฮะ! ผมเพิ่งเกิดใหม่ฮะ!';
    } else if (stage.stage === 'growing') {
      sounds.playHappyRoar();
      reactionText = '🦖 โฮกสดใส!';
      bubble = 'พร้อมลุยพิพิธภัณฑ์ NSM แล้ว!';
    } else {
      sounds.playLevelUp();
      reactionText = '🏆 สุดยอดนักวิทย์!';
      bubble = 'ยินดีด้วย! คุณคือด็อกเตอร์ไดโนเสาร์ NSM!';
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.5 },
      });
    }

    setSpeechBubble(bubble);

    // Floating text particle
    const newId = Date.now();
    setFloatingTexts(prev => [...prev.slice(-4), { id: newId, text: reactionText, x, y }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(item => item.id !== newId));
    }, 1200);

    setTimeout(() => {
      setIsInteracting(false);
    }, 600);

    onInteracted?.();
  };

  return (
    <div className="relative flex flex-col items-center w-full max-w-lg mx-auto">
      {/* Sound Toggle Button */}
      <div className="absolute top-2 right-2 z-20">
        <button
          onClick={toggleSound}
          className="p-2 rounded-full bg-white/80 hover:bg-white text-sky-600 shadow-sm transition hover:scale-110"
          title={soundEnabled ? 'ปิดเสียง' : 'เปิดเสียง'}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
        </button>
      </div>

      {/* Stage Badge & Title */}
      <div className="text-center mb-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold shadow-sm mb-1.5 bg-gradient-to-r from-sky-500 to-cyan-500 text-white">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>ระดับที่ {stageIndex + 1}/5 : {stage.nameTh}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 flex items-center justify-center gap-1.5">
          <span>{dinoName}</span>
          <span className="text-sm font-normal text-sky-600 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-100">
            {stage.badge}
          </span>
        </h3>
      </div>

      {/* Speech Bubble */}
      {speechBubble && (
        <div className="relative z-20 mb-2 px-4 py-2 bg-white rounded-2xl shadow-md border border-sky-200 text-sky-800 text-sm font-medium animate-bounce text-center">
          {speechBubble}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white" />
        </div>
      )}

      {/* Dinosaur / Egg Interactive Stage Canvas */}
      <div
        onClick={handlePetClick}
        className={`relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center cursor-pointer select-none transition-transform duration-300 rounded-3xl p-4 bg-gradient-to-b from-sky-50/80 to-white/90 shadow-xl shadow-sky-100/70 border border-sky-100 group ${
          isInteracting ? 'scale-105' : 'hover:scale-[1.02]'
        }`}
      >
        {/* Ambient Glow */}
        <div
          className="absolute inset-0 rounded-3xl opacity-30 filter blur-xl transition-all"
          style={{ backgroundColor: stage.accentColor }}
        />

        {/* Floating Click Particles */}
        {floatingTexts.map(f => (
          <span
            key={f.id}
            style={{ left: f.x, top: f.y }}
            className="absolute z-30 pointer-events-none text-xs sm:text-sm font-bold text-sky-600 bg-white/90 px-2.5 py-1 rounded-full shadow-md animate-float -translate-x-1/2 -translate-y-6"
          >
            {f.text}
          </span>
        ))}

        {/* STAGE 1: EGG */}
        {stage.stage === 'egg' && (
          <div className={`relative flex flex-col items-center ${isInteracting ? 'animate-shake' : 'animate-wobble'}`}>
            <svg viewBox="0 0 200 240" className="w-52 h-60 drop-shadow-lg">
              {/* Egg Base Shadow */}
              <ellipse cx="100" cy="225" rx="55" ry="12" fill="#bae6fd" opacity="0.6" />
              {/* Egg Body */}
              <defs>
                <radialGradient id="eggGrad" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="60%" stopColor="#bae6fd" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </radialGradient>
              </defs>
              <path
                d="M100,20 C145,20 175,90 175,160 C175,205 140,220 100,220 C60,220 25,205 25,160 C25,90 55,20 100,20 Z"
                fill="url(#eggGrad)"
                stroke="#0284c7"
                strokeWidth="4"
              />
              {/* Spots */}
              <ellipse cx="75" cy="90" rx="14" ry="10" fill="#0284c7" opacity="0.35" transform="rotate(-15 75 90)" />
              <ellipse cx="125" cy="130" rx="18" ry="12" fill="#0284c7" opacity="0.35" transform="rotate(20 125 130)" />
              <ellipse cx="70" cy="165" rx="16" ry="11" fill="#0284c7" opacity="0.3" transform="rotate(-10 70 165)" />
              <ellipse cx="120" cy="70" rx="12" ry="8" fill="#0284c7" opacity="0.25" />
              {/* Cute Highlight */}
              <path d="M55,60 Q70,40 90,35" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.8" />
            </svg>
            <span className="text-xs text-sky-700 bg-sky-100/90 px-3 py-1 rounded-full font-medium mt-1">
              แตะฟองไข่เพื่อฟังเสียงดุ๊กดิ๊ก 👆
            </span>
          </div>
        )}

        {/* STAGE 2: HATCHING */}
        {stage.stage === 'hatching' && (
          <div className={`relative flex flex-col items-center ${isInteracting ? 'animate-shake' : 'animate-float'}`}>
            <svg viewBox="0 0 200 240" className="w-52 h-60 drop-shadow-xl">
              <ellipse cx="100" cy="225" rx="55" ry="12" fill="#bae6fd" opacity="0.6" />
              {/* Cracking Egg Body */}
              <defs>
                <radialGradient id="hatchGrad" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="60%" stopColor="#a5f3fc" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </radialGradient>
              </defs>
              <path
                d="M100,20 C145,20 175,90 175,160 C175,205 140,220 100,220 C60,220 25,205 25,160 C25,90 55,20 100,20 Z"
                fill="url(#hatchGrad)"
                stroke="#0891b2"
                strokeWidth="4"
              />
              {/* Cracks with glowing yellow light */}
              <path
                d="M70,110 L95,125 L85,145 L115,160 L105,185"
                stroke="#fbbf24"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                className="animate-pulse"
              />
              <path
                d="M70,110 L95,125 L85,145 L115,160 L105,185"
                stroke="#0e7490"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M95,125 L130,115 L145,135"
                stroke="#fbbf24"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                className="animate-pulse"
              />
              {/* Glowing peek holes */}
              <circle cx="100" cy="140" r="10" fill="#fef08a" opacity="0.9" filter="blur(2px)" />
              {/* Sparkles */}
              <circle cx="120" cy="100" r="4" fill="#fbbf24" className="animate-ping" />
              <circle cx="80" cy="160" r="3" fill="#fbbf24" className="animate-ping" />
            </svg>
            <span className="text-xs text-cyan-800 bg-cyan-100/90 px-3 py-1 rounded-full font-medium mt-1">
              เปลือกเริ่มแตกแล้ว! แตะเพื่อส่งพลัง ✨
            </span>
          </div>
        )}

        {/* STAGE 3: BABY DINO */}
        {stage.stage === 'baby' && (
          <div className={`relative flex flex-col items-center ${isInteracting ? 'animate-bounceCute' : 'animate-float'}`}>
            <svg viewBox="0 0 220 240" className="w-56 h-64 drop-shadow-xl">
              <ellipse cx="110" cy="225" rx="60" ry="12" fill="#bae6fd" opacity="0.6" />
              {/* Bottom Egg Shell */}
              <path
                d="M45,150 L65,135 L85,150 L110,130 L135,150 L155,135 L175,150 C175,200 145,220 110,220 C75,220 45,200 45,150 Z"
                fill="#ffffff"
                stroke="#0284c7"
                strokeWidth="3.5"
              />
              {/* Baby Dino Body */}
              <ellipse cx="110" cy="115" rx="42" ry="48" fill="#34d399" stroke="#059669" strokeWidth="3.5" />
              {/* Cute Cheek blush */}
              <circle cx="85" cy="125" r="7" fill="#fb7185" opacity="0.7" />
              <circle cx="135" cy="125" r="7" fill="#fb7185" opacity="0.7" />
              {/* Cute Big Eyes */}
              <ellipse cx="90" cy="105" rx="8" ry="11" fill="#1e293b" />
              <circle cx="88" cy="102" r="3.5" fill="#ffffff" />
              <ellipse cx="130" cy="105" rx="8" ry="11" fill="#1e293b" />
              <circle cx="128" cy="102" r="3.5" fill="#ffffff" />
              {/* Smile */}
              <path d="M102,122 Q110,132 118,122" stroke="#065f46" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Little cute horns/crests */}
              <path d="M85,75 Q90,60 95,73" fill="#10b981" stroke="#059669" strokeWidth="2.5" />
              <path d="M105,72 Q110,55 115,72" fill="#10b981" stroke="#059669" strokeWidth="2.5" />
              <path d="M125,75 Q130,60 135,73" fill="#10b981" stroke="#059669" strokeWidth="2.5" />
              {/* Cute little hands holding egg edge */}
              <ellipse cx="68" cy="145" rx="7" ry="5" fill="#34d399" stroke="#059669" strokeWidth="2.5" />
              <ellipse cx="152" cy="145" rx="7" ry="5" fill="#34d399" stroke="#059669" strokeWidth="2.5" />
            </svg>
            <span className="text-xs text-emerald-800 bg-emerald-100/90 px-3 py-1 rounded-full font-medium mt-1">
              เบบี้ไดโนเสาร์น่ารัก แตะเพื่อลูบหัว 🦖💕
            </span>
          </div>
        )}

        {/* STAGE 4: GROWING DINO */}
        {stage.stage === 'growing' && (
          <div className={`relative flex flex-col items-center ${isInteracting ? 'animate-bounceCute' : 'animate-float'}`}>
            <svg viewBox="0 0 240 250" className="w-60 h-64 drop-shadow-xl">
              <ellipse cx="120" cy="235" rx="70" ry="14" fill="#bae6fd" opacity="0.6" />
              {/* Tail */}
              <path d="M60,170 Q30,175 25,145 Q35,140 65,155 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="3.5" />
              {/* Dinosaur Body */}
              <ellipse cx="115" cy="165" rx="55" ry="50" fill="#38bdf8" stroke="#0284c7" strokeWidth="4" />
              {/* Dinosaur Head */}
              <circle cx="155" cy="105" r="42" fill="#38bdf8" stroke="#0284c7" strokeWidth="4" />
              {/* Snout */}
              <ellipse cx="185" cy="115" rx="24" ry="18" fill="#38bdf8" stroke="#0284c7" strokeWidth="4" />
              <circle cx="196" cy="110" r="2.5" fill="#0369a1" />
              {/* Eyes */}
              <ellipse cx="160" cy="95" rx="9" ry="12" fill="#0f172a" />
              <circle cx="158" cy="91" r="3.5" fill="#ffffff" />
              {/* Smile & tooth */}
              <path d="M172,122 Q185,130 198,120" stroke="#0369a1" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M182,125 L186,130 L190,125" fill="#ffffff" stroke="#0369a1" strokeWidth="1.5" />
              {/* Back Spikes */}
              <polygon points="105,115 115,95 125,115" fill="#f59e0b" stroke="#d97706" strokeWidth="2.5" />
              <polygon points="85,130 95,110 105,130" fill="#f59e0b" stroke="#d97706" strokeWidth="2.5" />
              <polygon points="65,150 75,130 85,150" fill="#f59e0b" stroke="#d97706" strokeWidth="2.5" />
              {/* NSM Explorer Satchel / Bag */}
              <rect x="95" y="155" width="36" height="30" rx="6" fill="#f59e0b" stroke="#b45309" strokeWidth="2.5" />
              <path d="M100,155 L113,170 L126,155" stroke="#b45309" strokeWidth="2" fill="none" />
              <circle cx="113" cy="170" r="3" fill="#ffffff" />
              {/* Hands & Feet */}
              <ellipse cx="140" cy="165" rx="8" ry="14" fill="#38bdf8" stroke="#0284c7" strokeWidth="3" transform="rotate(20 140 165)" />
              <ellipse cx="105" cy="210" rx="14" ry="10" fill="#0284c7" />
              <ellipse cx="145" cy="210" rx="14" ry="10" fill="#0284c7" />
            </svg>
            <span className="text-xs text-amber-800 bg-amber-100/90 px-3 py-1 rounded-full font-medium mt-1">
              วัยกำลังโตแข็งแรง แตะเพื่อเล่นด้วยกัน 🐾
            </span>
          </div>
        )}

        {/* STAGE 5: ADULT DINO SCIENTIST */}
        {stage.stage === 'adult' && (
          <div className={`relative flex flex-col items-center ${isInteracting ? 'animate-bounceCute' : 'animate-float'}`}>
            <svg viewBox="0 0 250 260" className="w-64 h-68 drop-shadow-2xl">
              {/* Golden Research Aura */}
              <circle cx="125" cy="130" r="100" fill="#fef08a" opacity="0.3" filter="blur(10px)" className="animate-pulseGlow" />
              <ellipse cx="125" cy="245" rx="75" ry="14" fill="#93c5fd" opacity="0.6" />
              {/* Tail */}
              <path d="M60,180 Q20,185 15,150 Q28,145 65,165 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="4" />
              {/* Dino Body */}
              <ellipse cx="120" cy="175" rx="58" ry="52" fill="#0284c7" stroke="#0369a1" strokeWidth="4" />
              {/* White Science Research Lab Coat */}
              <path
                d="M75,150 Q120,140 165,150 L168,220 L135,220 L120,175 L105,220 L72,220 Z"
                fill="#ffffff"
                stroke="#64748b"
                strokeWidth="3.5"
              />
              {/* NSM Lab Badge */}
              <rect x="85" y="170" width="16" height="12" rx="3" fill="#0284c7" />
              <text x="87" y="179" fontSize="7" fill="#ffffff" fontWeight="bold">NSM</text>
              {/* Dino Head */}
              <circle cx="165" cy="105" r="44" fill="#0284c7" stroke="#0369a1" strokeWidth="4" />
              {/* Snout */}
              <ellipse cx="198" cy="115" rx="26" ry="20" fill="#0284c7" stroke="#0369a1" strokeWidth="4" />
              <circle cx="210" cy="110" r="3" fill="#0c4a6e" />
              {/* Smart Eyes */}
              <ellipse cx="170" cy="95" rx="9" ry="12" fill="#0f172a" />
              <circle cx="168" cy="90" r="3.5" fill="#ffffff" />
              {/* Science Glasses / Goggles on forehead */}
              <circle cx="155" cy="78" r="13" fill="#e0f2fe" stroke="#d97706" strokeWidth="3.5" opacity="0.85" />
              <circle cx="180" cy="78" r="13" fill="#e0f2fe" stroke="#d97706" strokeWidth="3.5" opacity="0.85" />
              <line x1="168" y1="78" x2="167" y2="78" stroke="#d97706" strokeWidth="4" />
              {/* Test Tube in hand */}
              <rect x="180" y="150" width="10" height="26" rx="5" fill="#ec4899" stroke="#9d174d" strokeWidth="2.5" transform="rotate(15 180 150)" />
              {/* Spikes */}
              <polygon points="105,115 115,92 125,115" fill="#fbbf24" stroke="#d97706" strokeWidth="2.5" />
              <polygon points="85,130 95,108 105,130" fill="#fbbf24" stroke="#d97706" strokeWidth="2.5" />
              {/* Feet */}
              <ellipse cx="105" cy="225" rx="15" ry="10" fill="#0369a1" />
              <ellipse cx="145" cy="225" rx="15" ry="10" fill="#0369a1" />
            </svg>
            <span className="text-xs text-sky-900 bg-sky-100/90 px-3 py-1 rounded-full font-semibold mt-1 flex items-center gap-1 shadow-sm">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              ด็อกเตอร์ไดโนเสาร์ NSM เต็มวัย 🏆
            </span>
          </div>
        )}
      </div>

      {/* Tap Counter & Interaction Hint */}
      <div className="flex items-center justify-between w-full mt-3 px-2 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          ผูกพันกับน้อง: <strong className="text-gray-700">{tapCount} ครั้ง</strong>
        </span>
        <span className="text-sky-600 font-medium bg-sky-50 px-2 py-0.5 rounded-md">
          {stage.item}
        </span>
      </div>

      {/* Points & Evolution Progress Bar */}
      <div className="w-full mt-4 bg-white/95 rounded-2xl p-4 shadow-sm border border-sky-100">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-sm font-semibold text-gray-700">แต้มสะสมปัจจุบัน</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-sky-600 tracking-tight">{points.toLocaleString()}</span>
            <span className="text-xs text-gray-500 ml-1">แต้ม</span>
          </div>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-3.5 bg-sky-100 rounded-full overflow-hidden p-0.5 border border-sky-200">
          <div
            className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-sky-600 rounded-full transition-all duration-700 ease-out shadow-inner"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Next Stage Info */}
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <span>{stage.nameTh}</span>
          {nextStage ? (
            <span className="text-sky-700 font-medium">
              อีก <strong className="text-amber-600 font-bold">{pointsToNext} แต้ม</strong> สู่ &quot;{nextStage.nameTh}&quot; ({progressPercent}%)
            </span>
          ) : (
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              วิวัฒนาการขั้นสูงสุดแล้ว!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
