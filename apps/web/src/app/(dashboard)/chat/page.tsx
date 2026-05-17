'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MessageSquare, Plus, Send, User, Bot, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Conversation {
  id: string;
  title: string;
  scenario?: string;
  createdAt: string;
  _count: { messages: number };
}

interface Message {
  id: string;
  role: string;
  content: string;
  correction?: string;
  suggestion?: string;
  grammarNote?: string;
}

export default function ChatPage() {
  const queryClient = useQueryClient();
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showNewConv, setShowNewConv] = useState(false);
  const [convTitle, setConvTitle] = useState('');
  const [convScenario, setConvScenario] = useState('');

  const { data: conversations } = useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: () => api.get('/chat/conversations'),
  });

  const { data: messages } = useQuery<{ messages: Message[] }>({
    queryKey: ['conversation', selectedConv],
    queryFn: () => api.get(`/chat/conversations/${selectedConv}`),
    enabled: !!selectedConv,
  });

  const { data: scenarios } = useQuery<any[]>({
    queryKey: ['scenarios'],
    queryFn: () => api.get('/chat/scenarios'),
  });

  const createConv = useMutation({
    mutationFn: (data: { title: string; scenario?: string }) =>
      api.post('/chat/conversations', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setShowNewConv(false);
      setConvTitle('');
      setConvScenario('');
    },
  });

  const sendMsg = useMutation({
    mutationFn: (data: { content: string }) =>
      api.post(`/chat/conversations/${selectedConv}/messages`, { role: 'user', ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation', selectedConv] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  const handleSend = () => {
    if (!newMessage.trim() || !selectedConv) return;
    sendMsg.mutate({ content: newMessage });
    setNewMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-6">
      <div className="w-80 shrink-0 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Conversations</h2>
          <Button size="sm" onClick={() => setShowNewConv(true)}>
            <Plus className="mr-1 h-4 w-4" /> New
          </Button>
        </div>

        <div className="space-y-2">
          {conversations?.map((conv) => (
            <Card
              key={conv.id}
              className={`cursor-pointer transition-all hover:border-primary/50 ${
                selectedConv === conv.id ? 'border-primary' : ''
              }`}
              onClick={() => setSelectedConv(conv.id)}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{conv.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {conv._count.messages} messages
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>

        {showNewConv && (
          <Card>
            <CardContent className="space-y-3 p-4">
              <Input
                placeholder="Conversation title"
                value={convTitle}
                onChange={(e) => setConvTitle(e.target.value)}
              />
              {scenarios && (
                <div className="flex flex-wrap gap-2">
                  {scenarios.map((s: any) => (
                    <Badge
                      key={s.id}
                      variant={convScenario === s.id ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setConvScenario(s.id)}
                    >
                      {s.label}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => createConv.mutate({ title: convTitle, scenario: convScenario || undefined })}
                  disabled={!convTitle}
                >
                  Create
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowNewConv(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex flex-1 flex-col rounded-lg border">
        {selectedConv ? (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {messages?.messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'ai' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    {msg.correction && (
                      <p className="mt-1 text-xs text-green-400">Corrected: {msg.correction}</p>
                    )}
                    {msg.suggestion && (
                      <p className="mt-1 text-xs text-blue-400">Suggestion: {msg.suggestion}</p>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button onClick={handleSend} disabled={!newMessage || sendMsg.isPending}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">Select a conversation</h3>
              <p className="text-sm text-muted-foreground">Choose a conversation or start a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
