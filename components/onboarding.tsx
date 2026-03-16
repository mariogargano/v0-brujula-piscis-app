'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAppStore, createUserFromOnboarding } from '@/lib/store';
import type { Objective, GuideTone, Plan } from '@/lib/types';
import { StarField } from '@/components/pisces-symbol';
import { Logo } from '@/components/logo';
import { CategoryCard } from '@/components/emotion-chip';
import { Switch } from '@/components/ui/switch';
import { ChevronRight, Crown, Infinity, Bell, BarChart3, Sparkles } from 'lucide-react';

// Onboarding solo para Piscis - sin seleccion de signo
const STEPS = [
  'welcome',
  'preferences',
  'data',
  'reminders',
  'paywall',
] as const;

type Step = typeof STEPS[number];

export function Onboarding() {
  const { setShowOnboarding, setUser } = useAppStore();
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  
  // Preferences
  const [objetivo, setObjetivo] = useState<Objective>('amor');
  const [tono, setTono] = useState<GuideTone>('suave');
  
  // Data
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [horaNacimiento, setHoraNacimiento] = useState('');
  const [ciudad, setCiudad] = useState('');
  
  // Reminders
  const [checkIn, setCheckIn] = useState(true);
  const [pausa, setPausa] = useState(true);

  const stepIndex = STEPS.indexOf(currentStep);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const nextStep = () => {
    const nextIndex = stepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex]);
    }
  };

  const handleComplete = (plan: Plan) => {
    const user = createUserFromOnboarding({
      objetivo,
      tono,
      checkIn,
      pausa,
      fechaNacimiento: fechaNacimiento || undefined,
      horaNacimiento: horaNacimiento || undefined,
      ciudad: ciudad || undefined,
      plan,
    });
    setUser(user);
    setShowOnboarding(false);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col constellation-bg">
      <StarField />
      
      {/* Progress */}
      {currentStep !== 'welcome' && (
        <div className="px-6 pt-6">
          <Progress value={progress} className="h-1 bg-muted/30" />
        </div>
      )}
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {currentStep === 'welcome' && (
          <WelcomeStep onNext={nextStep} />
        )}
        
        {currentStep === 'preferences' && (
          <PreferencesStep
            objetivo={objetivo}
            setObjetivo={setObjetivo}
            tono={tono}
            setTono={setTono}
            onNext={nextStep}
          />
        )}
        
        {currentStep === 'data' && (
          <DataStep
            fechaNacimiento={fechaNacimiento}
            setFechaNacimiento={setFechaNacimiento}
            horaNacimiento={horaNacimiento}
            setHoraNacimiento={setHoraNacimiento}
            ciudad={ciudad}
            setCiudad={setCiudad}
            onNext={nextStep}
          />
        )}
        
        {currentStep === 'reminders' && (
          <RemindersStep
            checkIn={checkIn}
            setCheckIn={setCheckIn}
            pausa={pausa}
            setPausa={setPausa}
            onNext={nextStep}
          />
        )}
        
        {currentStep === 'paywall' && (
          <PaywallStep onComplete={handleComplete} />
        )}
      </div>
    </div>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-12 text-center">
      {/* Logo SVG sin fondo */}
      <div className="animate-float mb-4">
        <Logo size="xl" showText />
      </div>
      
      <p className="text-muted-foreground max-w-xs mb-8">
        Tu coach de decisiones disenado especialmente para Piscis.
        Claridad + accion, no prediccion absoluta.
      </p>

      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 mb-8 max-w-xs">
        <p className="text-sm text-primary font-medium">
          Esta app es exclusivamente para Piscis
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Disenada para entender tu energia unica
        </p>
      </div>
      
      <Button 
        size="lg" 
        className="w-full max-w-xs h-14 text-lg"
        onClick={onNext}
      >
        Soy Piscis, comenzar
        <ChevronRight className="w-5 h-5 ml-1" />
      </Button>
    </div>
  );
}

function PreferencesStep({
  objetivo,
  setObjetivo,
  tono,
  setTono,
  onNext,
}: {
  objetivo: Objective;
  setObjetivo: (o: Objective) => void;
  tono: GuideTone;
  setTono: (t: GuideTone) => void;
  onNext: () => void;
}) {
  return (
    <div className="px-6 py-8">
      <h2 className="font-serif text-2xl font-bold text-foreground mb-2 text-center">
        En que area necesitas mas claridad?
      </h2>
      <p className="text-muted-foreground text-center mb-6">
        Podemos ajustar esto despues
      </p>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        {(['amor', 'dinero', 'bienestar', 'creatividad'] as Objective[]).map((cat) => (
          <CategoryCard
            key={cat}
            category={cat}
            selected={objetivo === cat}
            onClick={() => setObjetivo(cat)}
          />
        ))}
      </div>
      
      <h3 className="font-serif text-lg font-semibold text-foreground mb-4 text-center">
        Como prefieres recibir la guia?
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setTono('suave')}
          className={cn(
            'p-4 rounded-xl border text-center transition-all min-h-[100px]',
            tono === 'suave'
              ? 'border-primary bg-primary/10'
              : 'border-border bg-muted/30 hover:border-primary/50'
          )}
        >
          <div className="font-semibold text-foreground mb-1">Suave</div>
          <p className="text-sm text-muted-foreground">
            Empatica y gentil
          </p>
        </button>
        
        <button
          onClick={() => setTono('directo')}
          className={cn(
            'p-4 rounded-xl border text-center transition-all min-h-[100px]',
            tono === 'directo'
              ? 'border-primary bg-primary/10'
              : 'border-border bg-muted/30 hover:border-primary/50'
          )}
        >
          <div className="font-semibold text-foreground mb-1">Directo</div>
          <p className="text-sm text-muted-foreground">
            Claro y sin rodeos
          </p>
        </button>
      </div>
      
      <Button 
        className="w-full mt-8 h-12"
        onClick={onNext}
      >
        Continuar
        <ChevronRight className="w-5 h-5 ml-1" />
      </Button>
    </div>
  );
}

function DataStep({
  fechaNacimiento,
  setFechaNacimiento,
  horaNacimiento,
  setHoraNacimiento,
  ciudad,
  setCiudad,
  onNext,
}: {
  fechaNacimiento: string;
  setFechaNacimiento: (v: string) => void;
  horaNacimiento: string;
  setHoraNacimiento: (v: string) => void;
  ciudad: string;
  setCiudad: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="px-6 py-8">
      <h2 className="font-serif text-2xl font-bold text-foreground mb-2 text-center">
        Datos opcionales
      </h2>
      <p className="text-muted-foreground text-center mb-8">
        Esto nos ayuda a personalizar mejor tu experiencia
      </p>
      
      <div className="space-y-5 max-w-sm mx-auto">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Fecha de nacimiento
          </label>
          <input
            type="date"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-border bg-muted/30 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Hora de nacimiento
          </label>
          <input
            type="time"
            value={horaNacimiento}
            onChange={(e) => setHoraNacimiento(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-border bg-muted/30 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Ciudad de nacimiento
          </label>
          <input
            type="text"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            placeholder="Ej: Ciudad de Mexico"
            className="w-full h-12 px-4 rounded-xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
      
      <div className="flex flex-col gap-3 mt-8">
        <Button 
          className="w-full h-12"
          onClick={onNext}
        >
          Continuar
          <ChevronRight className="w-5 h-5 ml-1" />
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full text-muted-foreground"
          onClick={onNext}
        >
          Omitir este paso
        </Button>
      </div>
    </div>
  );
}

function RemindersStep({
  checkIn,
  setCheckIn,
  pausa,
  setPausa,
  onNext,
}: {
  checkIn: boolean;
  setCheckIn: (v: boolean) => void;
  pausa: boolean;
  setPausa: (v: boolean) => void;
  onNext: () => void;
}) {
  return (
    <div className="px-6 py-8">
      <h2 className="font-serif text-2xl font-bold text-foreground mb-2 text-center">
        Configura tus recordatorios
      </h2>
      <p className="text-muted-foreground text-center mb-8">
        Te ayudaremos a mantener la claridad
      </p>
      
      <div className="space-y-4 max-w-sm mx-auto">
        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
          <div>
            <div className="font-medium text-foreground">Check-in diario</div>
            <p className="text-sm text-muted-foreground">
              Un momento de reflexion cada manana
            </p>
          </div>
          <Switch checked={checkIn} onCheckedChange={setCheckIn} />
        </div>
        
        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
          <div>
            <div className="font-medium text-foreground">Pausa antes de decidir</div>
            <p className="text-sm text-muted-foreground">
              Recordatorio para respirar antes de actuar
            </p>
          </div>
          <Switch checked={pausa} onCheckedChange={setPausa} />
        </div>
      </div>
      
      <Button 
        className="w-full mt-8 h-12"
        onClick={onNext}
      >
        Continuar
        <ChevronRight className="w-5 h-5 ml-1" />
      </Button>
    </div>
  );
}

function PaywallStep({ onComplete }: { onComplete: (plan: Plan) => void }) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  
  const FEATURES = [
    { icon: Infinity, label: 'Decisiones ilimitadas' },
    { icon: Bell, label: 'Recordatorios personalizados' },
    { icon: BarChart3, label: 'Reportes semanales' },
    { icon: Sparkles, label: 'Todos los rituales' },
  ];

  return (
    <div className="px-6 py-8">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
          <Crown className="w-8 h-8 text-primary" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
          Desbloquea tu claridad completa
        </h2>
        <p className="text-muted-foreground">
          Decisiones ilimitadas + reportes semanales
        </p>
      </div>
      
      <div className="space-y-3 mb-6">
        {FEATURES.map((feature) => (
          <div key={feature.label} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <feature.icon className="w-4 h-4 text-primary" />
            </div>
            <span className="text-foreground">{feature.label}</span>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => setSelectedPlan('monthly')}
          className={cn(
            'p-4 rounded-xl border text-left transition-all',
            selectedPlan === 'monthly'
              ? 'border-primary bg-primary/10'
              : 'border-border bg-muted/30 hover:border-primary/50'
          )}
        >
          <div className="font-semibold text-foreground">Mensual</div>
          <div className="text-2xl font-bold text-foreground mt-1">$99</div>
          <div className="text-xs text-muted-foreground">MXN/mes</div>
        </button>
        
        <button
          onClick={() => setSelectedPlan('annual')}
          className={cn(
            'p-4 rounded-xl border text-left transition-all relative',
            selectedPlan === 'annual'
              ? 'border-primary bg-primary/10'
              : 'border-border bg-muted/30 hover:border-primary/50'
          )}
        >
          <div className="absolute -top-2 right-2 bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full font-medium">
            -40%
          </div>
          <div className="font-semibold text-foreground">Anual</div>
          <div className="text-2xl font-bold text-foreground mt-1">$59</div>
          <div className="text-xs text-muted-foreground">MXN/mes</div>
        </button>
      </div>
      
      <div className="space-y-3">
        <Button 
          className="w-full h-12 text-base font-semibold"
          onClick={() => onComplete(selectedPlan === 'annual' ? 'pro_annual' : 'pro_monthly')}
        >
          Probar Pro 7 dias gratis
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full text-muted-foreground hover:text-foreground"
          onClick={() => onComplete('free')}
        >
          Continuar gratis
        </Button>
      </div>
      
      <p className="text-xs text-center text-muted-foreground mt-4">
        Cancela cuando quieras. Sin compromisos.
      </p>
    </div>
  );
}
