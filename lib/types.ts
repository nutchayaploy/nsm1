export type DinoStageId = 'egg' | 'hatching' | 'baby' | 'growing' | 'adult';

export type DinoSpecies = 'trex' | 'triceratops' | 'brachio';

export interface StageThreshold {
  stage: DinoStageId;
  name: string;
  nameTh: string;
  minPoints: number;
  maxPoints: number;
  description: string;
  badge: string;
  item: string;
  accentColor: string;
}

export interface Member {
  memberId: string;
  fullName: string;
  phone: string;
  points: number;
  dinoSpecies?: DinoSpecies;
  dinoName?: string;
  joinDate: string;
  avatar?: string;
  completedQuests?: string[];
}

export type QuestCategory = 'exhibition' | 'workshop' | 'quiz' | 'shop' | 'special';

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: QuestCategory;
  points: number;
  icon: string;
  badge: string;
  quizQuestion?: string;
  quizOptions?: string[];
  quizCorrectIndex?: number;
  active: boolean;
}

export interface PointTransaction {
  id: string;
  memberId: string;
  amount: number;
  type: 'earn' | 'redeem' | 'admin_adjust';
  reason: string;
  timestamp: string;
}

export interface SystemConfig {
  museumName: string;
  themeColor: string;
  announcement: string;
  announcementActive: boolean;
  googleSheetsUrl: string;
  lastSyncedAt?: string;
  stages: StageThreshold[];
}
