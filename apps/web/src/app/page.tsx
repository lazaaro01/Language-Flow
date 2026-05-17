'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, MessageSquare, Zap, BarChart3, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const features = [
    { icon: MessageSquare, title: 'AI Conversations', description: 'Practice real conversations with adaptive AI' },
    { icon: BookOpen, title: 'Smart Flashcards', description: 'Spaced repetition for efficient vocabulary learning' },
    { icon: Zap, title: 'Gamified Learning', description: 'Earn XP, streaks, and achievements' },
    { icon: BarChart3, title: 'Progress Tracking', description: 'Detailed analytics of your learning journey' },
    { icon: Users, title: 'Community Ranking', description: 'Compete and learn with others' },
    { icon: Sparkles, title: 'Personalized Path', description: 'Adaptive exercises based on your level' },
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
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative mx-auto max-w-7xl px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            AI-Powered Learning Platform
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
            Learn English
            <br />
            <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Like Never Before
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
            An interactive platform that combines AI conversations, smart flashcards,
            and gamification to make learning English engaging and effective.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="gap-2 text-base">
                Start Learning Free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="text-base">
                Sign In
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
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Everything You Need</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Comprehensive tools designed to make your English learning journey effective and enjoyable.
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

      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="rounded-2xl border bg-card p-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Start?</h2>
          <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
            Join learners worldwide and transform your English skills with LinguaFlow.
          </p>
          <Link href="/register">
            <Button size="lg" className="gap-2 text-base">
              Get Started Free <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>2024 LinguaFlow. All rights reserved.</p>
      </footer>
    </div>
  );
}
