'use client';

import { PiscisCard, PiscisCardHeader } from '@/components/piscis-card';
import { Semaforo } from '@/components/semaforo';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { PiscesSymbol } from '@/components/pisces-symbol';
import { Compass, Sparkles, ChevronRight, Lock, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

// Daily data (would come from backend/algorithm in production)
function getDailyPulse() {
  const day = new Date().getDay();
  const pulses = [
    { energia: 'Alta pero dispersa', riesgo: 'Idealización activa', enfoque: 'Amor y conexiones' },
    { energia: 'Tranquila y reflexiva', riesgo: 'Evitación de decisiones', enfoque: 'Trabajo y metas' },
    { energia: 'Intuitiva y sensible', riesgo: 'Emociones intensas', enfoque: 'Bienestar personal' },
    { energia: 'Creativa y fluida', riesgo: 'Impulsos financieros', enfoque: 'Proyectos creativos' },
    { energia: 'Empática y conectada', riesgo: 'Absorber energías ajenas', enfoque: 'Relaciones' },
    { energia: 'Introspectiva', riesgo: 'Melancolía', enfoque: 'Autocuidado' },
    { energia: 'Renovada y optimista', riesgo: 'Prometer demasiado', enfoque: 'Planificación' },
  ];
  return pulses[day];
}

function getDailySemaforo(): { value: 'verde' | 'amarillo' | 'rojo'; explanation: string } {
  const hour = new Date().getHours();
  if (hour < 12) {
    return { 
      value: 'amarillo', 
      explanation: 'Hoy tu claridad llegará después del mediodía. No tomes decisiones importantes antes.' 
    };
  } else if (hour < 18) {
    return { 
      value: 'verde', 
      explanation: 'Tu mente está despejada. Buen momento para decisiones pequeñas.' 
    };
  }
  return { 
    value: 'amarillo', 
    explanation: 'La noche no es momento para decisiones grandes. Duerme y reevalúa mañana.' 
  };
}

function getDailyAnchor(): string {
  const anchors = [
    'Hoy, decide una sola cosa. Lo demás es ruido.',
    'Antes de actuar, pregúntate: ¿esto viene del miedo o del amor?',
    'No todo merece una respuesta inmediata.',
    'Tu intuición sabe más de lo que crees.',
    'Protege tu energía como protegerías a alguien que amas.',
    'El silencio también es una respuesta válida.',
    'Lo que es para ti, no te evita.',
  ];
  const day = new Date().getDate();
  return anchors[day % anchors.length];
}

export function HomeScreen() {
  const { user, setActiveTab, setShowPaywall, setPaywallContext } = useAppStore();
  const pulse = getDailyPulse();
  const semaforo = getDailySemaforo();
  const anchor = getDailyAnchor();
  const isPro = user?.plan !== 'free';
  
  const handleDecisionClick = () => {
    setActiveTab('decidir');
  };

  const handleUpgradeClick = () => {
    setPaywallContext('Desbloquea decisiones ilimitadas para nunca quedarte sin claridad');
    setShowPaywall(true);
  };

  return (
    <div className="px-4 py-6 space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <PiscesSymbol className="w-8 h-8" />
          <div>
            <h1 className="font-serif text-xl font-bold text-foreground">
              Buenos días, Piscis
            </h1>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('es-MX', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </p>
          </div>
        </div>
        {!isPro && (
          <button 
            onClick={handleUpgradeClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/20 text-secondary text-sm font-medium"
          >
            <Crown className="w-4 h-4" />
            Pro
          </button>
        )}
      </div>

      {/* Pulso de Piscis */}
      <PiscisCard variant="glass">
        <PiscisCardHeader 
          title="Pulso de Piscis hoy" 
          subtitle="Tu energía del día"
        />
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-foreground">
              <span className="text-muted-foreground">Energía:</span> {pulse.energia}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-warning" />
            <span className="text-foreground">
              <span className="text-muted-foreground">Riesgo:</span> {pulse.riesgo}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-secondary" />
            <span className="text-foreground">
              <span className="text-muted-foreground">Enfoque:</span> {pulse.enfoque}
            </span>
          </div>
        </div>
      </PiscisCard>

      {/* Semáforo del día */}
      <PiscisCard variant="glow">
        <PiscisCardHeader title="Semáforo del día" />
        <div className="mt-4 flex flex-col items-center">
          <Semaforo value={semaforo.value} size="lg" />
          <p className="text-sm text-muted-foreground mt-3 text-center">
            {semaforo.explanation}
          </p>
        </div>
      </PiscisCard>

      {/* Tu ancla */}
      <PiscisCard className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="font-serif font-semibold text-foreground mb-1">
              Tu ancla de hoy
            </h3>
            <p className="text-foreground italic">
              "{anchor}"
            </p>
          </div>
        </div>
      </PiscisCard>

      {/* CTA Principal */}
      <Button 
        className="w-full h-14 text-lg font-semibold gap-2"
        onClick={handleDecisionClick}
      >
        <Compass className="w-5 h-5" />
        Tengo una decisión
      </Button>

      {/* Gratis vs Pro */}
      <PiscisCard variant="default" padding="lg">
        <PiscisCardHeader title="Tu plan" />
        <div className="mt-4 grid grid-cols-2 gap-4">
          {/* Free column */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-muted-foreground">Gratis</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-foreground">
                <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs text-primary">1</span>
                </div>
                decisión/semana
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs text-primary">2</span>
                </div>
                rituales
              </div>
            </div>
          </div>
          
          {/* Pro column */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-secondary">Pro</span>
              <Crown className="w-3.5 h-3.5 text-secondary" />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-foreground">
                <Sparkles className="w-4 h-4 text-secondary" />
                Ilimitado
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <Sparkles className="w-4 h-4 text-secondary" />
                + Reportes + Todos los rituales
              </div>
            </div>
          </div>
        </div>
        
        {!isPro && (
          <Button 
            variant="outline" 
            className="w-full mt-4 border-secondary/50 text-secondary hover:bg-secondary/10"
            onClick={handleUpgradeClick}
          >
            Desbloquear Pro
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
        
        {isPro && (
          <div className="mt-4 p-3 rounded-lg bg-secondary/10 border border-secondary/30 text-center">
            <span className="text-secondary font-medium">Eres Pro</span>
          </div>
        )}
      </PiscisCard>
    </div>
  );
}
