'use client';

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZES = {
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-40 h-40',
};

export function Logo({ className, showText = false, size = 'md' }: LogoProps) {
  return (
    <div className={cn('flex flex-col items-center', className)}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(SIZES[size])}
      >
        {/* Outer circle */}
        <circle cx="100" cy="100" r="85" stroke="currentColor" strokeWidth="2.5" className="text-primary" />
        
        {/* Inner circle */}
        <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="2" className="text-primary" />
        
        {/* Compass directions */}
        {/* North arrow */}
        <path d="M100 15 L100 30" stroke="currentColor" strokeWidth="2" className="text-primary" />
        <path d="M100 8 L96 18 L100 15 L104 18 Z" fill="currentColor" className="text-primary" />
        <text x="100" y="6" textAnchor="middle" fontSize="12" fontWeight="600" fill="currentColor" className="text-primary">N</text>
        
        {/* South */}
        <path d="M100 170 L100 185" stroke="currentColor" strokeWidth="2" className="text-primary" />
        <text x="100" y="198" textAnchor="middle" fontSize="12" fontWeight="600" fill="currentColor" className="text-primary">S</text>
        
        {/* East */}
        <path d="M170 100 L185 100" stroke="currentColor" strokeWidth="2" className="text-primary" />
        <text x="194" y="104" textAnchor="middle" fontSize="12" fontWeight="600" fill="currentColor" className="text-primary">E</text>
        
        {/* West */}
        <path d="M15 100 L30 100" stroke="currentColor" strokeWidth="2" className="text-primary" />
        <text x="6" y="104" textAnchor="middle" fontSize="12" fontWeight="600" fill="currentColor" className="text-primary">W</text>
        
        {/* Fish 1 (top-left, facing right) */}
        <g className="text-primary">
          {/* Body */}
          <path 
            d="M55 75 Q70 65 85 75 Q95 80 100 90 Q90 95 80 90 Q65 85 55 75" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Eye */}
          <circle cx="72" cy="77" r="3" fill="currentColor" />
          <circle cx="73" cy="76" r="1" fill="white" />
          {/* Tail fins */}
          <path d="M50 70 Q55 75 50 80" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M48 68 Q55 75 48 82" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
        
        {/* Fish 2 (bottom-right, facing left) */}
        <g className="text-primary">
          {/* Body */}
          <path 
            d="M145 125 Q130 135 115 125 Q105 120 100 110 Q110 105 120 110 Q135 115 145 125" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Eye */}
          <circle cx="128" cy="123" r="3" fill="currentColor" />
          <circle cx="127" cy="122" r="1" fill="white" />
          {/* Tail fins */}
          <path d="M150 120 Q145 125 150 130" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M152 118 Q145 125 152 132" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
        
        {/* Connecting swirl/wave between fish */}
        <path 
          d="M85 85 Q100 75 115 85 Q130 95 115 115 Q100 125 85 115 Q70 105 85 85" 
          stroke="currentColor" 
          strokeWidth="2" 
          fill="none"
          className="text-primary"
          strokeLinecap="round"
        />
        
        {/* Inner decorative waves */}
        <path 
          d="M75 95 Q85 90 95 95" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          fill="none"
          className="text-primary"
          strokeLinecap="round"
        />
        <path 
          d="M105 105 Q115 110 125 105" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          fill="none"
          className="text-primary"
          strokeLinecap="round"
        />
      </svg>
      
      {showText && (
        <div className="mt-2 text-center">
          <h1 className="font-serif text-2xl font-bold text-primary tracking-wide">
            BRUJULA PISCIS
          </h1>
          <p className="text-sm text-primary/70 tracking-widest uppercase">
            Guidance & Intuition
          </p>
        </div>
      )}
    </div>
  );
}
