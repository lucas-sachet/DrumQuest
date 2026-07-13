export interface Exercise {
  id: string;
  title: string;
  description: string;
  bpmDefault: number;
  rhythmPattern: string; // E.g., "1 e & a 2 e & a" or "R L R R L R L L"
  durationSeconds: number;
  drumPattern: number[]; // binary array representing hits (e.g. [1,0,0,0,1,0,0,0]) for interactive visual metronome
}

export interface Lesson {
  id: string;
  title: string;
  moduleId: string;
  moduleName: string;
  difficulty: "Iniciante" | "Intermediário" | "Avançado";
  xpReward: number;
  timeSeconds: number;
  description: string;
  objective: string;
  whatYouLearn: string[];
  exercises: Exercise[];
  commonMistakes: string[];
  tips: string[];
}

export interface Module {
  id: string;
  name: string;
  difficulty: "Iniciante" | "Intermediário" | "Avançado";
  xpReward: number;
  timeEstimate: string;
  status: "locked" | "available" | "completed";
  lessons: Lesson[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  rarity: "Comum" | "Raro" | "Épico" | "Lendário";
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  xpReward: number;
  icon: string;
}

export interface SkillNode {
  id: string;
  name: string;
  category: "Tempo" | "Coordenação" | "Rudimentos" | "Grooves" | "Independência" | "Dinâmica" | "Leitura" | "Técnica";
  level: number;
  maxLevel: number;
  description: string;
  dependencies: string[]; // ids of dependent skills
  isUnlocked: boolean;
  xpCost: number;
}

export interface PracticeHistory {
  date: string; // YYYY-MM-DD
  minutes: number;
  bpm: number;
  accuracy: number;
  completedCount: number;
}

export interface UserProfile {
  name: string;
  title: string;
  level: number;
  xp: number;
  xpNextLevel: number;
  streakDays: number;
  totalPracticeHours: number;
  totalExercisesCompleted: number;
  lastPracticeDate?: string;
  badges: Badge[];
  achievements: Achievement[];
  skills: SkillNode[];
  history: PracticeHistory[];
  modules: Module[];
}
