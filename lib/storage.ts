import { Member, Quest, SystemConfig, PointTransaction, StageThreshold, DinoStageId } from './types';
import { INITIAL_MEMBERS, INITIAL_QUESTS, INITIAL_CONFIG, INITIAL_TRANSACTIONS, DEFAULT_STAGES } from './mockData';

const STORAGE_KEYS = {
  MEMBERS: 'nsm_members',
  CURRENT_MEMBER_ID: 'nsm_current_member_id',
  IS_ADMIN: 'nsm_is_admin',
  QUESTS: 'nsm_quests',
  CONFIG: 'nsm_config',
  TRANSACTIONS: 'nsm_transactions',
};

// SSR Safe LocalStorage Getters & Setters
export function getStoredMembers(): Member[] {
  if (typeof window === 'undefined') return INITIAL_MEMBERS;
  try {
    const item = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    return item ? JSON.parse(item) : INITIAL_MEMBERS;
  } catch {
    return INITIAL_MEMBERS;
  }
}

export function saveMembers(members: Member[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  } catch {
    // ignore
  }
}

export function getStoredQuests(): Quest[] {
  if (typeof window === 'undefined') return INITIAL_QUESTS;
  try {
    const item = localStorage.getItem(STORAGE_KEYS.QUESTS);
    return item ? JSON.parse(item) : INITIAL_QUESTS;
  } catch {
    return INITIAL_QUESTS;
  }
}

export function saveQuests(quests: Quest[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests));
  } catch {
    // ignore
  }
}

export function getStoredConfig(): SystemConfig {
  if (typeof window === 'undefined') return INITIAL_CONFIG;
  try {
    const item = localStorage.getItem(STORAGE_KEYS.CONFIG);
    return item ? JSON.parse(item) : INITIAL_CONFIG;
  } catch {
    return INITIAL_CONFIG;
  }
}

export function saveConfig(config: SystemConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  } catch {
    // ignore
  }
}

export function getStoredTransactions(): PointTransaction[] {
  if (typeof window === 'undefined') return INITIAL_TRANSACTIONS;
  try {
    const item = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return item ? JSON.parse(item) : INITIAL_TRANSACTIONS;
  } catch {
    return INITIAL_TRANSACTIONS;
  }
}

export function saveTransactions(transactions: PointTransaction[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch {
    // ignore
  }
}

export function getSavedMemberId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.CURRENT_MEMBER_ID);
}

export function saveMemberId(id: string | null): void {
  if (typeof window === 'undefined') return;
  if (id) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_MEMBER_ID, id);
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_MEMBER_ID);
  }
}

export function getSavedIsAdmin(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEYS.IS_ADMIN) === 'true';
}

export function saveIsAdmin(isAdmin: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.IS_ADMIN, isAdmin ? 'true' : 'false');
}

// Stage Calculation Helper
export function getStageForPoints(points: number, customStages?: StageThreshold[]): {
  stage: StageThreshold;
  stageIndex: number;
  nextStage: StageThreshold | null;
  progressPercent: number;
  pointsToNext: number;
} {
  const stages = customStages && customStages.length === 5 ? customStages : DEFAULT_STAGES;
  let currentStage = stages[0];
  let stageIndex = 0;

  for (let i = stages.length - 1; i >= 0; i--) {
    if (points >= stages[i].minPoints) {
      currentStage = stages[i];
      stageIndex = i;
      break;
    }
  }

  const nextStage = stageIndex < stages.length - 1 ? stages[stageIndex + 1] : null;

  let progressPercent = 100;
  let pointsToNext = 0;

  if (nextStage) {
    const currentMin = currentStage.minPoints;
    const targetMin = nextStage.minPoints;
    const span = targetMin - currentMin;
    const earned = Math.max(0, points - currentMin);
    progressPercent = Math.min(100, Math.round((earned / span) * 100));
    pointsToNext = Math.max(0, targetMin - points);
  }

  return {
    stage: currentStage,
    stageIndex,
    nextStage,
    progressPercent,
    pointsToNext,
  };
}
