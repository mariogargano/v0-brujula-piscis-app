'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import type { Ritual } from '@/lib/types';
import { PiscisCard, PiscisCardHeader } from '@/components/piscis-card';
import { 
  Sparkles, 
  Clock, 
  Heart, 
  Lock, 
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Crown
} from 'lucide-react';

export function RitualsScreen() {
  const { rituals, user, favoriteRituals, toggleFavoriteRitual, setShowPaywall, setPaywallContext } = useAppStore();
  const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null);
  const isPro = user?.plan === 'pro';
  const hasPaidPlan = user?.plan !== 'free'; // basico or pro
  
  const freeRituals = rituals.filter(r => !r.esPro);
  const proRituals = rituals.filter(r => r.esPro);
  
  const handleRitualClick = (ritual: Ritual) => {
    if (ritual.esPro && !isPro) {
      setPaywallContext('Desbloquea todos los rituales con Pro');
      setShowPaywall(true);
    } else {
      setSelectedRitual(ritual);
    }
  };
  
  if (selectedRitual) {
    return (
      <RitualDetail 
        ritual={selectedRitual} 
        onBack={() => setSelectedRitual(null)}
        isFavorite={favoriteRituals.includes(selectedRitual.id)}
        onToggleFavorite={() => toggleFavoriteRitual(selectedRitual.id)}
        isPro={isPro}
      />
    );
  }

  return (
    <div className="px-4 py-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground mb-1">
          Rituales
        </h1>
        <p className="text-muted-foreground">
          Herramientas para tu claridad
        </p>
      </div>
      
      {/* Free Rituals */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Disponibles
        </h2>
        <div className="space-y-3">
          {freeRituals.map((ritual) => (
            <RitualCard 
              key={ritual.id}
              ritual={ritual}
              onClick={() => handleRitualClick(ritual)}
              isFavorite={favoriteRituals.includes(ritual.id)}
            />
          ))}
        </div>
      </div>
      
      {/* Pro Rituals */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Pro
          </h2>
          <Crown className="w-4 h-4 text-secondary" />
        </div>
        <div className="space-y-3">
          {proRituals.map((ritual) => (
            <RitualCard 
              key={ritual.id}
              ritual={ritual}
              onClick={() => handleRitualClick(ritual)}
              isFavorite={favoriteRituals.includes(ritual.id)}
              locked={!isPro}
            />
          ))}
        </div>
      </div>
      
      {!isPro && (
        <PiscisCard className="mt-6 bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
              <Crown className="w-6 h-6 text-secondary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">
                {hasPaidPlan ? 'Actualiza a Pro' : 'Desbloquea todos los rituales'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {hasPaidPlan ? 'Accede a todos los rituales' : 'Nuevos rituales cada semana'}
              </p>
            </div>
            <Button 
              size="sm" 
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              onClick={() => {
                setPaywallContext('Accede a todos los rituales + nuevos cada semana');
                setShowPaywall(true);
              }}
            >
              Pro
            </Button>
          </div>
        </PiscisCard>
      )}
    </div>
  );
}

function RitualCard({ 
  ritual, 
  onClick, 
  isFavorite,
  locked = false,
}: { 
  ritual: Ritual; 
  onClick: () => void;
  isFavorite: boolean;
  locked?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left"
    >
      <PiscisCard className={cn(
        "transition-all hover:border-primary/50",
        locked && "opacity-80"
      )}>
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
            locked ? "bg-muted/50" : "bg-primary/20"
          )}>
            {locked ? (
              <Lock className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Sparkles className="w-5 h-5 text-primary" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {ritual.titulo}
            </h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {ritual.duracion}
              </span>
              <span className="truncate">{ritual.beneficio}</span>
            </div>
          </div>
          
          <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
        </div>
      </PiscisCard>
    </button>
  );
}

function RitualDetail({ 
  ritual, 
  onBack,
  isFavorite,
  onToggleFavorite,
  isPro,
}: { 
  ritual: Ritual; 
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isPro: boolean;
}) {
  const [isReading, setIsReading] = useState(false);
  
  return (
    <div className="px-4 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        
        {isPro && (
          <button 
            onClick={onToggleFavorite}
            className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center"
          >
            <Heart className={cn(
              "w-5 h-5 transition-colors",
              isFavorite ? "fill-destructive text-destructive" : "text-foreground"
            )} />
          </button>
        )}
      </div>
      
      {/* Content */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-10 h-10 text-primary" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
          {ritual.titulo}
        </h1>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {ritual.duracion}
          </span>
          <span>{ritual.tipo === 'audio' ? 'Audio' : 'Lectura'}</span>
        </div>
      </div>
      
      <PiscisCard className="mb-4">
        <p className="text-foreground">
          {ritual.descripcion}
        </p>
        <div className="mt-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
          <span className="text-sm text-primary font-medium">
            Beneficio: {ritual.beneficio}
          </span>
        </div>
      </PiscisCard>
      
      {!isReading ? (
        <Button 
          className="w-full h-14 text-lg gap-2"
          onClick={() => setIsReading(true)}
        >
          <Play className="w-5 h-5" />
          Comenzar ritual
        </Button>
      ) : (
        <div className="space-y-4">
          <PiscisCard variant="glow" padding="lg">
            <div className="prose prose-invert prose-sm max-w-none">
              {ritual.contenido.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-foreground leading-relaxed mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </PiscisCard>
          
          <Button 
            variant="outline"
            className="w-full h-12"
            onClick={() => setIsReading(false)}
          >
            Terminar
          </Button>
        </div>
      )}
    </div>
  );
}
