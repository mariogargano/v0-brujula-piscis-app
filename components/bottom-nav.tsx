'use client';

import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { 
  Sun, 
  Compass, 
  Users,
  Sparkles, 
  User 
} from 'lucide-react';

const TABS = [
  { id: 'hoy', label: 'Hoy', icon: Sun },
  { id: 'decidir', label: 'Decidir', icon: Compass },
  { id: 'mentor', label: 'Mentor', icon: Sparkles },
  { id: 'comunidad', label: 'Comunidad', icon: Users },
  { id: 'perfil', label: 'Perfil', icon: User },
];

export function BottomNav() {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 py-2 px-2 min-w-[52px] min-h-[48px]',
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
                'text-[10px] font-medium leading-tight',
                isActive && 'text-primary'
              )}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute -top-0.5 w-6 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
