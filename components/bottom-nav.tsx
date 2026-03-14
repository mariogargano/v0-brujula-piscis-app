'use client';

import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { 
  Sun, 
  Compass, 
  Sparkles, 
  BarChart3, 
  User 
} from 'lucide-react';

const TABS = [
  { id: 'hoy', label: 'Hoy', icon: Sun },
  { id: 'decidir', label: 'Decidir', icon: Compass },
  { id: 'rituales', label: 'Rituales', icon: Sparkles },
  { id: 'reportes', label: 'Reportes', icon: BarChart3 },
  { id: 'perfil', label: 'Perfil', icon: User },
];

export function BottomNav() {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 py-2 px-3 min-w-[64px] min-h-[48px]',
                'transition-all duration-200',
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon 
                className={cn(
                  'w-5 h-5 transition-transform duration-200',
                  isActive && 'scale-110'
                )} 
              />
              <span className={cn(
                'text-xs font-medium',
                isActive && 'text-primary'
              )}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute -top-0.5 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
