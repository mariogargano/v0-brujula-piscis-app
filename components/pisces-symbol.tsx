'use client';

import { cn } from '@/lib/utils';

interface PiscesSymbolProps {
  className?: string;
  animated?: boolean;
}

export function PiscesSymbol({ className, animated = false }: PiscesSymbolProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(
        'text-primary',
        animated && 'animate-pulse-glow',
        className
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      {/* First fish arc */}
      <path d="M25 20 C45 20, 45 50, 25 50 C45 50, 45 80, 25 80" />
      {/* Second fish arc */}
      <path d="M75 20 C55 20, 55 50, 75 50 C55 50, 55 80, 75 80" />
      {/* Connecting line */}
      <line x1="20" y1="50" x2="80" y2="50" />
    </svg>
  );
}

export function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('text-secondary', className)}
      fill="currentColor"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function WaveDecoration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 20"
      className={cn('text-primary/20', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path d="M0 10 Q25 0, 50 10 T100 10 T150 10 T200 10" />
    </svg>
  );
}

export function StarField({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-primary/30 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
}
