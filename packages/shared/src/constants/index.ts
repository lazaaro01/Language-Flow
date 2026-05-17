export const XP_REWARDS = {
  EXERCISE_COMPLETE: 10,
  LESSON_COMPLETE: 50,
  CONVERSATION_MESSAGE: 5,
  FLASHCARD_REVIEW: 3,
  STREAK_BONUS: 20,
  DAILY_GOAL_COMPLETE: 100,
  ACHIEVEMENT_UNLOCK: 200,
} as const;

export const STREAK_MILESTONES = [3, 7, 14, 30, 60, 90, 180, 365] as const;

export const LEVELS = [
  { name: 'Beginner', minXp: 0, maxXp: 1000 },
  { name: 'Elementary', minXp: 1000, maxXp: 3000 },
  { name: 'Intermediate', minXp: 3000, maxXp: 7000 },
  { name: 'Advanced', minXp: 7000, maxXp: 15000 },
  { name: 'Fluent', minXp: 15000, maxXp: Infinity },
] as const;

export const DAILY_GOAL_OPTIONS = [15, 30, 60] as const;

export const GRAMMAR_TOPICS = [
  'Verb To Be',
  'Present Simple',
  'Past Simple',
  'Future',
  'Conditionals',
  'Phrasal Verbs',
  'Present Continuous',
  'Present Perfect',
  'Modal Verbs',
  'Passive Voice',
] as const;

export const VOCABULARY_CATEGORIES = [
  'Work',
  'Technology',
  'Travel',
  'Business',
  'Daily Life',
  'Movies',
  'Food',
  'Health',
  'Education',
  'Nature',
] as const;
