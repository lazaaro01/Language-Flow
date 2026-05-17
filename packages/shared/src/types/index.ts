export type LevelName = 'Beginner' | 'Elementary' | 'Intermediate' | 'Advanced' | 'Fluent';

export interface Level {
  id: string;
  name: LevelName;
  minXp: number;
  maxXp: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  level: Level;
  currentXp: number;
  totalXp: number;
  streak: number;
  lastActivityDate: string;
  dailyGoalMinutes: number;
  createdAt: string;
}

export interface ExerciseType {
  id: string;
  lessonId: string;
  type: 'multiple-choice' | 'fill-blank' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string;
  order: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  levelId: string;
  module: 'grammar' | 'vocabulary' | 'listening' | 'speaking' | 'writing';
  order: number;
  exercises: ExerciseType[];
}

export interface Flashcard {
  id: string;
  word: string;
  definition: string;
  exampleSentence: string;
  difficulty: 'easy' | 'medium' | 'hard';
  nextReview: string;
  lastReviewed?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}
