import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AchievementsService {
  constructor(private prisma: PrismaService) {}

  async getAll(userId: string) {
    const achievements = await this.prisma.achievement.findMany();
    const userAchievements = await this.prisma.userAchievement.findMany({
      where: { userId },
    });

    const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId));

    return achievements.map((a) => ({
      ...a,
      unlocked: unlockedIds.has(a.id),
      unlockedAt: userAchievements.find((ua) => ua.achievementId === a.id)?.unlockedAt ?? null,
    }));
  }

  async getRanking(userId: string) {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        totalXp: true,
        level: { select: { name: true } },
      },
      orderBy: { totalXp: 'desc' },
      take: 50,
    });

    const userRank = users.findIndex((u) => u.id === userId) + 1;

    return {
      ranking: users.map((u, i) => ({ rank: i + 1, ...u })),
      userRank: userRank || 0,
    };
  }

  async getWeeklyRanking(userId: string) {
    const weekStart = new Date();
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const xpGroups = await this.prisma.xpTransaction.groupBy({
      by: ['userId'],
      where: { createdAt: { gte: weekStart } },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
      take: 50,
    });

    const userIds = xpGroups.map((g) => g.userId);
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, avatarUrl: true, level: { select: { name: true } } },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));
    const userRank = xpGroups.findIndex((g) => g.userId === userId) + 1;

    return {
      ranking: xpGroups.map((g, i) => ({
        rank: i + 1,
        ...userMap.get(g.userId),
        weeklyXp: g._sum.amount ?? 0,
      })),
      userRank: userRank || 0,
    };
  }
}
