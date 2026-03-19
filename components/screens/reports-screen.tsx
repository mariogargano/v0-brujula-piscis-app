'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { PiscisCard, PiscisCardHeader } from '@/components/piscis-card';
import { EMOTIONS_LABELS } from '@/lib/types';
import { 
  BarChart3, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb,
  Lock,
  Crown,
  ChevronRight,
  FileText
} from 'lucide-react';

export function ReportsScreen() {
  const { user, weeklyReports, decisions, setShowPaywall, setPaywallContext } = useAppStore();
  const isPro = user?.plan === 'pro'; // Only pro users get reports
  const [selectedReport, setSelectedReport] = useState<'weekly' | 'monthly' | null>(null);
  
  const handleReportClick = (type: 'weekly' | 'monthly') => {
    if (!isPro) {
      setPaywallContext(type === 'weekly' 
        ? 'Desbloquea reportes semanales con Pro' 
        : 'Los reportes mensuales están disponibles para usuarios Pro');
      setShowPaywall(true);
    } else {
      setSelectedReport(type);
    }
  };

  // Calculate some stats
  const totalDecisions = decisions.length;
  const savedDecisions = decisions.filter(d => d.guardada).length;
  
  return (
    <div className="px-4 py-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground mb-1">
          Reportes
        </h1>
        <p className="text-muted-foreground">
          Patrones y aprendizajes
        </p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <PiscisCard padding="sm">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              {totalDecisions}
            </div>
            <div className="text-sm text-muted-foreground">
              Decisiones totales
            </div>
          </div>
        </PiscisCard>
        
        <PiscisCard padding="sm">
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary mb-1">
              {savedDecisions}
            </div>
            <div className="text-sm text-muted-foreground">
              Guardadas
            </div>
          </div>
        </PiscisCard>
      </div>
      
      {/* Report Cards */}
      <div className="space-y-4">
        {/* Weekly Report */}
        <button
          onClick={() => handleReportClick('weekly')}
          className="w-full text-left"
        >
          <PiscisCard className={cn(
            "transition-all hover:border-primary/50",
            !isPro && "opacity-80"
          )}>
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center shrink-0",
                isPro ? "bg-primary/20" : "bg-muted/50"
              )}>
                {isPro ? (
                  <BarChart3 className="w-6 h-6 text-primary" />
                ) : (
                  <Lock className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">
                    Reporte semanal
                  </h3>
                  {!isPro && <Crown className="w-4 h-4 text-secondary" />}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Patrones, riesgos y recomendaciones
                </p>
              </div>
              
              <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
            </div>
          </PiscisCard>
        </button>
        
        {/* Monthly Report */}
        <button
          onClick={() => handleReportClick('monthly')}
          className="w-full text-left"
        >
          <PiscisCard className={cn(
            "transition-all hover:border-primary/50",
            !isPro && "opacity-80"
          )}>
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center shrink-0",
                isPro ? "bg-secondary/20" : "bg-muted/50"
              )}>
                {isPro ? (
                  <Calendar className="w-6 h-6 text-secondary" />
                ) : (
                  <Lock className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">
                    Reporte mensual
                  </h3>
                  <Crown className="w-4 h-4 text-secondary" />
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Análisis profundo + exportar PDF
                </p>
              </div>
              
              <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
            </div>
          </PiscisCard>
        </button>
      </div>
      
      {/* Pro CTA if not pro */}
      {!isPro && (
        <PiscisCard className="mt-6 bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary/30">
          <div className="text-center py-4">
            <Crown className="w-10 h-10 text-secondary mx-auto mb-3" />
            <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
              Descubre tus patrones
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Los reportes te muestran de dónde vienen tus decisiones y cómo mejorarlas
            </p>
            <Button 
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              onClick={() => {
                setPaywallContext('Desbloquea reportes semanales y mensuales');
                setShowPaywall(true);
              }}
            >
              Desbloquear reportes
            </Button>
          </div>
        </PiscisCard>
      )}
      
      {/* Weekly Report View */}
      {isPro && selectedReport === 'weekly' && weeklyReports.length > 0 && (
        <WeeklyReportView 
          report={weeklyReports[0]} 
          onClose={() => setSelectedReport(null)} 
        />
      )}
    </div>
  );
}

function WeeklyReportView({ 
  report, 
  onClose 
}: { 
  report: { 
    semana: string;
    decisiones: number;
    emocionDominante: string | null;
    urgenciaPromedio: number;
    mayorRiesgo: string;
    recomendacionClave: string;
    accionesSugeridas: string[];
  }; 
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      <div className="px-4 py-6 pb-24 max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">
              Reporte semanal
            </h1>
            <p className="text-sm text-muted-foreground">
              Semana del {new Date(report.semana).toLocaleDateString('es-MX', {
                day: 'numeric',
                month: 'long',
              })}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center"
          >
            <span className="text-foreground text-xl">&times;</span>
          </button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <PiscisCard padding="sm" className="text-center">
            <div className="text-2xl font-bold text-primary">{report.decisiones}</div>
            <div className="text-xs text-muted-foreground">Decisiones</div>
          </PiscisCard>
          
          <PiscisCard padding="sm" className="text-center">
            <div className="text-2xl font-bold text-warning">{report.urgenciaPromedio}</div>
            <div className="text-xs text-muted-foreground">Urgencia prom.</div>
          </PiscisCard>
          
          <PiscisCard padding="sm" className="text-center">
            <div className="text-lg font-bold text-secondary capitalize">
              {report.emocionDominante ? EMOTIONS_LABELS[report.emocionDominante as keyof typeof EMOTIONS_LABELS] : '-'}
            </div>
            <div className="text-xs text-muted-foreground">Emoción</div>
          </PiscisCard>
        </div>
        
        {/* Risk */}
        <PiscisCard className="mb-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                Tu mayor riesgo esta semana
              </h3>
              <p className="text-sm text-muted-foreground">
                {report.mayorRiesgo}
              </p>
            </div>
          </div>
        </PiscisCard>
        
        {/* Key Recommendation */}
        <PiscisCard className="mb-4 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                Recomendación clave
              </h3>
              <p className="text-sm text-foreground">
                {report.recomendacionClave}
              </p>
            </div>
          </div>
        </PiscisCard>
        
        {/* Actions */}
        <PiscisCard>
          <PiscisCardHeader title="3 acciones para esta semana" />
          <ol className="mt-3 space-y-3">
            {report.accionesSugeridas.map((accion, i) => (
              <li key={i} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">{i + 1}</span>
                </div>
                <span className="text-sm text-foreground">{accion}</span>
              </li>
            ))}
          </ol>
        </PiscisCard>
        
        <Button 
          variant="outline" 
          className="w-full mt-4 h-12"
          onClick={onClose}
        >
          Cerrar
        </Button>
      </div>
    </div>
  );
}
