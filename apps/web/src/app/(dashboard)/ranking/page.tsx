'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Trophy, Medal } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';

interface RankingEntry {
  rank: number;
  id: string;
  name: string;
  avatarUrl?: string;
  totalXp?: number;
  weeklyXp?: number;
  level: { name: string };
}

export default function RankingPage() {
  const userId = useAuthStore((s) => s.user?.id);

  const { data: allTime } = useQuery<{ ranking: RankingEntry[]; userRank: number }>({
    queryKey: ['ranking-all'],
    queryFn: () => api.get('/achievements/ranking'),
  });

  const { data: weekly } = useQuery<{ ranking: RankingEntry[]; userRank: number }>({
    queryKey: ['ranking-weekly'],
    queryFn: () => api.get('/achievements/ranking/weekly'),
  });

  const [activeTab, setActiveTab] = useState('weekly');

  const data = activeTab === 'weekly' ? weekly : allTime;

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-orange-400" />;
    return null;
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Ranking</h1>
        <p className="text-muted-foreground">Compita com outros alunos</p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="weekly">Esta Semana</TabsTrigger>
          <TabsTrigger value="alltime">Geral</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {data?.userRank ? (
            <Card className="mb-4">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                  #{data.userRank}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sua Posicao</p>
                  <p className="font-medium">Ranking #{data.userRank}</p>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <div className="space-y-2">
            {data?.ranking.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card
                  className={`transition-all hover:border-primary/50 ${
                    entry.id === userId ? 'border-primary/50 bg-primary/5' : ''
                  }`}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex w-8 justify-center">
                      {getRankIcon(entry.rank) || (
                        <span className="text-sm text-muted-foreground">#{entry.rank}</span>
                      )}
                    </div>
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {entry.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">
                        {entry.name}
                        {entry.id === userId && (
                          <Badge variant="secondary" className="ml-2 text-xs">Voce</Badge>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">{entry.level.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {activeTab === 'weekly' ? entry.weeklyXp : entry.totalXp}
                      </p>
                      <p className="text-xs text-muted-foreground">XP</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
