'use client';

import { cn } from '@/lib/utils';

interface PiscisCardProps {
  className?: string;
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'glow';
  padding?: 'sm' | 'md' | 'lg';
}

export function PiscisCard({ 
  className, 
  children, 
  variant = 'default',
  padding = 'md',
}: PiscisCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border',
        variant === 'default' && 'bg-card',
        variant === 'glass' && 'glass',
        variant === 'glow' && 'bg-card shadow-[0_0_30px_rgba(110,231,245,0.1)]',
        padding === 'sm' && 'p-4',
        padding === 'md' && 'p-5',
        padding === 'lg' && 'p-6',
        className
      )}
    >
      {children}
    </div>
  );
}

interface PiscisCardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PiscisCardHeader({ title, subtitle, action, className }: PiscisCardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div>
        <h3 className="font-serif text-lg font-semibold text-foreground">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
