'use client';

import { useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';
import { useAppStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';
import type { Plan, PiscesTipo } from '@/lib/types';

/**
 * Hook to sync Supabase profile with local store
 * This ensures the app works both online (with Supabase) and has local state for UI
 */
export function useSyncProfile() {
  const { profile, user } = useAuth();
  const { user: localUser, setUser, updateUser } = useAppStore();
  const supabase = createClient();
  
  // Sync Supabase profile to local store when it changes
  useEffect(() => {
    if (profile && user) {
      // Map Supabase profile to local UserProfile format
      const mappedUser = {
        id: profile.id,
        nombre: profile.nombre || undefined,
        piscesTipo: (profile.pisces_tipo as PiscesTipo) || undefined,
        fechaNacimiento: profile.fecha_nacimiento || undefined,
        horaNacimiento: profile.hora_nacimiento || undefined,
        ciudad: profile.ciudad || undefined,
        plan: (profile.plan as Plan) || 'free',
        decisionesUsadasEstaSemana: profile.decisiones_usadas_esta_semana ?? 0,
        ultimoResetSemanal: profile.ultimo_reset_semanal || new Date().toISOString(),
        onboardingCompleto: !!profile.nombre, // Consider onboarding complete if they have a name
        enComunidad: profile.en_comunidad || false,
        whatsapp: profile.whatsapp || undefined,
        whatsappNotificaciones: profile.whatsapp_notificaciones || false,
        horaNotificacion: profile.hora_notificacion || undefined,
        // These are local-only for now
        objetivoPrincipal: localUser?.objetivoPrincipal || 'amor',
        tono: localUser?.tono || 'suave',
        recordatorioCheckIn: localUser?.recordatorioCheckIn ?? true,
        recordatorioPausa: localUser?.recordatorioPausa ?? true,
      };
      
      setUser(mappedUser as any);
    }
  }, [profile, user]);
  
  // Function to update profile in Supabase
  const updateSupabaseProfile = async (updates: {
    nombre?: string;
    pisces_tipo?: string;
    fecha_nacimiento?: string;
    hora_nacimiento?: string;
    ciudad?: string;
    plan?: string;
    whatsapp?: string;
    whatsapp_notificaciones?: boolean;
    hora_notificacion?: string;
    decisiones_usadas_esta_semana?: number;
  }) => {
    if (!user) return { error: 'No user' };
    
    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);
    
    return { error };
  };
  
  // Function to upgrade plan in Supabase after payment
  const upgradePlan = async (plan: Plan) => {
    const { error } = await updateSupabaseProfile({ plan });
    if (!error) {
      updateUser({ plan });
    }
    return { error };
  };
  
  // Increment decision count
  const incrementDecisionUsage = async () => {
    if (!localUser) return;
    
    const newCount = (localUser.decisionesUsadasEstaSemana || 0) + 1;
    
    await updateSupabaseProfile({
      decisiones_usadas_esta_semana: newCount,
    });
    
    updateUser({ decisionesUsadasEstaSemana: newCount });
  };
  
  return {
    updateSupabaseProfile,
    upgradePlan,
    incrementDecisionUsage,
  };
}
