'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, RefreshCw, ThumbsUp, Meh, ThumbsDown, RotateCcw } from 'lucide-react';

interface Flashcard {
  id: string;
  word: string;
  definition: string;
  exampleSentence: string;
  difficulty: string;
  nextReview: string;
}

export default function FlashcardsPage() {
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<'list' | 'review'>('list');
  const [showAdd, setShowAdd] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newDef, setNewDef] = useState('');
  const [newExample, setNewExample] = useState('');
  const [reviewIndex, setReviewIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const { data: cards } = useQuery<Flashcard[]>({
    queryKey: ['flashcards'],
    queryFn: () => api.get('/flashcards'),
  });

  const { data: dueCards } = useQuery<Flashcard[]>({
    queryKey: ['flashcards-due'],
    queryFn: () => api.get('/flashcards/due'),
  });

  const { data: stats } = useQuery<{ total: number; due: number; reviewed: number }>({
    queryKey: ['flashcards-stats'],
    queryFn: () => api.get('/flashcards/stats'),
  });

  const createCard = useMutation({
    mutationFn: (data: { word: string; definition: string; exampleSentence: string }) =>
      api.post('/flashcards', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
      setShowAdd(false);
      setNewWord('');
      setNewDef('');
      setNewExample('');
    },
  });

  const reviewCard = useMutation({
    mutationFn: ({ id, quality }: { id: string; quality: number }) =>
      api.post(`/flashcards/${id}/review`, { quality }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards-due'] });
      queryClient.invalidateQueries({ queryKey: ['flashcards-stats'] });
    },
  });

  const handleReview = (quality: number) => {
    if (!dueCards?.length) return;
    const card = dueCards[reviewIndex];
    reviewCard.mutate({ id: card.id, quality });
    api.post('/progress/xp', { amount: 3, source: 'flashcard' });

    if (reviewIndex < dueCards.length - 1) {
      setReviewIndex((i) => i + 1);
      setFlipped(false);
    }
  };

  const startReview = () => {
    setReviewIndex(0);
    setFlipped(false);
    setMode('review');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Flashcards</h1>
          <p className="text-muted-foreground">Build your vocabulary with spaced repetition</p>
        </div>
        <div className="flex gap-2">
          {dueCards && dueCards.length > 0 && mode === 'list' && (
            <Button onClick={startReview} className="gap-2">
              <RefreshCw className="h-4 w-4" /> Review ({dueCards.length})
            </Button>
          )}
          <Button variant="outline" onClick={() => setShowAdd(!showAdd)}>
            <Plus className="mr-1 h-4 w-4" /> Add Card
          </Button>
        </div>
      </div>

      {showAdd && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="space-y-4 p-4">
              <Input placeholder="Word" value={newWord} onChange={(e) => setNewWord(e.target.value)} />
              <Input placeholder="Definition" value={newDef} onChange={(e) => setNewDef(e.target.value)} />
              <Input placeholder="Example sentence" value={newExample} onChange={(e) => setNewExample(e.target.value)} />
              <div className="flex gap-2">
                <Button onClick={() => createCard.mutate({ word: newWord, definition: newDef, exampleSentence: newExample })} disabled={!newWord || !newDef}>
                  Save
                </Button>
                <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {stats && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Total Cards</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.due}</div>
              <p className="text-xs text-muted-foreground">Due for Review</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.reviewed}</div>
              <p className="text-xs text-muted-foreground">Total Reviews</p>
            </CardContent>
          </Card>
        </div>
      )}

      <AnimatePresence mode="wait">
        {mode === 'review' && dueCards?.length ? (
          <motion.div
            key="review"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mx-auto max-w-lg"
          >
            <div className="mb-4 text-center text-sm text-muted-foreground">
              {reviewIndex + 1} of {dueCards.length}
            </div>
            <Progress value={((reviewIndex + 1) / dueCards.length) * 100} className="mb-6" />

            <div
              className="min-h-[250px] cursor-pointer rounded-xl border bg-card p-8 text-center transition-all hover:shadow-lg"
              onClick={() => setFlipped(!flipped)}
            >
              <AnimatePresence mode="wait">
                {!flipped ? (
                  <motion.div
                    key="front"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-full items-center justify-center"
                  >
                    <div>
                      <h3 className="mb-2 text-3xl font-bold">{dueCards[reviewIndex].word}</h3>
                      <p className="text-sm text-muted-foreground">Tap to reveal</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="back"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="text-3xl font-bold">{dueCards[reviewIndex].word}</h3>
                    <p className="text-lg">{dueCards[reviewIndex].definition}</p>
                    <p className="italic text-muted-foreground">{dueCards[reviewIndex].exampleSentence}</p>
                    <Badge variant={dueCards[reviewIndex].difficulty === 'hard' ? 'destructive' : 'default'}>
                      {dueCards[reviewIndex].difficulty}
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {flipped && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex items-center justify-center gap-4"
              >
                <Button variant="outline" className="gap-2" onClick={() => handleReview(1)}>
                  <ThumbsDown className="h-4 w-4" /> Forgot
                </Button>
                <Button variant="outline" className="gap-2" onClick={() => handleReview(3)}>
                  <Meh className="h-4 w-4" /> Hard
                </Button>
                <Button className="gap-2" onClick={() => handleReview(5)}>
                  <ThumbsUp className="h-4 w-4" /> Easy
                </Button>
              </motion.div>
            )}
          </motion.div>
        ) : mode === 'review' ? (
          <motion.div
            key="done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center"
          >
            <RotateCcw className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-bold">All caught up!</h3>
            <p className="mb-6 text-muted-foreground">No cards due for review</p>
            <Button onClick={() => setMode('list')}>Back to List</Button>
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {cards?.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No flashcards yet. Add your first one!</p>
              </div>
            )}
            {cards?.map((card) => (
              <Card key={card.id} className="transition-all hover:border-primary/50">
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{card.word}</p>
                    <p className="text-sm text-muted-foreground">{card.definition}</p>
                  </div>
                  <Badge variant={card.difficulty === 'hard' ? 'destructive' : card.difficulty === 'easy' ? 'success' : 'default'}>
                    {card.difficulty}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
