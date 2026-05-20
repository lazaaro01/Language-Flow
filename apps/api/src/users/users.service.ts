import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        level: true,
        streak: true,
        achievements: { include: { achievement: true } },
      },
    });
    if (!user) throw new NotFoundException('Usuario nao encontrado');
    return user;
  }

  async updateProfile(userId: string, data: { name?: string; avatarUrl?: string; dailyGoalMinutes?: number }) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      include: { level: true, streak: true },
    });
  }

  async getStats(userId: string) {
    const [lessonsCompleted, exercisesAttempted, exercisesCorrect, conversations, flashcardsReviewed] =
      await Promise.all([
        this.prisma.lessonProgress.count({ where: { userId, completed: true } }),
        this.prisma.exerciseAttempt.count({ where: { userId } }),
        this.prisma.exerciseAttempt.count({ where: { userId, correct: true } }),
        this.prisma.conversation.count({ where: { userId } }),
        this.prisma.flashcardReview.count({ where: { flashcard: { userId } } }),
      ]);

    return {
      lessonsCompleted,
      exercisesAttempted,
      exercisesCorrect,
      accuracy: exercisesAttempted > 0 ? Math.round((exercisesCorrect / exercisesAttempted) * 100) : 0,
      conversations,
      flashcardsReviewed,
    };
  }
}
