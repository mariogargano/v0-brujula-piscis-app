'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  UserProfile, 
  DecisionEntry, 
  Ritual, 
  WeeklyReport,
  Plan,
  Objective,
  GuideTone,
} from './types';
import { MOCK_RITUALS, MOCK_WEEKLY_REPORTS, MOCK_DECISIONS } from './mock-data';

interface AppState {
  // User
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  
  // Decisions
  decisions: DecisionEntry[];
  addDecision: (decision: DecisionEntry) => void;
  updateDecision: (id: string, updates: Partial<DecisionEntry>) => void;
  
  // Check weekly limit
  canMakeDecision: () => boolean;
  incrementDecisionCount: () => void;
  
  // Onboarding
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  
  // Paywall
  showPaywall: boolean;
  setShowPaywall: (show: boolean) => void;
  paywallContext: string;
  setPaywallContext: (context: string) => void;
  
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Rituals
  rituals: Ritual[];
  favoriteRituals: string[];
  toggleFavoriteRitual: (id: string) => void;
  
  // Reports
  weeklyReports: WeeklyReport[];
  
  // Initialize
  initializeApp: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: '1',
  objetivoPrincipal: 'amor',
  tono: 'suave',
  recordatorioCheckIn: true,
  recordatorioPausa: true,
  plan: 'free',
  decisionesUsadasEstaSemana: 0,
  ultimoResetSemanal: new Date().toISOString(),
  onboardingCompleto: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User
      user: null,
      setUser: (user) => set({ user }),
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
      })),
      
      // Decisions
      decisions: [],
      addDecision: (decision) => set((state) => ({
        decisions: [decision, ...state.decisions],
      })),
      updateDecision: (id, updates) => set((state) => ({
        decisions: state.decisions.map((d) =>
          d.id === id ? { ...d, ...updates } : d
        ),
      })),
      
      // Weekly limit check
      canMakeDecision: () => {
        const state = get();
        if (!state.user) return false;
        if (state.user.plan !== 'free') return true;
        
        // Check if week has reset
        const lastReset = new Date(state.user.ultimoResetSemanal);
        const now = new Date();
        const weekMs = 7 * 24 * 60 * 60 * 1000;
        
        if (now.getTime() - lastReset.getTime() > weekMs) {
          // Reset the counter
          set((s) => ({
            user: s.user ? {
              ...s.user,
              decisionesUsadasEstaSemana: 0,
              ultimoResetSemanal: now.toISOString(),
            } : null,
          }));
          return true;
        }
        
        return state.user.decisionesUsadasEstaSemana < 1;
      },
      
      incrementDecisionCount: () => set((state) => ({
        user: state.user ? {
          ...state.user,
          decisionesUsadasEstaSemana: state.user.decisionesUsadasEstaSemana + 1,
        } : null,
      })),
      
      // Onboarding
      showOnboarding: true,
      setShowOnboarding: (show) => set({ showOnboarding: show }),
      
      // Paywall
      showPaywall: false,
      setShowPaywall: (show) => set({ showPaywall: show }),
      paywallContext: '',
      setPaywallContext: (context) => set({ paywallContext: context }),
      
      // Navigation
      activeTab: 'hoy',
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      // Rituals
      rituals: MOCK_RITUALS,
      favoriteRituals: [],
      toggleFavoriteRitual: (id) => set((state) => ({
        favoriteRituals: state.favoriteRituals.includes(id)
          ? state.favoriteRituals.filter((r) => r !== id)
          : [...state.favoriteRituals, id],
      })),
      
      // Reports
      weeklyReports: MOCK_WEEKLY_REPORTS,
      
      // Initialize
      initializeApp: () => {
        const state = get();
        if (!state.user) {
          set({ 
            user: DEFAULT_USER,
            showOnboarding: true,
            decisions: MOCK_DECISIONS,
          });
        }
      },
    }),
    {
      name: 'brujula-piscis-storage',
      partialize: (state) => ({
        user: state.user,
        decisions: state.decisions,
        favoriteRituals: state.favoriteRituals,
        showOnboarding: state.showOnboarding,
      }),
    }
  )
);

// Helper to create onboarding user
export function createUserFromOnboarding(data: {
  objetivo: Objective;
  tono: GuideTone;
  checkIn: boolean;
  pausa: boolean;
  fechaNacimiento?: string;
  horaNacimiento?: string;
  ciudad?: string;
  plan: Plan;
}): UserProfile {
  return {
    id: crypto.randomUUID(),
    objetivoPrincipal: data.objetivo,
    tono: data.tono,
    recordatorioCheckIn: data.checkIn,
    recordatorioPausa: data.pausa,
    fechaNacimiento: data.fechaNacimiento,
    horaNacimiento: data.horaNacimiento,
    ciudad: data.ciudad,
    plan: data.plan,
    decisionesUsadasEstaSemana: 0,
    ultimoResetSemanal: new Date().toISOString(),
    onboardingCompleto: true,
  };
}
