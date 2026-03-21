'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/components/auth-provider';
import { createClient } from '@/lib/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  MessageCircle, 
  Bell, 
  Clock, 
  Check,
  Sparkles,
  Heart,
  Star,
  Moon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WhatsAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EXAMPLE_MESSAGES = [
  {
    icon: Sparkles,
    text: "Buenos dias, Piscis. Hoy tu intuicion esta en su punto mas alto. Confia en esas corazonadas que te guian.",
  },
  {
    icon: Heart,
    text: "Recuerda, querido Piscis: tu sensibilidad es tu superpoder. Hoy es un buen dia para conectar con quienes amas.",
  },
  {
    icon: Star,
    text: "Las estrellas te favorecen hoy. Es momento de dar ese paso que has estado postergando.",
  },
  {
    icon: Moon,
    text: "Tu energia creativa fluye con fuerza. Deja que tu imaginacion te guie hacia nuevas posibilidades.",
  },
];

const NOTIFICATION_TIMES = [
  { value: '07:00', label: '7:00 AM - Despertar temprano' },
  { value: '08:00', label: '8:00 AM - Inicio del dia' },
  { value: '09:00', label: '9:00 AM - Manana tranquila' },
  { value: '12:00', label: '12:00 PM - Mediodia' },
  { value: '20:00', label: '8:00 PM - Reflexion nocturna' },
];

export function WhatsAppModal({ open, onOpenChange }: WhatsAppModalProps) {
  const { user, updateUser } = useAppStore();
  const { user: authUser, profile, refreshProfile } = useAuth();
  const supabase = createClient();
  
  const [whatsapp, setWhatsapp] = useState(profile?.whatsapp || user?.whatsapp || '');
  const [notificaciones, setNotificaciones] = useState(profile?.whatsapp_notificaciones || user?.whatsappNotificaciones || false);
  const [horaNotificacion, setHoraNotificacion] = useState(profile?.hora_notificacion || user?.horaNotificacion || '09:00');
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [currentExample, setCurrentExample] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setWhatsapp(profile?.whatsapp || user?.whatsapp || '');
      setNotificaciones(profile?.whatsapp_notificaciones || user?.whatsappNotificaciones || false);
      setHoraNotificacion(profile?.hora_notificacion || user?.horaNotificacion || '09:00');
      setStep('form');
    }
  }, [open, user, profile]);

  // Rotate example messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExample((prev) => (prev + 1) % EXAMPLE_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    return digits;
  };

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setWhatsapp(formatted);
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    
    const isActive = notificaciones && whatsapp.length >= 10;
    
    try {
      // Save to Supabase
      if (authUser) {
        await supabase
          .from('profiles')
          .update({
            whatsapp: whatsapp,
            whatsapp_notificaciones: isActive,
            hora_notificacion: horaNotificacion,
            updated_at: new Date().toISOString(),
          })
          .eq('id', authUser.id);
        
        await refreshProfile();
      }
      
      // Update local store
      updateUser({
        whatsapp: whatsapp,
        whatsappNotificaciones: isActive,
        horaNotificacion: horaNotificacion,
      });

      if (isActive) {
        // Register for notifications via API
        await fetch('/api/whatsapp/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: whatsapp,
            time: horaNotificacion,
            userId: authUser?.id,
          }),
        });
        setStep('success');
      } else {
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error saving WhatsApp settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const isValidPhone = whatsapp.length >= 10;
  const ExampleIcon = EXAMPLE_MESSAGES[currentExample].icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        {step === 'form' ? (
          <>
            <DialogHeader>
              <div className="mx-auto w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
                <MessageCircle className="w-7 h-7 text-green-500" />
              </div>
              <DialogTitle className="text-center text-xl">
                Mensajes diarios por WhatsApp
              </DialogTitle>
              <DialogDescription className="text-center">
                Recibe cada dia un mensaje personalizado para guiar tu energia Piscis
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Example Message Preview */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                    <ExampleIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-green-600 font-medium mb-1">Ejemplo de mensaje:</p>
                    <p className="text-sm text-green-800 leading-relaxed">
                      {EXAMPLE_MESSAGES[currentExample].text}
                    </p>
                  </div>
                </div>
                <div className="flex justify-center gap-1 mt-3">
                  {EXAMPLE_MESSAGES.map((_, i) => (
                    <div 
                      key={i}
                      className={cn(
                        "w-1.5 h-1.5 rounded-full transition-colors",
                        i === currentExample ? "bg-green-500" : "bg-green-200"
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Phone Input */}
              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-sm font-medium">
                  Numero de WhatsApp
                </Label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 bg-muted rounded-lg border border-input">
                    <span className="text-sm text-muted-foreground">+52</span>
                  </div>
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder="55 1234 5678"
                    value={whatsapp}
                    onChange={handleWhatsappChange}
                    className="flex-1"
                    maxLength={10}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Ingresa tu numero a 10 digitos sin codigo de pais
                </p>
              </div>

              {/* Notification Toggle */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Activar notificaciones</p>
                    <p className="text-xs text-muted-foreground">Recibe mensajes diarios</p>
                  </div>
                </div>
                <Switch
                  checked={notificaciones}
                  onCheckedChange={setNotificaciones}
                  disabled={!isValidPhone}
                />
              </div>

              {/* Time Selection */}
              {notificaciones && isValidPhone && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Hora de notificacion
                  </Label>
                  <div className="grid grid-cols-1 gap-2">
                    {NOTIFICATION_TIMES.map((time) => (
                      <button
                        key={time.value}
                        onClick={() => setHoraNotificacion(time.value)}
                        className={cn(
                          "p-3 rounded-lg border text-left text-sm transition-all",
                          horaNotificacion === time.value
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        {time.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button 
                className="flex-1"
                onClick={handleSave}
                disabled={notificaciones && !isValidPhone}
              >
                {notificaciones ? 'Activar mensajes' : 'Guardar'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <DialogTitle className="text-center text-xl">
                Listo, Piscis
              </DialogTitle>
              <DialogDescription className="text-center">
                Recibiras tu primer mensaje manana a las {
                  NOTIFICATION_TIMES.find(t => t.value === horaNotificacion)?.label.split(' - ')[0]
                }
              </DialogDescription>
            </DialogHeader>

            <div className="py-6">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">Tu numero registrado:</p>
                <p className="text-lg font-semibold text-foreground">+52 {whatsapp}</p>
              </div>
            </div>

            <Button 
              className="w-full"
              onClick={() => onOpenChange(false)}
            >
              Entendido
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
