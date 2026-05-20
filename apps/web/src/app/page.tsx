'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, MessageSquare, Zap, BarChart3, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const features = [
    { icon: MessageSquare, title: 'Conversas com IA', description: 'Pratique conversas reais com IA adaptativa' },
    { icon: BookOpen, title: 'Flashcards Inteligentes', description: 'Repeticao espacada para aprendizado eficiente de vocabulario' },
    { icon: Zap, title: 'Aprendizado Gamificado', description: 'Ganhe XP, sequencias e conquistas' },
    { icon: BarChart3, title: 'Acompanhamento de Progresso', description: 'Analises detalhadas da sua jornada de aprendizado' },
    { icon: Users, title: 'Ranking da Comunidade', description: 'Compita e aprenda com outros' },
    { icon: Sparkles, title: 'Caminho Personalizado', description: 'Exercicios adaptativos baseados no seu nivel' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <header className="fixed left-0 right-0 top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">L</span>
            </div>
            <span className="text-xl font-bold">LinguaFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
                  <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button>Comecar</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative mx-auto max-w-7xl px-4 pt-24 sm:pt-32 pb-16 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            Plataforma de Aprendizado com IA
          </div>
          <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">
            Aprenda Ingles
            <br />
            <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Como Nunca Antes
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
            Uma plataforma interativa que combina conversas com IA, flashcards inteligentes
            e gamificacao para tornar o aprendizado de ingles envolvente e eficaz.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href="/register">
              <Button size="lg" className="gap-2 text-base">
                Comece a Aprender Gratis <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="text-base">
                Entrar
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Tudo que Voce Precisa</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Ferramentas completas projetadas para tornar sua jornada de aprendizado de ingles eficaz e agradavel.
          </p>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group rounded-xl border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:py-20">
        <div className="rounded-2xl border bg-card p-6 sm:p-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Pronto para Comecar?</h2>
          <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
            Junte-se a alunos do mundo todo e transforme suas habilidades em ingles com o LinguaFlow.
          </p>
          <Link href="/register">
            <Button size="lg" className="gap-2 text-base">
              Comece Gratis <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>2026 LinguaFlow. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
