'use client';

import { PiscisCard, PiscisCardHeader } from '@/components/piscis-card';
import { Semaforo } from '@/components/semaforo';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { Logo } from '@/components/logo';
import { Compass, Sparkles, ChevronRight, Crown, Users, MessageCircle } from 'lucide-react';
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
          <Logo size="sm" />
          <div>
            <h1 className="font-serif text-xl font-bold text-foreground">
              Buenos dias, Piscis
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
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

      {/* Mentor Card - Pro Feature */}
      <PiscisCard 
        variant="glow" 
        className="bg-gradient-to-br from-secondary/20 to-primary/10 border-secondary/40 cursor-pointer hover:border-secondary transition-colors"
        onClick={() => setActiveTab('mentor')}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-secondary/30 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">Mentor Espiritual</h3>
                {user?.plan !== 'pro' && (
                  <span className="text-[10px] bg-secondary/20 text-secondary px-1.5 py-0.5 rounded">PRO</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Kabbalah, Tarot, Astrologia y mas
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-secondary" />
        </div>
      </PiscisCard>

      {/* Comunidad Card */}
      <PiscisCard 
        variant="default" 
        className="cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => setActiveTab('comunidad')}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Comunidad Piscis</h3>
              <p className="text-xs text-muted-foreground">
                {user?.enComunidad ? 'Ver conversaciones' : 'Unete al cardumen'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>127 activos</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </PiscisCard>

      {/* Plan actual */}
      {user?.plan === 'free' && (
        <PiscisCard variant="default" padding="lg">
          <PiscisCardHeader title="Mejora tu experiencia" />
          <div className="mt-4 space-y-3">
            <div className="p-3 rounded-lg bg-muted/30 border border-border">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-foreground">Basico</span>
                <span className="text-primary font-bold">$79/mes</span>
              </div>
              <p className="text-xs text-muted-foreground">10 decisiones + Comunidad</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/30">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">Pro</span>
                  <Crown className="w-4 h-4 text-secondary" />
                </div>
                <span className="text-secondary font-bold">$149/mes</span>
              </div>
              <p className="text-xs text-muted-foreground">Ilimitado + Mentor Espiritual + Reportes</p>
            </div>
          </div>
          <Button 
            className="w-full mt-4 bg-secondary hover:bg-secondary/90"
            onClick={handleUpgradeClick}
          >
            Ver planes
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </PiscisCard>
      )}
      
      {user?.plan === 'basico' && (
        <PiscisCard variant="default" padding="lg" className="border-primary/30">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-muted-foreground">Tu plan</span>
              <h3 className="font-semibold text-foreground">Basico</h3>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="border-secondary/50 text-secondary"
              onClick={handleUpgradeClick}
            >
              Subir a Pro
            </Button>
          </div>
        </PiscisCard>
      )}
      
      {user?.plan === 'pro' && (
        <PiscisCard variant="glow" padding="lg" className="border-secondary/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
              <Crown className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Tu plan</span>
              <h3 className="font-semibold text-secondary">Piscis Pro</h3>
            </div>
          </div>
        </PiscisCard>
      )}
    </div>
  );
}
