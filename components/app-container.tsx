'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/components/auth-provider';
import { useSyncProfile } from '@/hooks/use-sync-profile';
import { BottomNav } from '@/components/bottom-nav';
import { Onboarding } from '@/components/onboarding';
import { PaywallModal } from '@/components/paywall-modal';
import { RitualsModal } from '@/components/rituals-modal';
import { HomeScreen } from '@/components/screens/home-screen';
import { DecisionScreen } from '@/components/screens/decision-screen';
import { CommunityScreen } from '@/components/screens/community-screen';
import { RitualsScreen } from '@/components/screens/rituals-screen';
import { ProfileScreen } from '@/components/screens/profile-screen';
import { MentorScreen } from '@/components/screens/mentor-screen';
import { StarField } from '@/components/pisces-symbol';

export function AppContainer() {
  const { profile } = useAuth();
  const { 
    showOnboarding, 
    activeTab, 
    initializeApp,
    user,
  } = useAppStore();
  
  // Sync Supabase profile with local store
  useSyncProfile();

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  // Show onboarding if user hasn't completed it (no name in profile)
  const needsOnboarding = !profile?.nombre || showOnboarding;
  
  if (needsOnboarding) {
    return <Onboarding />;
  }

  return (
    <div className="min-h-screen bg-background constellation-bg relative">
      <StarField className="opacity-30" />
      
      <main className="relative z-10 max-w-lg mx-auto">
        {activeTab === 'hoy' && <HomeScreen />}
        {activeTab === 'decidir' && <DecisionScreen />}
        {activeTab === 'mentor' && <MentorScreen />}
        {activeTab === 'comunidad' && <CommunityScreen />}
        {activeTab === 'perfil' && <ProfileScreen />}
      </main>
      
      <BottomNav />
      <PaywallModal />
      <RitualsModal />
    </div>
  );
}
