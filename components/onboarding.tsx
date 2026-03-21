'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAppStore, createUserFromOnboarding } from '@/lib/store';
import { useAuth } from '@/components/auth-provider';
import { createClient } from '@/lib/supabase/client';
import type { Objective, GuideTone, Plan } from '@/lib/types';
import { StarField } from '@/components/pisces-symbol';
import { Logo } from '@/components/logo';
import { CategoryCard } from '@/components/emotion-chip';
import { Switch } from '@/components/ui/switch';
import { StripeCheckout } from '@/components/stripe-checkout';
import { saveSubscriptionToDatabase, getCheckoutSessionStatus } from '@/app/actions/stripe';
import { 
  ChevronRight, 
  Crown, 
  Infinity, 
  Bell, 
  BarChart3, 
  Sparkles, 
  Compass, 
  Users,
  CreditCard,
  Shield,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';

const STEPS = [
  'welcome',
  'preferences',
  'data',
  'reminders',
  'plan',
  'checkout',
  'success',
] as const;

type Step = typeof STEPS[number];

export function Onboarding() {
  const { setShowOnboarding, setUser } = useAppStore();
  const { user: authUser, refreshProfile } = useAuth();
  const supabase = createClient();
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
  
  // Plan
  const [selectedPlan, setSelectedPlan] = useState<'basico' | 'pro'>('pro');

  const stepIndex = STEPS.indexOf(currentStep);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const nextStep = () => {
    const nextIndex = stepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex]);
    }
  };
  
  const prevStep = () => {
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex]);
    }
  };

  const handlePaymentComplete = async (sessionId?: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      let stripeCustomerId = null;
      let stripeSubscriptionId = null;
      
      // Get Stripe session details
      if (sessionId) {
        const sessionStatus = await getCheckoutSessionStatus(sessionId);
        stripeCustomerId = sessionStatus.customerId;
        stripeSubscriptionId = sessionStatus.subscriptionId;
      }
      
      // Save to Supabase
      if (authUser) {
        // Save subscription data
        await saveSubscriptionToDatabase({
          userId: authUser.id,
          plan: selectedPlan,
          stripeCustomerId,
          stripeSubscriptionId,
        });
        
        // Save profile data
        await supabase
          .from('profiles')
          .update({
            nombre: 'Piscis',
            fecha_nacimiento: fechaNacimiento || null,
            hora_nacimiento: horaNacimiento || null,
            ciudad: ciudad || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', authUser.id);
        
        await refreshProfile();
      }
      
      // Update local store
      const user = createUserFromOnboarding({
        objetivo,
        tono,
        checkIn,
        pausa,
        fechaNacimiento: fechaNacimiento || undefined,
        horaNacimiento: horaNacimiento || undefined,
        ciudad: ciudad || undefined,
        plan: selectedPlan,
      });
      setUser(user);
      
      // Show success
      setCurrentStep('success');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Still show success since Stripe already processed
      setCurrentStep('success');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFinish = () => {
    setShowOnboarding(false);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col constellation-bg">
      <StarField />
      
      {/* Progress */}
      {currentStep !== 'welcome' && currentStep !== 'success' && (
        <div className="px-6 pt-6">
          <Progress value={progress} className="h-1 bg-muted/30" />
        </div>
      )}
      
      {/* Back button */}
      {['preferences', 'data', 'reminders', 'plan'].includes(currentStep) && (
        <button 
          onClick={prevStep}
          className="absolute top-6 left-4 p-2 text-muted-foreground hover:text-foreground z-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
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
        
        {currentStep === 'plan' && (
          <PlanStep
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
            onNext={nextStep}
          />
        )}
        
        {currentStep === 'checkout' && (
          <CheckoutStep
            selectedPlan={selectedPlan}
            onComplete={handlePaymentComplete}
            onBack={prevStep}
          />
        )}
        
        {currentStep === 'success' && (
          <SuccessStep
            selectedPlan={selectedPlan}
            onFinish={handleFinish}
          />
        )}
      </div>
    </div>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-12 text-center">
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

function PlanStep({
  selectedPlan,
  setSelectedPlan,
  onNext,
}: {
  selectedPlan: 'basico' | 'pro';
  setSelectedPlan: (p: 'basico' | 'pro') => void;
  onNext: () => void;
}) {
  const BASICO_FEATURES = [
    { icon: Compass, label: '10 decisiones al mes' },
    { icon: Sparkles, label: '5 rituales desbloqueados' },
    { icon: Users, label: 'Acceso a la comunidad' },
  ];
  
  const PRO_FEATURES = [
    { icon: Infinity, label: 'Decisiones ilimitadas' },
    { icon: Sparkles, label: 'Todos los rituales' },
    { icon: Bell, label: 'Chat con Mentor Espiritual' },
    { icon: BarChart3, label: 'Reportes semanales' },
  ];

  return (
    <div className="px-6 py-8">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
          <Crown className="w-8 h-8 text-primary" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
          Elige tu plan
        </h2>
        <p className="text-muted-foreground">
          7 dias gratis. Cancela cuando quieras.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-3 mb-6">
        {/* Basico */}
        <button
          onClick={() => setSelectedPlan('basico')}
          className={cn(
            'p-4 rounded-xl border text-left transition-all',
            selectedPlan === 'basico'
              ? 'border-primary bg-primary/10'
              : 'border-border bg-muted/30 hover:border-primary/50'
          )}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="font-semibold text-foreground">Basico</div>
              <div className="text-xs text-muted-foreground">Para empezar</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-green-500 font-medium">7 dias gratis</div>
              <div className="text-xl font-bold text-foreground">$79</div>
              <div className="text-xs text-muted-foreground">MXN/mes despues</div>
            </div>
          </div>
          <div className="space-y-1">
            {BASICO_FEATURES.map((f) => (
              <div key={f.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <f.icon className="w-3 h-3" />
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </button>
        
        {/* Pro */}
        <button
          onClick={() => setSelectedPlan('pro')}
          className={cn(
            'p-4 rounded-xl border text-left transition-all relative',
            selectedPlan === 'pro'
              ? 'border-primary bg-primary/10'
              : 'border-border bg-muted/30 hover:border-primary/50'
          )}
        >
          <div className="absolute -top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-medium">
            Recomendado
          </div>
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="font-semibold text-foreground flex items-center gap-1">
                Pro <Sparkles className="w-3 h-3 text-primary" />
              </div>
              <div className="text-xs text-muted-foreground">Experiencia completa</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-green-500 font-medium">7 dias gratis</div>
              <div className="text-xl font-bold text-foreground">$149</div>
              <div className="text-xs text-muted-foreground">MXN/mes despues</div>
            </div>
          </div>
          <div className="space-y-1">
            {PRO_FEATURES.map((f) => (
              <div key={f.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <f.icon className="w-3 h-3" />
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </button>
      </div>
      
      <Button 
        className="w-full h-12 text-base font-semibold"
        onClick={onNext}
      >
        <CreditCard className="w-5 h-5 mr-2" />
        Continuar al pago
      </Button>
      
      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
        <Shield className="w-4 h-4" />
        <span>Pago seguro. Cancela cuando quieras.</span>
      </div>
    </div>
  );
}

function CheckoutStep({
  selectedPlan,
  onComplete,
  onBack,
}: {
  selectedPlan: 'basico' | 'pro';
  onComplete: (sessionId?: string) => void;
  onBack: () => void;
}) {
  const productId = selectedPlan === 'pro' ? 'brujula-pro' : 'brujula-basico';
  const planName = selectedPlan === 'pro' ? 'Pro' : 'Basico';
  const price = selectedPlan === 'pro' ? '$149' : '$79';

  return (
    <div className="px-6 py-8">
      <div className="text-center mb-6">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
          Ingresa tu tarjeta
        </h2>
        <p className="text-muted-foreground">
          Plan {planName} - 7 dias gratis, luego {price} MXN/mes
        </p>
      </div>
      
      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 mb-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-green-700 dark:text-green-400 text-sm">
              No se te cobrara hoy
            </p>
            <p className="text-xs text-green-600 dark:text-green-500 mt-1">
              Tu prueba gratuita de 7 dias comienza ahora. Solo se cobrara despues si decides continuar.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-muted/30 rounded-xl p-4">
        <StripeCheckout 
          productId={productId}
          onComplete={onComplete}
        />
      </div>
      
      <button 
        onClick={onBack}
        className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground"
      >
        Cambiar plan
      </button>
    </div>
  );
}

function SuccessStep({
  selectedPlan,
  onFinish,
}: {
  selectedPlan: 'basico' | 'pro';
  onFinish: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-12 text-center">
      <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6 animate-float">
        <CheckCircle2 className="w-10 h-10 text-green-500" />
      </div>
      
      <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
        Tu prueba comienza ahora
      </h2>
      
      <p className="text-muted-foreground max-w-xs mb-2">
        Tienes 7 dias para explorar todas las funciones de Brujula {selectedPlan === 'pro' ? 'Pro' : 'Basico'}.
      </p>
      
      <p className="text-sm text-muted-foreground mb-8">
        Se te notificara antes de que termine tu prueba.
      </p>
      
      <div className="space-y-3 w-full max-w-xs">
        <Button 
          size="lg"
          className="w-full h-14 text-lg"
          onClick={onFinish}
        >
          Comenzar a usar Brujula
          <Sparkles className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
