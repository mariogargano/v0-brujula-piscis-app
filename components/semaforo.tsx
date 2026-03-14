'use client';

import { cn } from '@/lib/utils';
import type { TrafficLight } from '@/lib/types';

interface SemaforoProps {
  value: TrafficLight;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const CONFIG = {
  verde: {
    label: 'Adelante',
    color: 'bg-success',
    glow: 'shadow-[0_0_20px_rgba(74,222,128,0.4)]',
    textColor: 'text-success',
  },
  amarillo: {
    label: 'Con cuidado',
    color: 'bg-warning',
    glow: 'shadow-[0_0_20px_rgba(251,191,36,0.4)]',
    textColor: 'text-warning',
  },
  rojo: {
    label: 'No hoy',
    color: 'bg-destructive',
    glow: 'shadow-[0_0_20px_rgba(248,113,113,0.4)]',
    textColor: 'text-destructive',
  },
};

const SIZES = {
  sm: 'w-3 h-3',
  md: 'w-5 h-5',
  lg: 'w-8 h-8',
};

export function Semaforo({ value, size = 'md', showLabel = true, className }: SemaforoProps) {
  const config = CONFIG[value];
  
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'rounded-full animate-pulse',
          config.color,
          config.glow,
          SIZES[size]
        )}
      />
      {showLabel && (
        <span className={cn('font-medium', config.textColor)}>
          {config.label}
        </span>
      )}
    </div>
  );
}

export function SemaforoDisplay({ value, className }: { value: TrafficLight; className?: string }) {
  const config = CONFIG[value];
  
  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div className="flex gap-2 bg-muted/50 rounded-full p-2">
        {(['verde', 'amarillo', 'rojo'] as TrafficLight[]).map((light) => (
          <div
            key={light}
            className={cn(
              'w-6 h-6 rounded-full transition-all duration-500',
              light === value
                ? cn(CONFIG[light].color, CONFIG[light].glow)
                : 'bg-muted/30'
            )}
          />
        ))}
      </div>
      <span className={cn('text-lg font-serif font-semibold', config.textColor)}>
        {config.label}
      </span>
    </div>
  );
}
