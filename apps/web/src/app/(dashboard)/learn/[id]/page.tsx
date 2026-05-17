'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, X, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const moduleName = params.id as string;

  const { data: lessons, isLoading } = useQuery<any[]>({
    queryKey: ['lessons', moduleName],
    queryFn: () => api.get(`/lessons/module/${moduleName}`),
  });

  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ correct: boolean; correctAnswer: string } | null>(null);
  const [completed, setCompleted] = useState(false);

  const attemptMutation = useMutation({
    mutationFn: ({ exerciseId, answer }: { exerciseId: string; answer: string }) =>
      api.post<{ correct: boolean; correctAnswer: string }>(`/lessons/${selectedLesson?.id}/exercises/${exerciseId}/attempt`, { answer }),
  });

  const handleStartLesson = async (lesson: any) => {
    const data = await api.get(`/lessons/${lesson.id}`);
    setSelectedLesson(data);
    setCurrentExercise(0);
    setAnswer('');
    setFeedback(null);
    setCompleted(false);
  };

  const handleSubmit = async () => {
    if (!selectedLesson) return;
    const ex = selectedLesson.exercises[currentExercise];
    const result = await attemptMutation.mutateAsync({ exerciseId: ex.id, answer });
    setFeedback(result);

    if (result.correct) {
      await api.post('/progress/xp', { amount: 10, source: 'exercise' });
    }
  };

  const handleNext = () => {
    if (!selectedLesson) return;
    if (currentExercise < selectedLesson.exercises.length - 1) {
      setCurrentExercise((i) => i + 1);
      setAnswer('');
      setFeedback(null);
    } else {
      setCompleted(true);
      api.post(`/lessons/${selectedLesson.id}/complete`);
      api.post('/progress/xp', { amount: 50, source: 'lesson' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (completed) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
            <Check className="h-10 w-10 text-green-400" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">Lesson Complete!</h2>
          <p className="mb-8 text-muted-foreground">Great job! You earned +50 XP</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/learn">
              <Button variant="outline">Back to Modules</Button>
            </Link>
            <Button onClick={() => setSelectedLesson(null)}>Next Lesson</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (selectedLesson) {
    const exercise = selectedLesson.exercises[currentExercise];
    const isMultipleChoice = exercise.type === 'multiple-choice';
    const options = exercise.options ? JSON.parse(exercise.options) : [];

    return (
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => setSelectedLesson(null)}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to lessons
        </button>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xl font-semibold">{selectedLesson.title}</h2>
            <Badge variant="secondary">
              {currentExercise + 1} / {selectedLesson.exercises.length}
            </Badge>
          </div>
          <Progress value={((currentExercise + 1) / selectedLesson.exercises.length) * 100} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentExercise}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <Badge variant="outline" className="mb-2 w-fit capitalize">
                  {exercise.type === 'fill-blank' ? 'Fill in the blank' : 'Multiple choice'}
                </Badge>
                <CardTitle className="text-lg">{exercise.question}</CardTitle>
              </CardHeader>
              <CardContent>
                {isMultipleChoice ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    {options.map((opt: string) => (
                      <Button
                        key={opt}
                        variant={feedback ? (opt === exercise.correctAnswer ? 'default' : answer === opt ? 'destructive' : 'outline') : answer === opt ? 'default' : 'outline'}
                        className="h-auto justify-start p-4 text-left"
                        onClick={() => setAnswer(opt)}
                        disabled={!!feedback}
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <Input
                    placeholder="Type your answer..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    disabled={!!feedback}
                    className="text-lg"
                  />
                )}

                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 rounded-lg p-4 ${
                      feedback.correct ? 'bg-green-500/10 text-green-400' : 'bg-destructive/10 text-destructive'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-medium">
                      {feedback.correct ? (
                        <><Check className="h-5 w-5" /> Correct!</>
                      ) : (
                        <><X className="h-5 w-5" /> Incorrect. Answer: {feedback.correctAnswer}</>
                      )}
                    </div>
                  </motion.div>
                )}

                <div className="mt-6 flex justify-end">
                  {!feedback ? (
                    <Button onClick={handleSubmit} disabled={!answer || attemptMutation.isPending}>
                      {attemptMutation.isPending ? 'Checking...' : 'Submit'}
                    </Button>
                  ) : (
                    <Button onClick={handleNext} className="gap-2">
                      {currentExercise < selectedLesson.exercises.length - 1 ? (
                        <>Next <ChevronRight className="h-4 w-4" /></>
                      ) : (
                        'Complete Lesson'
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/learn" className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to modules
        </Link>
        <h1 className="text-3xl font-bold capitalize">{moduleName}</h1>
        <p className="text-muted-foreground">Select a lesson to begin</p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        {lessons?.map((lesson: any, i: number) => (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card
              className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg"
              onClick={() => handleStartLesson(lesson)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{lesson.title}</CardTitle>
                  <Badge variant="secondary">{lesson._count.exercises} exercises</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{lesson.description}</p>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
