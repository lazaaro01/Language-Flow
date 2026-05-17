import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { level: true, streak: true },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayXp = await this.prisma.xpTransaction.aggregate({
      where: { userId, createdAt: { gte: today } },
      _sum: { amount: true },
    });

    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const weeklyXp = await this.prisma.xpTransaction.groupBy({
      by: ['createdAt'],
      where: { userId, createdAt: { gte: weekStart } },
      _sum: { amount: true },
    });

    const weeklyActivity = await this.prisma.xpTransaction.findMany({
      where: { userId, createdAt: { gte: weekStart } },
      select: { createdAt: true, amount: true },
      orderBy: { createdAt: 'asc' },
    });

    const days: Record<string, number> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      days[d.toISOString().split('T')[0]] = 0;
    }
    weeklyActivity.forEach((a) => {
      const key = a.createdAt.toISOString().split('T')[0];
      if (days[key] !== undefined) days[key] += a.amount;
    });

    return {
      currentXp: user?.currentXp ?? 0,
      totalXp: user?.totalXp ?? 0,
      level: user?.level ?? null,
      streak: user?.streak ?? null,
      todayXp: todayXp._sum.amount ?? 0,
      dailyGoalMinutes: user?.dailyGoalMinutes ?? 30,
      weeklyChart: Object.entries(days).map(([date, xp]) => ({ date, xp })),
    };
  }

  async logXp(userId: string, amount: number, source: string) {
    await this.prisma.xpTransaction.create({
      data: { userId, amount, source },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        currentXp: { increment: amount },
        totalXp: { increment: amount },
      },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { level: true },
    });

    const levels = await this.prisma.level.findMany({ orderBy: { minXp: 'asc' } });
    let newLevel = user?.level;
    for (const lvl of levels) {
      if ((user?.totalXp ?? 0) >= lvl.minXp && (user?.totalXp ?? 0) <= lvl.maxXp) {
        newLevel = lvl;
      }
    }

    if (newLevel && newLevel.id !== user?.levelId) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { levelId: newLevel.id },
      });
    }

    await this.updateStreak(userId);
  }

  private async updateStreak(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const streak = await this.prisma.userStreak.findUnique({ where: { userId } });
    if (!streak) return;

    const lastActivity = new Date(streak.lastActivityAt);
    lastActivity.setHours(0, 0, 0, 0);

    if (lastActivity.getTime() === today.getTime()) return;

    const newStreak = lastActivity.getTime() === yesterday.getTime()
      ? streak.currentStreak + 1
      : 1;

    await this.prisma.userStreak.update({
      where: { userId },
      data: {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, streak.longestStreak),
        lastActivityAt: new Date(),
      },
    });
  }
}
