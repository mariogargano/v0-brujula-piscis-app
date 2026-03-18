'use client';

import { useAppStore } from '@/lib/store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Crown, 
  ArrowLeft, 
  CheckCircle2,
  Check,
  Users,
  MessageCircle,
  BarChart3,
  Compass,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { StripeCheckout } from './stripe-checkout';

type PaywallStep = 'plans' | 'checkout' | 'success';
type SelectedPlan = 'basico' | 'pro';

const PLAN_BASICO = {
  id: 'brujula-basico',
  name: 'Basico',
  price: 79,
  trialDays: 7,
  features: [
    { icon: Compass, label: '10 decisiones al mes' },
    { icon: BookOpen, label: '5 rituales desbloqueados' },
    { icon: Users, label: 'Acceso a la comunidad' },
  ],
};

const PLAN_PRO = {
  id: 'brujula-pro',
  name: 'Pro',
  price: 149,
  trialDays: 7,
  features: [
    { icon: Compass, label: 'Decisiones ilimitadas' },
    { icon: Sparkles, label: 'Todos los rituales' },
    { icon: MessageCircle, label: 'Chat con Mentor Espiritual' },
    { icon: BookOpen, label: 'Kabbalah, Tarot, Astrologia y mas' },
    { icon: BarChart3, label: 'Reportes semanales y mensuales' },
    { icon: Users, label: 'Comunidad completa' },
  ],
};

export function PaywallModal() {
  const { showPaywall, setShowPaywall, paywallContext, updateUser } = useAppStore();
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan>('pro');
  const [step, setStep] = useState<PaywallStep>('plans');

  const handleProceedToCheckout = () => {
    setStep('checkout');
  };

  const handlePaymentComplete = () => {
    updateUser({ plan: selectedPlan });
    setStep('success');
  };

  const handleClose = () => {
    setShowPaywall(false);
    setTimeout(() => setStep('plans'), 300);
  };

  const getProductId = () => {
    return selectedPlan === 'pro' ? 'brujula-pro' : 'brujula-basico';
  };

  const currentPlanData = selectedPlan === 'pro' ? PLAN_PRO : PLAN_BASICO;

  return (
    <Dialog open={showPaywall} onOpenChange={(open) => {
      if (!open) handleClose();
    }}>
      <DialogContent 
        className="bg-background border-border max-w-md mx-4 max-h-[90vh] overflow-y-auto" 
        showCloseButton={step !== 'checkout'}
      >
        {step === 'plans' && (
          <>
            <DialogHeader className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Crown className="w-8 h-8 text-primary" />
              </div>
              <DialogTitle className="font-serif text-2xl text-foreground">
                Elige tu plan Piscis
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {paywallContext || 'Desbloquea todo el poder de Brujula Piscis'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {/* Plan Basico */}
              <button
                onClick={() => setSelectedPlan('basico')}
                className={cn(
                  'w-full p-4 rounded-xl border text-left transition-all',
                  selectedPlan === 'basico'
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-muted/30 hover:border-primary/50'
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-foreground text-lg">Basico</div>
                    <div className="text-muted-foreground text-sm">Para empezar tu camino</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-primary font-medium mb-1">7 dias gratis</div>
                    <div className="text-2xl font-bold text-foreground">$79</div>
                    <div className="text-xs text-muted-foreground">MXN/mes despues</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {PLAN_BASICO.features.map((feature) => (
                    <div key={feature.label} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-muted-foreground">{feature.label}</span>
                    </div>
                  ))}
                </div>
              </button>

              {/* Plan Pro */}
              <button
                onClick={() => setSelectedPlan('pro')}
                className={cn(
                  'w-full p-4 rounded-xl border text-left transition-all relative',
                  selectedPlan === 'pro'
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-muted/30 hover:border-primary/50'
                )}
              >
                <div className="absolute -top-2 right-3 bg-primary text-primary-foreground text-xs px-3 py-0.5 rounded-full font-semibold">
                  Recomendado
                </div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground text-lg">Pro</span>
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-muted-foreground text-sm">Experiencia completa</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-primary font-medium mb-1">7 dias gratis</div>
                    <div className="text-2xl font-bold text-foreground">$149</div>
                    <div className="text-xs text-muted-foreground">MXN/mes despues</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {PLAN_PRO.features.map((feature) => (
                    <div key={feature.label} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-muted-foreground">{feature.label}</span>
                    </div>
                  ))}
                </div>
              </button>

              {/* CTA Button */}
              <Button 
                className="w-full h-12 text-base font-semibold"
                onClick={handleProceedToCheckout}
              >
                Empezar 7 dias gratis
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full text-muted-foreground hover:text-foreground"
                onClick={handleClose}
              >
                Continuar gratis
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                7 dias gratis. Se requiere tarjeta. Cobro automatico despues del trial. Cancela cuando quieras.
              </p>
            </div>
          </>
        )}

        {step === 'checkout' && (
          <>
            <DialogHeader className="space-y-2">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setStep('plans')}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <DialogTitle className="font-serif text-xl text-foreground">
                  Completar suscripcion
                </DialogTitle>
              </div>
              <DialogDescription className="text-muted-foreground text-sm">
                Plan {currentPlanData.name} - 7 dias gratis, luego ${currentPlanData.price} MXN/mes
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4">
              <StripeCheckout 
                productId={getProductId()} 
                onComplete={handlePaymentComplete}
              />
            </div>
          </>
        )}

        {step === 'success' && (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto w-20 h-20 rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <DialogTitle className="font-serif text-2xl text-foreground">
              Tu prueba de 7 dias ha comenzado!
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {selectedPlan === 'pro' 
                ? 'Disfruta de acceso completo al Mentor Espiritual y todas las funciones Pro durante 7 dias.'
                : 'Disfruta de todas las funciones Basico durante 7 dias.'
              }
              <br />
              <span className="text-xs mt-2 block">
                Tu suscripcion se activara automaticamente el dia 8.
              </span>
            </DialogDescription>
            <Button 
              className="w-full h-12 mt-4"
              onClick={handleClose}
            >
              Comenzar a explorar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
