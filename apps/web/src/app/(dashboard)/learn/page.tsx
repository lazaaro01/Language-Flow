'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, BookOpen, Headphones, Mic, PenTool } from 'lucide-react';

const moduleIcons: Record<string, any> = {
  grammar: GraduationCap,
  vocabulary: BookOpen,
  listening: Headphones,
  speaking: Mic,
  writing: PenTool,
};

const moduleColors: Record<string, string> = {
  grammar: 'from-blue-500/20 to-blue-600/10',
  vocabulary: 'from-green-500/20 to-green-600/10',
  listening: 'from-purple-500/20 to-purple-600/10',
  speaking: 'from-orange-500/20 to-orange-600/10',
  writing: 'from-pink-500/20 to-pink-600/10',
};

export default function LearnPage() {
  const { data: modules, isLoading } = useQuery<any[]>({
    queryKey: ['modules'],
    queryFn: () => api.get('/lessons/modules'),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Modulos de Aprendizado</h1>
        <p className="text-muted-foreground">Escolha um modulo para comecar a aprender</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules?.map((mod: any, i: number) => {
          const Icon = moduleIcons[mod.module] || GraduationCap;
          return (
            <motion.div
              key={mod.module}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/learn/${mod.module}`}>
                <Card className={`group cursor-pointer overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg`}>
                  <div className={`bg-gradient-to-br ${moduleColors[mod.module] || 'from-primary/20 to-primary/10'} p-6`}>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-background/80">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="capitalize">{mod.module}</CardTitle>
                    <CardDescription className="mt-1">
                      {mod.lessons.length} licoes
                    </CardDescription>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      {mod.lessons.slice(0, 3).map((lesson: any) => (
                        <div key={lesson.id} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{lesson.title}</span>
                          <Badge variant="secondary" className="text-xs">
                            {lesson._count.exercises} ex
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
