import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class FlashcardsService {
  constructor(private prisma: PrismaService) {}

  async getDue(userId: string) {
    return this.prisma.flashcard.findMany({
      where: { userId, nextReview: { lte: new Date() } },
      orderBy: { nextReview: 'asc' },
    });
  }

  async getAll(userId: string) {
    return this.prisma.flashcard.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, data: { word: string; definition: string; exampleSentence: string }) {
    return this.prisma.flashcard.create({
      data: { ...data, userId },
    });
  }

  async review(flashcardId: string, quality: number) {
    const card = await this.prisma.flashcard.findUnique({ where: { id: flashcardId } });
    if (!card) throw new Error('Flashcard nao encontrado');

    let { ease, interval, repetitions } = card;

    ease = Math.max(1.3, ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

    if (quality < 3) {
      repetitions = 0;
      interval = 1;
    } else {
      if (repetitions === 0) interval = 1;
      else if (repetitions === 1) interval = 6;
      else interval = Math.round(interval * ease);
      repetitions++;
    }

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    await this.prisma.flashcard.update({
      where: { id: flashcardId },
      data: { ease, interval, repetitions, nextReview, lastReviewed: new Date() },
    });

    await this.prisma.flashcardReview.create({
      data: { flashcardId, quality },
    });

    const difficulty = quality <= 2 ? 'hard' : quality <= 3 ? 'medium' : 'easy';

    return { difficulty, nextReview, interval };
  }

  async getStats(userId: string) {
    const [total, due, reviewed] = await Promise.all([
      this.prisma.flashcard.count({ where: { userId } }),
      this.prisma.flashcard.count({ where: { userId, nextReview: { lte: new Date() } } }),
      this.prisma.flashcardReview.count({ where: { flashcard: { userId } } }),
    ]);
    return { total, due, reviewed };
  }
}
