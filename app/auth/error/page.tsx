import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { AlertCircle } from 'lucide-react';

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6 text-center">
        <Logo size="md" />
        
        <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-foreground">Error de autenticacion</h1>
          <p className="mt-2 text-muted-foreground">
            Hubo un problema al procesar tu solicitud. Por favor intenta de nuevo.
          </p>
        </div>
        
        <div className="space-y-3">
          <Link href="/auth/login" className="block">
            <Button className="w-full">
              Volver al login
            </Button>
          </Link>
          <Link href="/" className="block">
            <Button variant="outline" className="w-full">
              Ir al inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
