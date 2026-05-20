'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  GraduationCap,
  MessageSquare,
  BookOpen,
  Trophy,
  User,
  Settings,
} from 'lucide-react';

const items = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Inicio' },
  { href: '/learn', icon: GraduationCap, label: 'Aprender' },
  { href: '/chat', icon: MessageSquare, label: 'Chat' },
  { href: '/flashcards', icon: BookOpen, label: 'Cartoes' },
  { href: '/ranking', icon: Trophy, label: 'Ranking' },
  { href: '/profile', icon: User, label: 'Perfil' },
  { href: '/settings', icon: Settings, label: 'Config' },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex items-center justify-around py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
