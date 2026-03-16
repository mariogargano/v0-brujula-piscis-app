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

// Pre-computed star positions to avoid hydration mismatch
const STAR_POSITIONS = [
  { left: 15, top: 20, delay: 0.5, duration: 2.5 },
  { left: 85, top: 15, delay: 1.2, duration: 3.2 },
  { left: 45, top: 80, delay: 0.8, duration: 2.8 },
  { left: 70, top: 45, delay: 2.1, duration: 4.1 },
  { left: 25, top: 65, delay: 1.5, duration: 3.5 },
  { left: 90, top: 70, delay: 0.3, duration: 2.3 },
  { left: 10, top: 40, delay: 2.5, duration: 4.5 },
  { left: 55, top: 10, delay: 1.8, duration: 3.8 },
  { left: 35, top: 90, delay: 0.7, duration: 2.7 },
  { left: 80, top: 30, delay: 2.2, duration: 4.2 },
  { left: 5, top: 85, delay: 1.1, duration: 3.1 },
  { left: 60, top: 55, delay: 0.4, duration: 2.4 },
  { left: 40, top: 25, delay: 2.8, duration: 4.8 },
  { left: 95, top: 50, delay: 1.6, duration: 3.6 },
  { left: 20, top: 75, delay: 0.9, duration: 2.9 },
  { left: 75, top: 95, delay: 2.4, duration: 4.4 },
  { left: 50, top: 35, delay: 1.3, duration: 3.3 },
  { left: 30, top: 5, delay: 0.6, duration: 2.6 },
  { left: 65, top: 60, delay: 2.0, duration: 4.0 },
  { left: 12, top: 50, delay: 1.7, duration: 3.7 },
];

export function StarField({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {STAR_POSITIONS.map((star, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-primary/30 rounded-full animate-pulse"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
