import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function getLevelColor(levelName: string) {
  const colors: Record<string, string> = {
    Beginner: 'text-green-400',
    Elementary: 'text-blue-400',
    Intermediate: 'text-yellow-400',
    Advanced: 'text-orange-400',
    Fluent: 'text-purple-400',
  };
  return colors[levelName] || 'text-muted-foreground';
}

export function getLevelProgress(currentXp: number, minXp: number, maxXp: number) {
  if (maxXp === Infinity) return 100;
  return Math.min(100, ((currentXp - minXp) / (maxXp - minXp)) * 100);
}
