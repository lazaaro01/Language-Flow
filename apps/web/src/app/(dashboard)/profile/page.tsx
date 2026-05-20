'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { getLevelColor, getLevelProgress, formatDate } from '@/lib/utils';
import {
  Trophy,
  Flame,
  BookOpen,
  MessageSquare,
  Target,
  Zap,
  Medal,
  Clock,
} from 'lucide-react';

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);

  const { data: profile } = useQuery<any>({
    queryKey: ['profile'],
    queryFn: () => api.get('/users/profile'),
  });

  const { data: stats } = useQuery<any>({
    queryKey: ['stats'],
    queryFn: () => api.get('/users/stats'),
  });

  if (!profile || !stats) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const levelProgress = getLevelProgress(profile.totalXp, profile.level.minXp, profile.level.maxXp);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardContent className="flex flex-col items-center p-8">
            <Avatar className="mb-4 h-24 w-24">
              <AvatarImage src={profile.avatarUrl} />
              <AvatarFallback className="bg-primary/10 text-3xl text-primary">
                {profile.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-muted-foreground">{profile.email}</p>
            <div className="mt-4 flex items-center gap-3">
              <Badge className={getLevelColor(profile.level.name)}>
                <Trophy className="mr-1 h-3 w-3" />
                {profile.level.name}
              </Badge>
              <Badge variant="secondary">
                <Flame className="mr-1 h-3 w-3" />
                {profile.streak?.currentStreak ?? 0} dias de sequencia
              </Badge>
            </div>
            <div className="mt-6 w-full max-w-sm">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Progresso do Nivel</span>
                <span>{profile.totalXp} XP</span>
              </div>
              <Progress value={levelProgress} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle>Conquistas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {profile.achievements?.map((ua: any) => (
                <div
                  key={ua.id}
                  className="rounded-lg bg-muted/50 p-4 text-center transition-all hover:bg-muted"
                >
                  <div className="mb-2 text-3xl">{ua.achievement.icon}</div>
                  <p className="text-sm font-medium">{ua.achievement.title}</p>
                  <p className="text-xs text-muted-foreground">{ua.achievement.description}</p>
                </div>
              ))}
              {(!profile.achievements || profile.achievements.length === 0) && (
                <p className="col-span-full py-8 text-center text-muted-foreground">
                  Complete licoes e desafios para ganhar conquistas!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle>Estatisticas de Aprendizado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" /> Licoes
                </div>
                <p className="text-2xl font-bold">{stats.lessonsCompleted}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4" /> Precisao
                </div>
                <p className="text-2xl font-bold">{stats.accuracy}%</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4" /> Conversas
                </div>
                <p className="text-2xl font-bold">{stats.conversations}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4" /> XP Total
                </div>
                <p className="text-2xl font-bold">{profile.totalXp}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
