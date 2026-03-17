'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppContainer } from '@/components/app-container';
import { useAuth } from '@/components/auth-provider';
import { Logo } from '@/components/logo';

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();

  console.log('[v0] Page: loading:', loading, 'user:', !!user);

  useEffect(() => {
    console.log('[v0] Page useEffect: loading:', loading, 'user:', !!user);
    if (!loading && !user) {
      console.log('[v0] Page: Redirecting to login');
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    console.log('[v0] Page: Showing loading spinner');
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Logo size="lg" />
        <div className="mt-6 flex items-center gap-2 text-muted-foreground">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Cargando...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <AppContainer />;
}
