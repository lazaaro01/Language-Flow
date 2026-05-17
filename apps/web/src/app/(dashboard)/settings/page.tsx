'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { useThemeStore } from '@/stores/theme-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sun, Moon, Save, LogOut } from 'lucide-react';

const GOAL_OPTIONS = [15, 30, 60];

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);
  const { isDark, toggle } = useThemeStore();

  const [name, setName] = useState(user?.name || '');
  const [dailyGoal, setDailyGoal] = useState(user?.dailyGoalMinutes || 30);

  const updateMutation = useMutation({
    mutationFn: (data: { name?: string; dailyGoalMinutes?: number }) =>
      api.patch('/users/profile', data),
    onSuccess: (data: any) => {
      setUser(data);
    },
  });

  const handleSave = () => {
    updateMutation.mutate({ name, dailyGoalMinutes: dailyGoal });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ''} disabled />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            <Button onClick={handleSave} disabled={updateMutation.isPending} className="gap-2">
              <Save className="h-4 w-4" /> Save Changes
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle>Daily Goal</CardTitle>
            <CardDescription>Set your daily study target</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              {GOAL_OPTIONS.map((minutes) => (
                <Badge
                  key={minutes}
                  variant={dailyGoal === minutes ? 'default' : 'outline'}
                  className="cursor-pointer px-6 py-2 text-sm"
                  onClick={() => setDailyGoal(minutes)}
                >
                  {minutes} min
                </Badge>
              ))}
            </div>
            <Button
              onClick={() => updateMutation.mutate({ dailyGoalMinutes: dailyGoal })}
              size="sm"
              className="mt-4"
              disabled={updateMutation.isPending}
            >
              Update Goal
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Toggle dark mode</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
              </div>
              <Button variant="outline" onClick={toggle}>
                Switch to {isDark ? 'Light' : 'Dark'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Sign out of your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={logout} className="gap-2">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
