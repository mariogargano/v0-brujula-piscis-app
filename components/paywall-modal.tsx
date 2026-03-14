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
import { Check, Sparkles, Infinity, Bell, BarChart3, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const FEATURES = [
  { icon: Infinity, label: 'Decisiones ilimitadas' },
  { icon: Bell, label: 'Recordatorios personalizados' },
  { icon: BarChart3, label: 'Reportes semanales' },
  { icon: Sparkles, label: 'Todos los rituales' },
];

export function PaywallModal() {
  const { showPaywall, setShowPaywall, paywallContext, updateUser } = useAppStore();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');

  const handleSubscribe = (plan: 'pro_monthly' | 'pro_annual') => {
    updateUser({ plan });
    setShowPaywall(false);
  };

  const handleContinueFree = () => {
    setShowPaywall(false);
  };

  return (
    <Dialog open={showPaywall} onOpenChange={setShowPaywall}>
      <DialogContent className="bg-background border-border max-w-md mx-4 max-h-[90vh] overflow-y-auto" showCloseButton={false}>
        <DialogHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-2">
            <Crown className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="font-serif text-2xl">
            Tu claridad no debería esperar
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {paywallContext || 'Desbloquea todo el poder de Brújula Piscis'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Features */}
          <div className="space-y-3">
            {FEATURES.map((feature) => (
              <div key={feature.label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <feature.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-foreground">{feature.label}</span>
              </div>
            ))}
          </div>

          {/* Plan Selection */}
          <div className="grid grid-cols-2 gap-3 mt-6">
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

          {/* CTA Buttons */}
          <div className="space-y-3 pt-2">
            <Button 
              className="w-full h-12 text-base font-semibold"
              onClick={() => handleSubscribe(selectedPlan === 'annual' ? 'pro_annual' : 'pro_monthly')}
            >
              {selectedPlan === 'annual' ? 'Probar Pro 7 días gratis' : 'Comenzar Pro'}
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full text-muted-foreground hover:text-foreground"
              onClick={handleContinueFree}
            >
              Continuar gratis
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Cancela cuando quieras. Sin compromisos.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
