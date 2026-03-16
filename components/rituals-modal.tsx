'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PiscisCard } from '@/components/piscis-card';
import { cn } from '@/lib/utils';
import { 
  Sparkles, 
  Clock, 
  Heart,
  ChevronRight,
  Lock,
  X,
  ArrowLeft,
} from 'lucide-react';
import type { Ritual } from '@/lib/types';

export function RitualsModal() {
  const { 
    showRituals, 
    setShowRituals, 
    rituals, 
    favoriteRituals,
    toggleFavoriteRitual,
    user,
    setShowPaywall,
    setPaywallContext,
  } = useAppStore();
  
  const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null);
  
  const isPro = user?.plan === 'pro';
  const isBasico = user?.plan === 'basico';
  
  const canAccessRitual = (ritual: Ritual) => {
    if (!ritual.esPro) return true;
    if (isPro) return true;
    return false;
  };
  
  const handleRitualClick = (ritual: Ritual) => {
    if (!canAccessRitual(ritual)) {
      setPaywallContext(`El ritual "${ritual.titulo}" requiere plan Pro para desbloquearlo.`);
      setShowPaywall(true);
      return;
    }
    setSelectedRitual(ritual);
  };
  
  const handleClose = () => {
    setShowRituals(false);
    setTimeout(() => setSelectedRitual(null), 300);
  };

  return (
    <Dialog open={showRituals} onOpenChange={(open) => {
      if (!open) handleClose();
    }}>
      <DialogContent className="bg-background border-border max-w-md mx-4 max-h-[85vh] overflow-y-auto" showCloseButton={!selectedRitual}>
        {!selectedRitual ? (
          <>
            <DialogHeader className="text-center space-y-2">
              <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <DialogTitle className="font-serif text-2xl text-foreground">
                Rituales Piscis
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Practicas disenadas para tu energia unica
              </p>
            </DialogHeader>

            <div className="space-y-3 mt-4">
              {rituals.map((ritual) => {
                const canAccess = canAccessRitual(ritual);
                const isFavorite = favoriteRituals.includes(ritual.id);
                
                return (
                  <button
                    key={ritual.id}
                    onClick={() => handleRitualClick(ritual)}
                    className={cn(
                      'w-full p-4 rounded-xl border text-left transition-all',
                      canAccess 
                        ? 'bg-card hover:border-primary/50' 
                        : 'bg-muted/30 border-border'
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={cn(
                            'font-medium',
                            canAccess ? 'text-foreground' : 'text-muted-foreground'
                          )}>
                            {ritual.titulo}
                          </h3>
                          {ritual.esPro && !isPro && (
                            <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {ritual.descripcion}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {ritual.duracion}
                          </span>
                          {isFavorite && (
                            <span className="flex items-center gap-1 text-xs text-primary">
                              <Heart className="w-3 h-3 fill-primary" />
                              Favorito
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className={cn(
                        'w-5 h-5 shrink-0 mt-1',
                        canAccess ? 'text-muted-foreground' : 'text-muted-foreground/50'
                      )} />
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
                onClick={() => setSelectedRitual(null)}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex-1">
                <h2 className="font-serif text-xl text-foreground">{selectedRitual.titulo}</h2>
                <p className="text-xs text-muted-foreground">{selectedRitual.duracion}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => toggleFavoriteRitual(selectedRitual.id)}
              >
                <Heart className={cn(
                  'w-5 h-5',
                  favoriteRituals.includes(selectedRitual.id) 
                    ? 'fill-primary text-primary' 
                    : 'text-muted-foreground'
                )} />
              </Button>
            </div>
            
            <PiscisCard variant="glow" className="bg-primary/5">
              <p className="text-sm text-muted-foreground italic">
                {selectedRitual.beneficio}
              </p>
            </PiscisCard>
            
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-foreground text-sm leading-relaxed">
                {selectedRitual.contenido}
              </div>
            </div>
            
            <Button 
              className="w-full mt-4"
              onClick={handleClose}
            >
              Completar ritual
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
