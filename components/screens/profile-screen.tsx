'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAppStore } from '@/lib/store';
import { PiscisCard, PiscisCardHeader } from '@/components/piscis-card';
import { PiscesSymbol } from '@/components/pisces-symbol';
import { OBJECTIVES_LABELS } from '@/lib/types';
import type { GuideTone, Objective } from '@/lib/types';
import { 
  Crown, 
  ChevronRight, 
  Bell, 
  Shield, 
  HelpCircle, 
  Trash2,
  Settings,
  Check,
  BarChart3,
  Lock,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function ProfileScreen() {
  const { 
    user, 
    updateUser, 
    setShowPaywall, 
    setPaywallContext,
    decisions,
  } = useAppStore();
  
  const isPro = user?.plan !== 'free';
  const [showPreferences, setShowPreferences] = useState(false);
  
  const handleUpgrade = () => {
    setPaywallContext('Desbloquea todo el potencial de Brújula Piscis');
    setShowPaywall(true);
  };
  
  const handleResetHistory = () => {
    // In production, this would clear the decisions
    console.log('Resetting history...');
  };
  
  const planLabel = user?.plan === 'pro_annual' 
    ? 'Pro Anual' 
    : user?.plan === 'pro_monthly' 
      ? 'Pro Mensual' 
      : 'Gratis';

  if (showPreferences) {
    return (
      <PreferencesView 
        user={user}
        updateUser={updateUser}
        onBack={() => setShowPreferences(false)}
      />
    );
  }

  return (
    <div className="px-4 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
          <PiscesSymbol className="w-8 h-8" />
        </div>
        <div>
          <h1 className="font-serif text-xl font-bold text-foreground">
            Piscis
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={cn(
              "text-sm px-2 py-0.5 rounded-full",
              isPro 
                ? "bg-secondary/20 text-secondary" 
                : "bg-muted text-muted-foreground"
            )}>
              {planLabel}
            </span>
            {isPro && <Crown className="w-4 h-4 text-secondary" />}
          </div>
        </div>
      </div>
      
      {/* Subscription Card */}
      {!isPro ? (
        <PiscisCard className="mb-6 bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary/30">
          <div className="flex items-center gap-4">
            <Crown className="w-10 h-10 text-secondary shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">
                Desbloquea Pro
              </h3>
              <p className="text-sm text-muted-foreground">
                Decisiones ilimitadas + reportes
              </p>
            </div>
            <Button 
              size="sm" 
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              onClick={handleUpgrade}
            >
              Upgrade
            </Button>
          </div>
        </PiscisCard>
      ) : (
        <PiscisCard className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">
                Tu suscripción
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {user?.plan === 'pro_annual' ? '$59 MXN/mes (facturado anual)' : '$99 MXN/mes'}
              </p>
            </div>
            <Button variant="outline" size="sm">
              Gestionar
            </Button>
          </div>
        </PiscisCard>
      )}
      
      {/* Settings List */}
      <div className="space-y-2">
        <SettingsItem 
          icon={BarChart3}
          label="Mis Reportes"
          sublabel={isPro ? "Ver reportes semanales" : "Pro - Desbloquear reportes"}
          locked={!isPro}
          onClick={() => {
            if (isPro) {
              // Would navigate to reports
            } else {
              handleUpgrade();
            }
          }}
        />
        
        <SettingsItem 
          icon={Settings}
          label="Preferencias"
          sublabel={`${user?.tono === 'suave' ? 'Tono suave' : 'Tono directo'} | ${OBJECTIVES_LABELS[user?.objetivoPrincipal || 'amor']}`}
          onClick={() => setShowPreferences(true)}
        />
        
        <SettingsItem 
          icon={Bell}
          label="Notificaciones"
          sublabel={user?.recordatorioCheckIn ? 'Activadas' : 'Desactivadas'}
          onClick={() => setShowPreferences(true)}
        />
        
        <SettingsItem 
          icon={Shield}
          label="Privacidad"
          sublabel="Tus datos están seguros"
          onClick={() => {}}
        />
        
        <SettingsItem 
          icon={HelpCircle}
          label="Soporte"
          sublabel="¿Necesitas ayuda?"
          onClick={() => {}}
        />
      </div>
      
      {/* Danger Zone */}
      <div className="mt-8">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Zona de peligro
        </h3>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="w-full">
              <PiscisCard className="border-destructive/30 hover:border-destructive/50 transition-colors">
                <div className="flex items-center gap-3 text-destructive">
                  <Trash2 className="w-5 h-5" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">Restablecer historial</div>
                    <p className="text-sm text-destructive/70">
                      {decisions.length} decisiones guardadas
                    </p>
                  </div>
                </div>
              </PiscisCard>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-background border-border">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-foreground">
                ¿Restablecer historial?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                Esta acción eliminará todas tus decisiones guardadas. No se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-muted text-foreground">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction 
                className="bg-destructive text-white hover:bg-destructive/90"
                onClick={handleResetHistory}
              >
                Eliminar todo
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      {/* App Info */}
      <div className="mt-8 text-center">
        <PiscesSymbol className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p className="text-xs text-muted-foreground">
          Brújula Piscis v1.0
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Hecho con amor para Piscis
        </p>
      </div>
    </div>
  );
}

function SettingsItem({
  icon: Icon,
  label,
  sublabel,
  onClick,
  locked,
}: {
  icon: typeof Settings;
  label: string;
  sublabel: string;
  onClick: () => void;
  locked?: boolean;
}) {
  return (
    <button onClick={onClick} className="w-full text-left">
      <PiscisCard className="hover:border-primary/50 transition-colors" padding="sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{label}</span>
              {locked && <Lock className="w-3 h-3 text-muted-foreground" />}
            </div>
            <p className="text-sm text-muted-foreground truncate">{sublabel}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
        </div>
      </PiscisCard>
    </button>
  );
}

function PreferencesView({ 
  user, 
  updateUser, 
  onBack 
}: { 
  user: any; 
  updateUser: (updates: any) => void;
  onBack: () => void;
}) {
  const [tono, setTono] = useState<GuideTone>(user?.tono || 'suave');
  const [objetivo, setObjetivo] = useState<Objective>(user?.objetivoPrincipal || 'amor');
  const [checkIn, setCheckIn] = useState(user?.recordatorioCheckIn || false);
  const [pausa, setPausa] = useState(user?.recordatorioPausa || false);
  const [saved, setSaved] = useState(false);
  
  const handleSave = () => {
    updateUser({
      tono,
      objetivoPrincipal: objetivo,
      recordatorioCheckIn: checkIn,
      recordatorioPausa: pausa,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onBack();
    }, 1000);
  };

  return (
    <div className="px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center"
        >
          <span className="text-foreground">&larr;</span>
        </button>
        <h1 className="font-serif text-xl font-bold text-foreground">
          Preferencias
        </h1>
      </div>
      
      {/* Tono */}
      <div className="mb-6">
        <h3 className="font-medium text-foreground mb-3">Estilo de guía</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setTono('suave')}
            className={cn(
              'p-4 rounded-xl border text-center transition-all',
              tono === 'suave'
                ? 'border-primary bg-primary/10'
                : 'border-border bg-muted/30 hover:border-primary/50'
            )}
          >
            <div className="font-semibold text-foreground">Suave</div>
            <p className="text-xs text-muted-foreground mt-1">
              Empática y gentil
            </p>
          </button>
          
          <button
            onClick={() => setTono('directo')}
            className={cn(
              'p-4 rounded-xl border text-center transition-all',
              tono === 'directo'
                ? 'border-primary bg-primary/10'
                : 'border-border bg-muted/30 hover:border-primary/50'
            )}
          >
            <div className="font-semibold text-foreground">Directo</div>
            <p className="text-xs text-muted-foreground mt-1">
              Claro y sin rodeos
            </p>
          </button>
        </div>
      </div>
      
      {/* Objetivo */}
      <div className="mb-6">
        <h3 className="font-medium text-foreground mb-3">Área principal</h3>
        <div className="space-y-2">
          {(['amor', 'dinero', 'bienestar', 'creatividad'] as Objective[]).map((obj) => (
            <button
              key={obj}
              onClick={() => setObjetivo(obj)}
              className={cn(
                'w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between',
                objetivo === obj
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-muted/30 hover:border-primary/50'
              )}
            >
              <span className="text-foreground">{OBJECTIVES_LABELS[obj]}</span>
              {objetivo === obj && <Check className="w-5 h-5 text-primary" />}
            </button>
          ))}
        </div>
      </div>
      
      {/* Recordatorios */}
      <div className="mb-8">
        <h3 className="font-medium text-foreground mb-3">Recordatorios</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30">
            <div>
              <div className="text-foreground">Check-in diario</div>
              <p className="text-xs text-muted-foreground">
                Reflexión cada mañana
              </p>
            </div>
            <Switch checked={checkIn} onCheckedChange={setCheckIn} />
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30">
            <div>
              <div className="text-foreground">Pausa antes de decidir</div>
              <p className="text-xs text-muted-foreground">
                Respirar antes de actuar
              </p>
            </div>
            <Switch checked={pausa} onCheckedChange={setPausa} />
          </div>
        </div>
      </div>
      
      <Button 
        className="w-full h-12"
        onClick={handleSave}
      >
        {saved ? (
          <>
            <Check className="w-5 h-5 mr-2" />
            Guardado
          </>
        ) : (
          'Guardar cambios'
        )}
      </Button>
    </div>
  );
}
