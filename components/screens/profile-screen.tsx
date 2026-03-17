'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppStore } from '@/lib/store';
import { PiscisCard } from '@/components/piscis-card';
import { Logo } from '@/components/logo';
import { WhatsAppModal } from '@/components/whatsapp-modal';
import { OBJECTIVES_LABELS, PISCES_TIPOS, PISCES_TIPOS_DESCRIPTIONS } from '@/lib/types';
import type { GuideTone, Objective, PiscesTipo } from '@/lib/types';
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
  Share2,
  Gift,
  User,
  Edit3,
  Calendar,
  MapPin,
  Clock,
  MessageCircle,
  LogOut,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { ShareModal, useShare } from '@/components/share-modal';
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
    logout,
    resetHistory,
  } = useAppStore();
  
  const { signOut: authSignOut } = useAuth();
  
  const isPro = user?.plan === 'pro';
  const isBasico = user?.plan === 'basico';
  const [showPreferences, setShowPreferences] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const { isOpen: shareOpen, setIsOpen: setShareOpen, openShare } = useShare();
  
  const handleUpgrade = () => {
    setPaywallContext('Desbloquea todo el potencial de Brujula Piscis');
    setShowPaywall(true);
  };
  
  const handleResetHistory = () => {
    resetHistory();
  };
  
  const planLabel = user?.plan === 'pro' 
    ? 'Pro' 
    : user?.plan === 'basico' 
      ? 'Basico' 
      : 'Gratis';
      
  const planPrice = user?.plan === 'pro'
    ? '$149 MXN/mes'
    : user?.plan === 'basico'
      ? '$79 MXN/mes'
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
      {/* Header with Avatar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-primary" />
            )}
          </div>
          <button 
            onClick={() => setShowEditProfile(true)}
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex-1">
          <h1 className="font-serif text-xl font-bold text-foreground">
            {user?.nombre || 'Piscis'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {user?.piscesTipo ? PISCES_TIPOS_DESCRIPTIONS[user.piscesTipo] : 'Tu energia unica'}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className={cn(
              "text-xs px-2 py-0.5 rounded-full font-medium",
              isPro 
                ? "bg-primary/10 text-primary" 
                : isBasico
                  ? "bg-primary/5 text-primary"
                  : "bg-muted text-muted-foreground"
            )}>
              {planLabel}
            </span>
            {isPro && <Crown className="w-4 h-4 text-primary" />}
          </div>
        </div>
      </div>
      
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-card rounded-xl p-3 text-center border border-border">
          <div className="text-2xl font-bold text-foreground">{decisions.length}</div>
          <div className="text-xs text-muted-foreground">Decisiones</div>
        </div>
        <div className="bg-card rounded-xl p-3 text-center border border-border">
          <div className="text-2xl font-bold text-foreground">
            {user?.plan === 'free' ? `${Math.max(0, 1 - (user?.decisionesUsadasEstaSemana || 0))}/1` : 
             user?.plan === 'basico' ? `${Math.max(0, 10 - (user?.decisionesUsadasEstaSemana || 0))}/10` : 
             'Ilimitado'}
          </div>
          <div className="text-xs text-muted-foreground">
            {user?.plan === 'pro' ? 'Este mes' : 'Restantes'}
          </div>
        </div>
        <div className="bg-card rounded-xl p-3 text-center border border-border">
          <div className="text-2xl font-bold text-foreground">
            {decisions.filter(d => d.accionTomada).length}
          </div>
          <div className="text-xs text-muted-foreground">Completadas</div>
        </div>
      </div>
      
      {/* Subscription Card */}
      {!isPro && !isBasico ? (
        <PiscisCard className="mb-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <div className="flex items-center gap-4">
            <Crown className="w-10 h-10 text-primary shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">
                Desbloquea mas
              </h3>
              <p className="text-sm text-muted-foreground">
                Decisiones ilimitadas + Mentor Espiritual
              </p>
            </div>
            <Button 
              size="sm"
              onClick={handleUpgrade}
            >
              Ver planes
            </Button>
          </div>
        </PiscisCard>
      ) : (
        <PiscisCard className="mb-6 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">
                  Plan {planLabel}
                </h3>
                {isPro && <Crown className="w-4 h-4 text-primary" />}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {planPrice}
              </p>
            </div>
            {isBasico && (
              <Button variant="outline" size="sm" onClick={handleUpgrade}>
                Subir a Pro
              </Button>
            )}
            {isPro && (
              <Button variant="outline" size="sm">
                Gestionar
              </Button>
            )}
          </div>
        </PiscisCard>
      )}
      
      {/* WhatsApp Daily Messages */}
      <PiscisCard 
        variant="glow" 
        className="mb-4 bg-gradient-to-r from-green-500/5 to-green-600/5 border-green-500/20 cursor-pointer"
        onClick={() => setShowWhatsApp(true)}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">Mensajes diarios</h3>
            <p className="text-sm text-muted-foreground">
              {user?.whatsappNotificaciones 
                ? `Activo - ${user.horaNotificacion || '09:00'}` 
                : 'Recibe inspiracion por WhatsApp'}
            </p>
          </div>
          {user?.whatsappNotificaciones ? (
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
              <Check className="w-4 h-4 text-green-600" />
            </div>
          ) : (
            <ChevronRight className="w-5 h-5 text-green-600" />
          )}
        </div>
      </PiscisCard>
      
      {/* Share & Invite */}
      <PiscisCard 
        variant="glow" 
        className="mb-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20 cursor-pointer"
        onClick={openShare}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Gift className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">Invita a otros Piscis</h3>
            <p className="text-sm text-muted-foreground">
              Comparte Brujula Piscis
            </p>
          </div>
          <Share2 className="w-5 h-5 text-primary" />
        </div>
      </PiscisCard>
      
      {/* Settings List */}
      <div className="space-y-2">
        <SettingsItem 
          icon={User}
          label="Editar perfil"
          sublabel="Nombre, fecha de nacimiento, ciudad"
          onClick={() => setShowEditProfile(true)}
        />
        
        <SettingsItem 
          icon={BarChart3}
          label="Mis Reportes"
          sublabel={isPro ? "Ver reportes semanales" : "Pro - Desbloquear reportes"}
          locked={!isPro}
          onClick={() => {
            if (!isPro) {
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
          sublabel="Tus datos estan seguros"
          onClick={() => {}}
        />
        
        <SettingsItem 
          icon={HelpCircle}
          label="Soporte"
          sublabel="Necesitas ayuda?"
          onClick={() => setShowSupport(true)}
        />
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div>
              <SettingsItem 
                icon={LogOut}
                label="Cerrar sesion"
                sublabel="Salir de tu cuenta"
                onClick={() => {}}
                danger
              />
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-card border-border">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-foreground">
                Cerrar sesion?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Perderas tu progreso y configuraciones guardadas localmente.
                Tendras que volver a configurar tu perfil.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-border">Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  logout(); // Clear local state
                  authSignOut(); // Sign out from Supabase
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Cerrar sesion
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
          <AlertDialogContent className="bg-card border-border">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-foreground">
                Restablecer historial?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                Esta accion eliminara todas tus decisiones guardadas. No se puede deshacer.
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
      <div className="mt-8 text-center opacity-60">
        <Logo size="md" />
        <p className="text-xs text-muted-foreground mt-2">
          v1.0 - Guidance & Intuition
        </p>
      </div>
      
      {/* Modals */}
      <ShareModal open={shareOpen} onOpenChange={setShareOpen} />
      <WhatsAppModal open={showWhatsApp} onOpenChange={setShowWhatsApp} />
      <EditProfileModal 
        open={showEditProfile} 
        onOpenChange={setShowEditProfile}
        user={user}
        updateUser={updateUser}
      />
      
      {/* Support Modal */}
      <Dialog open={showSupport} onOpenChange={setShowSupport}>
        <DialogContent className="max-w-sm bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Centro de Soporte</DialogTitle>
            <DialogDescription>
              Estamos aqui para ayudarte
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            <a 
              href="mailto:soporte@brujulapiscis.com?subject=Ayuda%20con%20Brujula%20Piscis"
              className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Escribenos un email</p>
                <p className="text-sm text-muted-foreground">soporte@brujulapiscis.com</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </a>
            
            <a 
              href="https://wa.me/5215512345678?text=Hola,%20necesito%20ayuda%20con%20Brujula%20Piscis"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/20 hover:bg-green-500/10 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">WhatsApp</p>
                <p className="text-sm text-muted-foreground">Respuesta rapida</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </a>
          </div>
          
          <div className="pt-4 border-t border-border">
            <h4 className="text-sm font-medium text-foreground mb-2">Preguntas frecuentes</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>- Como cambio mi plan?</p>
              <p>- Mis datos estan seguros?</p>
              <p>- Como funciona el Mentor?</p>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => setShowSupport(false)}
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      </div>
  );
}

function SettingsItem({
  icon: Icon,
  label,
  sublabel,
  onClick,
  locked,
  danger,
}: {
  icon: typeof Settings;
  label: string;
  sublabel: string;
  onClick: () => void;
  locked?: boolean;
  danger?: boolean;
}) {
  return (
    <button onClick={onClick} className="w-full text-left">
      <PiscisCard 
        className={cn(
          "transition-colors",
          danger ? "hover:border-destructive/30" : "hover:border-primary/30"
        )} 
        padding="sm"
      >
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
            danger ? "bg-destructive/10" : "bg-primary/10"
          )}>
            <Icon className={cn("w-5 h-5", danger ? "text-destructive" : "text-primary")} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={cn("font-medium", danger ? "text-destructive" : "text-foreground")}>{label}</span>
              {locked && <Lock className="w-3 h-3 text-muted-foreground" />}
            </div>
            <p className={cn("text-sm truncate", danger ? "text-destructive/70" : "text-muted-foreground")}>{sublabel}</p>
          </div>
          <ChevronRight className={cn("w-5 h-5 shrink-0", danger ? "text-destructive/50" : "text-muted-foreground")} />
        </div>
      </PiscisCard>
    </button>
  );
}

function EditProfileModal({
  open,
  onOpenChange,
  user,
  updateUser,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  updateUser: (updates: any) => void;
}) {
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [fechaNacimiento, setFechaNacimiento] = useState(user?.fechaNacimiento || '');
  const [horaNacimiento, setHoraNacimiento] = useState(user?.horaNacimiento || '');
  const [ciudad, setCiudad] = useState(user?.ciudad || '');
  const [piscesTipo, setPiscesTipo] = useState<PiscesTipo | undefined>(user?.piscesTipo);
  const [saved, setSaved] = useState(false);
  
  const handleSave = () => {
    updateUser({
      nombre: nombre || undefined,
      fechaNacimiento: fechaNacimiento || undefined,
      horaNacimiento: horaNacimiento || undefined,
      ciudad: ciudad || undefined,
      piscesTipo,
      avatar: nombre ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${nombre}` : undefined,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onOpenChange(false);
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground font-serif">Editar perfil</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5 py-2">
          {/* Avatar Preview */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {nombre ? (
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${nombre}`} 
                  alt="Avatar preview" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <User className="w-10 h-10 text-primary" />
              )}
            </div>
          </div>
          
          {/* Nombre */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Tu nombre
            </label>
            <Input
              placeholder="Como te llamas?"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="bg-muted/30 border-border"
            />
          </div>
          
          {/* Tipo de Piscis */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Tipo de Piscis
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PISCES_TIPOS.map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => setPiscesTipo(tipo)}
                  className={cn(
                    'p-3 rounded-xl border text-left transition-all',
                    piscesTipo === tipo
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-muted/30 hover:border-primary/50'
                  )}
                >
                  <div className="font-medium text-foreground capitalize text-sm">{tipo}</div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {PISCES_TIPOS_DESCRIPTIONS[tipo]}
                  </p>
                </button>
              ))}
            </div>
          </div>
          
          {/* Fecha de Nacimiento */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Fecha de nacimiento
            </label>
            <Input
              type="date"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              className="bg-muted/30 border-border"
            />
          </div>
          
          {/* Hora de Nacimiento */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Hora de nacimiento (opcional)
            </label>
            <Input
              type="time"
              value={horaNacimiento}
              onChange={(e) => setHoraNacimiento(e.target.value)}
              className="bg-muted/30 border-border"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Para calculos astrologicos mas precisos
            </p>
          </div>
          
          {/* Ciudad */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Ciudad (opcional)
            </label>
            <Input
              placeholder="Ciudad de Mexico, Guadalajara..."
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              className="bg-muted/30 border-border"
            />
          </div>
        </div>
        
        <Button 
          className="w-full h-12 mt-2"
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
      </DialogContent>
    </Dialog>
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
    }, 800);
  };

  return (
    <div className="px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-foreground rotate-180" />
        </button>
        <h1 className="font-serif text-xl font-bold text-foreground">
          Preferencias
        </h1>
      </div>
      
      {/* Tono */}
      <div className="mb-6">
        <h3 className="font-medium text-foreground mb-3">Estilo de guia</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setTono('suave')}
            className={cn(
              'p-4 rounded-xl border text-center transition-all',
              tono === 'suave'
                ? 'border-primary bg-primary/10'
                : 'border-border bg-card hover:border-primary/50'
            )}
          >
            <div className="font-semibold text-foreground">Suave</div>
            <p className="text-xs text-muted-foreground mt-1">
              Empatica y gentil
            </p>
          </button>
          
          <button
            onClick={() => setTono('directo')}
            className={cn(
              'p-4 rounded-xl border text-center transition-all',
              tono === 'directo'
                ? 'border-primary bg-primary/10'
                : 'border-border bg-card hover:border-primary/50'
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
        <h3 className="font-medium text-foreground mb-3">Area principal</h3>
        <div className="space-y-2">
          {(['amor', 'dinero', 'bienestar', 'creatividad'] as Objective[]).map((obj) => (
            <button
              key={obj}
              onClick={() => setObjetivo(obj)}
              className={cn(
                'w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between',
                objetivo === obj
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-primary/50'
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
          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
            <div>
              <div className="text-foreground">Check-in diario</div>
              <p className="text-xs text-muted-foreground">
                Reflexion cada manana
              </p>
            </div>
            <Switch checked={checkIn} onCheckedChange={setCheckIn} />
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
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
