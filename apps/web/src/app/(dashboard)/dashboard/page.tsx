'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getLevelColor, getLevelProgress } from '@/lib/utils';
import {
  Zap,
  Flame,
  Target,
  Trophy,
  MessageSquare,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

interface DashboardData {
  currentXp: number;
  totalXp: number;
  level: { id: string; name: string; minXp: number; maxXp: number };
  streak: { currentStreak: number; longestStreak: number };
  todayXp: number;
  dailyGoalMinutes: number;
  weeklyChart: { date: string; xp: number }[];
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data: dashboard } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/progress/dashboard'),
  });

  const { data: stats } = useQuery<{
    lessonsCompleted: number;
    exercisesAttempted: number;
    exercisesCorrect: number;
    accuracy: number;
    conversations: number;
    flashcardsReviewed: number;
  }>({
    queryKey: ['stats'],
    queryFn: () => api.get('/users/stats'),
  });

  if (!dashboard || !stats) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const levelProgress = getLevelProgress(dashboard.totalXp, dashboard.level.minXp, dashboard.level.maxXp);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Bem-vindo de volta, {user?.name}</h1>
        <p className="text-muted-foreground">Continue com o excelente trabalho!</p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Nivel</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getLevelColor(dashboard.level.name)}`}>
                {dashboard.level.name}
              </div>
              <Progress value={levelProgress} className="mt-2" />
              <p className="mt-1 text-xs text-muted-foreground">
                {dashboard.totalXp} / {dashboard.level.maxXp === Infinity ? '∞' : dashboard.level.maxXp} XP
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Sequencia</CardTitle>
              <Flame className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.streak.currentStreak} dias</div>
              <p className="text-xs text-muted-foreground">
                Melhor: {dashboard.streak.longestStreak} dias
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">XP de Hoje</CardTitle>
              <Zap className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{dashboard.todayXp}</div>
              <p className="text-xs text-muted-foreground">XP ganho hoje</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Precisao</CardTitle>
              <Target className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.accuracy}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.exercisesCorrect}/{stats.exercisesAttempted} corretos
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle>Atividade Semanal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                {dashboard.weeklyChart.map((day) => {
                  const maxXp = Math.max(...dashboard.weeklyChart.map((d) => d.xp), 1);
                  const height = (day.xp / maxXp) * 100;
                  const dayLabel = new Date(day.date).toLocaleDateString('pt-BR', { weekday: 'short' });
                  return (
                    <div key={day.date} className="flex flex-1 flex-col items-center gap-1">
                      <span className="text-xs text-muted-foreground">{day.xp}</span>
                      <div
                        className="w-full rounded-md bg-primary transition-all"
                        style={{ height: `${Math.max(height, 4)}px` }}
                      />
                      <span className="text-xs text-muted-foreground">{dayLabel}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardHeader>
              <CardTitle>Acoes Rapidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/learn">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <BookOpen className="h-4 w-4" /> Continuar Aprendendo <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
              </Link>
              <Link href="/chat">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <MessageSquare className="h-4 w-4" /> Praticar Conversacao <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
              </Link>
              <Link href="/flashcards">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <BookOpen className="h-4 w-4" /> Revisar Flashcards <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card>
          <CardHeader>
            <CardTitle>Estatisticas de Aprendizado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-muted p-4 text-center">
                <div className="text-2xl font-bold">{stats.lessonsCompleted}</div>
                <p className="text-xs text-muted-foreground">Licoes Concluidas</p>
              </div>
              <div className="rounded-lg bg-muted p-4 text-center">
                <div className="text-2xl font-bold">{stats.exercisesAttempted}</div>
                <p className="text-xs text-muted-foreground">Exercicios</p>
              </div>
              <div className="rounded-lg bg-muted p-4 text-center">
                <div className="text-2xl font-bold">{stats.conversations}</div>
                <p className="text-xs text-muted-foreground">Conversas</p>
              </div>
              <div className="rounded-lg bg-muted p-4 text-center">
                <div className="text-2xl font-bold">{stats.flashcardsReviewed}</div>
                <p className="text-xs text-muted-foreground">Cartoes Revisados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
