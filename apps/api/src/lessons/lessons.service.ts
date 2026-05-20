import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async getModules() {
    const lessons = await this.prisma.lesson.findMany({
      include: { _count: { select: { exercises: true } } },
      orderBy: { order: 'asc' },
    });

    const modules = lessons.reduce(
      (acc, lesson) => {
        const mod = lesson.module;
        if (!acc[mod]) acc[mod] = { module: mod, lessons: [] };
        acc[mod].lessons.push(lesson);
        return acc;
      },
      {} as Record<string, any>,
    );

    return Object.values(modules);
  }

  async getLessonsByModule(module: string) {
    return this.prisma.lesson.findMany({
      where: { module },
      orderBy: { order: 'asc' },
      include: { _count: { select: { exercises: true } } },
    });
  }

  async getLesson(lessonId: string, userId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        exercises: { orderBy: { order: 'asc' } },
        progress: { where: { userId } },
      },
    });
    if (!lesson) throw new NotFoundException('Licao nao encontrada');
    return lesson;
  }

  async completeExercise(
    userId: string,
    exerciseId: string,
    answer: string,
  ) {
    const exercise = await this.prisma.exercise.findUnique({ where: { id: exerciseId } });
    if (!exercise) throw new NotFoundException('Exercicio nao encontrado');

    const correct = exercise.correctAnswer.toLowerCase().trim() === answer.toLowerCase().trim();

    await this.prisma.exerciseAttempt.create({
      data: { userId, exerciseId, answer, correct },
    });

    await this.prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId: exercise.lessonId } },
      create: { userId, lessonId: exercise.lessonId, completed: false, score: correct ? 1 : 0 },
      update: correct ? { score: { increment: 1 } } : {},
    });

    return { correct, correctAnswer: exercise.correctAnswer };
  }

  async completeLesson(userId: string, lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { exercises: true, progress: { where: { userId } } },
    });
    if (!lesson) throw new NotFoundException('Licao nao encontrada');

    const total = lesson.exercises.length;
    const progress = lesson.progress[0];
    const score = progress?.score ?? 0;
    const completed = score >= total * 0.7;

    await this.prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId, completed, score },
      update: { completed, score },
    });

    return { completed, score, total };
  }
}
