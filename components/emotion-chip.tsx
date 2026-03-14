'use client';

import { cn } from '@/lib/utils';
import type { Emotion, PersonalTendency, DecisionGoal, Objective } from '@/lib/types';
import { EMOTIONS_LABELS, TENDENCIES_LABELS, GOALS_LABELS, OBJECTIVES_LABELS } from '@/lib/types';
import { Heart, Wallet, Sparkles, Leaf, Frown, Star, Clock, AlertCircle, Flame, HelpCircle, Sun } from 'lucide-react';

interface ChipProps {
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Chip({ selected, onClick, disabled, className, children }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
        'border min-h-[44px]',
        selected
          ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(110,231,245,0.3)]'
          : 'bg-muted/30 text-foreground border-border hover:border-primary/50 hover:bg-muted/50',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
}

// Emotion chips
const EMOTION_ICONS: Record<Emotion, typeof Frown> = {
  ansiedad: AlertCircle,
  ilusion: Star,
  nostalgia: Clock,
  culpa: Frown,
  enojo: Flame,
  confusion: HelpCircle,
  calma: Sun,
};

export function EmotionChip({ 
  emotion, 
  selected, 
  onClick 
}: { 
  emotion: Emotion; 
  selected?: boolean; 
  onClick?: () => void;
}) {
  const Icon = EMOTION_ICONS[emotion];
  
  return (
    <Chip selected={selected} onClick={onClick}>
      <span className="flex items-center gap-2">
        <Icon className="w-4 h-4" />
        {EMOTIONS_LABELS[emotion]}
      </span>
    </Chip>
  );
}

// Tendency chips
export function TendencyChip({ 
  tendency, 
  selected, 
  onClick 
}: { 
  tendency: PersonalTendency; 
  selected?: boolean; 
  onClick?: () => void;
}) {
  return (
    <Chip selected={selected} onClick={onClick} className="text-left">
      {TENDENCIES_LABELS[tendency]}
    </Chip>
  );
}

// Goal chips
export function GoalChip({ 
  goal, 
  selected, 
  onClick 
}: { 
  goal: DecisionGoal; 
  selected?: boolean; 
  onClick?: () => void;
}) {
  return (
    <Chip selected={selected} onClick={onClick}>
      {GOALS_LABELS[goal]}
    </Chip>
  );
}

// Category cards
const CATEGORY_ICONS: Record<Objective, typeof Heart> = {
  amor: Heart,
  dinero: Wallet,
  bienestar: Leaf,
  creatividad: Sparkles,
};

const CATEGORY_COLORS: Record<Objective, string> = {
  amor: 'from-pink-500/20 to-rose-500/20 border-pink-500/30',
  dinero: 'from-emerald-500/20 to-green-500/20 border-emerald-500/30',
  bienestar: 'from-sky-500/20 to-cyan-500/20 border-sky-500/30',
  creatividad: 'from-violet-500/20 to-purple-500/20 border-violet-500/30',
};

const CATEGORY_ICON_COLORS: Record<Objective, string> = {
  amor: 'text-pink-400',
  dinero: 'text-emerald-400',
  bienestar: 'text-sky-400',
  creatividad: 'text-violet-400',
};

export function CategoryCard({ 
  category, 
  selected, 
  onClick 
}: { 
  category: Objective; 
  selected?: boolean; 
  onClick?: () => void;
}) {
  const Icon = CATEGORY_ICONS[category];
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center gap-3 p-6 rounded-2xl',
        'border transition-all duration-300 min-h-[120px]',
        'bg-gradient-to-br',
        CATEGORY_COLORS[category],
        selected
          ? 'ring-2 ring-primary scale-[1.02] shadow-lg'
          : 'hover:scale-[1.01]'
      )}
    >
      <Icon className={cn('w-8 h-8', CATEGORY_ICON_COLORS[category])} />
      <span className="font-medium text-foreground">
        {OBJECTIVES_LABELS[category]}
      </span>
    </button>
  );
}
