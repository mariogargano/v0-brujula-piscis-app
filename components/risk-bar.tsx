'use client';

import { cn } from '@/lib/utils';

interface RiskBarProps {
  value: number; // 0-100
  className?: string;
  showLabel?: boolean;
}

function getRiskColor(value: number): string {
  if (value <= 30) return 'bg-success';
  if (value <= 60) return 'bg-warning';
  return 'bg-destructive';
}

function getRiskLabel(value: number): string {
  if (value <= 30) return 'Riesgo bajo';
  if (value <= 60) return 'Riesgo moderado';
  return 'Riesgo alto';
}

export function RiskBar({ value, className, showLabel = true }: RiskBarProps) {
  const color = getRiskColor(value);
  const label = getRiskLabel(value);
  
  return (
    <div className={cn('space-y-2', className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Riesgo emocional</span>
          <span className={cn(
            'font-semibold',
            value <= 30 ? 'text-success' : value <= 60 ? 'text-warning' : 'text-destructive'
          )}>
            {value}%
          </span>
        </div>
      )}
      <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-1000 ease-out',
            color
          )}
          style={{ width: `${value}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-muted-foreground">{label}</p>
      )}
    </div>
  );
}
