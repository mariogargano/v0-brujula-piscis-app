'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppStore } from '@/lib/store';
import { generateDecisionResult } from '@/lib/mock-data';
import type { Objective, Emotion, PersonalTendency, DecisionGoal, DecisionEntry } from '@/lib/types';
import { EMOTIONS_LABELS, TENDENCIES_LABELS, GOALS_LABELS } from '@/lib/types';
import { PiscisCard, PiscisCardHeader } from '@/components/piscis-card';
import { CategoryCard, EmotionChip, Chip } from '@/components/emotion-chip';
import { SemaforoDisplay } from '@/components/semaforo';
import { RiskBar } from '@/components/risk-bar';
import { 
  ChevronLeft, 
  ChevronRight, 
  Compass, 
  Save, 
  Bell, 
  RefreshCw,
  Plus,
  Copy,
  Check,
  History,
  AlertCircle
} from 'lucide-react';

type WizardStep = 'category' | 'text' | 'context' | 'goal' | 'result' | 'history';

export function DecisionScreen() {
  const { 
    user, 
    decisions, 
    addDecision, 
    canMakeDecision, 
    incrementDecisionCount,
    setShowPaywall,
    setPaywallContext,
  } = useAppStore();
  
  const [step, setStep] = useState<WizardStep>('category');
  const [showHistory, setShowHistory] = useState(false);
  
  // Wizard data
  const [categoria, setCategoria] = useState<Objective | null>(null);
  const [texto, setTexto] = useState('');
  const [urgencia, setUrgencia] = useState(5);
  const [emocion, setEmocion] = useState<Emotion | null>(null);
  const [tendencia, setTendencia] = useState<PersonalTendency | null>(null);
  const [objetivo, setObjetivo] = useState<DecisionGoal | null>(null);
  
  // Result
  const [result, setResult] = useState<DecisionEntry | null>(null);
  const [checkedQuestions, setCheckedQuestions] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  
  const isPro = user?.plan === 'pro';
  const isBasico = user?.plan === 'basico';
  
  const steps: WizardStep[] = ['category', 'text', 'context', 'goal', 'result'];
  const currentStepIndex = steps.indexOf(step);
  const progress = ((currentStepIndex + 1) / (steps.length)) * 100;
  
  const canProceed = () => {
    switch (step) {
      case 'category': return categoria !== null;
      case 'text': return texto.trim().length > 5;
      case 'context': return emocion !== null && tendencia !== null;
      case 'goal': return objetivo !== null;
      default: return true;
    }
  };
  
  const goBack = () => {
    if (currentStepIndex > 0) {
      setStep(steps[currentStepIndex - 1]);
    }
  };
  
  const goNext = () => {
    if (step === 'goal') {
      // Check if user can make decision
      if (!canMakeDecision()) {
        setPaywallContext('Has usado tu decisión gratuita de esta semana. Desbloquea Pro para decisiones ilimitadas.');
        setShowPaywall(true);
        return;
      }
      
      // Generate result
      const generatedResult = generateDecisionResult({
        categoria: categoria!,
        texto,
        urgencia,
        emocion: emocion!,
        tendencia: tendencia!,
        objetivo: objetivo!,
      });
      
      const newDecision: DecisionEntry = {
        id: crypto.randomUUID(),
        fecha: new Date().toISOString(),
        ...generatedResult,
        guardada: false,
      };
      
      setResult(newDecision);
      incrementDecisionCount();
      setStep('result');
    } else {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < steps.length) {
        setStep(steps[nextIndex]);
      }
    }
  };
  
  const handleSave = () => {
    if (result) {
      addDecision({ ...result, guardada: true });
    }
  };
  
  const handleCopyTemplate = () => {
    if (result?.plantillaTexto) {
      navigator.clipboard.writeText(result.plantillaTexto);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const handleNewDecision = () => {
    // Check limit again for new decision
    if (!canMakeDecision()) {
      setPaywallContext('Has usado tu decisión gratuita de esta semana. Desbloquea Pro para decisiones ilimitadas.');
      setShowPaywall(true);
      return;
    }
    
    setStep('category');
    setCategoria(null);
    setTexto('');
    setUrgencia(5);
    setEmocion(null);
    setTendencia(null);
    setObjetivo(null);
    setResult(null);
    setCheckedQuestions([]);
  };
  
  const toggleQuestion = (index: number) => {
    setCheckedQuestions(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  if (showHistory) {
    return (
      <HistoryView 
        decisions={decisions} 
        onBack={() => setShowHistory(false)} 
        isPro={isPro}
      />
    );
  }

  return (
    <div className="px-4 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {step !== 'category' && step !== 'result' && (
            <button 
              onClick={goBack}
              className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
          )}
          <div>
            <h1 className="font-serif text-xl font-bold text-foreground">
              {step === 'result' ? 'Tu guía' : 'Nueva decisión'}
            </h1>
            {step !== 'result' && (
              <p className="text-sm text-muted-foreground">
                Paso {currentStepIndex + 1} de {steps.length - 1}
              </p>
            )}
          </div>
        </div>
        
        <button 
          onClick={() => setShowHistory(true)}
          className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center"
        >
          <History className="w-5 h-5 text-foreground" />
        </button>
      </div>
      
      {/* Progress */}
      {step !== 'result' && (
        <Progress value={progress} className="h-1 mb-6 bg-muted/30" />
      )}
      
      {/* Step Content */}
      {step === 'category' && (
        <CategoryStep 
          selected={categoria} 
          onSelect={setCategoria}
          onNext={goNext}
          canProceed={canProceed()}
        />
      )}
      
      {step === 'text' && (
        <TextStep 
          value={texto}
          onChange={setTexto}
          categoria={categoria!}
          onNext={goNext}
          canProceed={canProceed()}
        />
      )}
      
      {step === 'context' && (
        <ContextStep 
          urgencia={urgencia}
          setUrgencia={setUrgencia}
          emocion={emocion}
          setEmocion={setEmocion}
          tendencia={tendencia}
          setTendencia={setTendencia}
          onNext={goNext}
          canProceed={canProceed()}
        />
      )}
      
      {step === 'goal' && (
        <GoalStep 
          selected={objetivo}
          onSelect={setObjetivo}
          onNext={goNext}
          canProceed={canProceed()}
        />
      )}
      
      {step === 'result' && result && (
        <ResultStep 
          result={result}
          checkedQuestions={checkedQuestions}
          toggleQuestion={toggleQuestion}
          onSave={handleSave}
          onCopyTemplate={handleCopyTemplate}
          copied={copied}
          onNewDecision={handleNewDecision}
          isPro={isPro}
          setShowPaywall={setShowPaywall}
          setPaywallContext={setPaywallContext}
        />
      )}
    </div>
  );
}

// Step Components

function CategoryStep({ 
  selected, 
  onSelect, 
  onNext,
  canProceed,
}: { 
  selected: Objective | null; 
  onSelect: (o: Objective) => void;
  onNext: () => void;
  canProceed: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
          ¿Sobre qué necesitas decidir?
        </h2>
        <p className="text-muted-foreground">
          Elige el área de tu decisión
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {(['amor', 'dinero', 'bienestar', 'creatividad'] as Objective[]).map((cat) => (
          <CategoryCard
            key={cat}
            category={cat}
            selected={selected === cat}
            onClick={() => onSelect(cat)}
          />
        ))}
      </div>
      
      <Button 
        className="w-full h-12 mt-4"
        disabled={!canProceed}
        onClick={onNext}
      >
        Continuar
        <ChevronRight className="w-5 h-5 ml-1" />
      </Button>
    </div>
  );
}

function TextStep({ 
  value, 
  onChange, 
  categoria,
  onNext,
  canProceed,
}: { 
  value: string; 
  onChange: (v: string) => void;
  categoria: Objective;
  onNext: () => void;
  canProceed: boolean;
}) {
  const placeholders: Record<Objective, string> = {
    amor: '¿Le escribo hoy o espero? ¿Le digo lo que siento?',
    dinero: '¿Acepto esta oferta de trabajo? ¿Hago esta compra?',
    bienestar: '¿Debería tomarme un descanso? ¿Pongo este límite?',
    creatividad: '¿Empiezo este proyecto? ¿Muestro mi trabajo?',
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
          Describe tu decisión
        </h2>
        <p className="text-muted-foreground">
          Sé específico/a para una mejor guía
        </p>
      </div>
      
      <div className="space-y-3">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholders[categoria]}
          rows={5}
          className="w-full p-4 rounded-xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-base"
        />
        <p className="text-xs text-muted-foreground text-right">
          {value.length} caracteres
        </p>
      </div>
      
      <Button 
        className="w-full h-12"
        disabled={!canProceed}
        onClick={onNext}
      >
        Continuar
        <ChevronRight className="w-5 h-5 ml-1" />
      </Button>
    </div>
  );
}

function ContextStep({ 
  urgencia,
  setUrgencia,
  emocion,
  setEmocion,
  tendencia,
  setTendencia,
  onNext,
  canProceed,
}: { 
  urgencia: number;
  setUrgencia: (v: number) => void;
  emocion: Emotion | null;
  setEmocion: (e: Emotion) => void;
  tendencia: PersonalTendency | null;
  setTendencia: (t: PersonalTendency) => void;
  onNext: () => void;
  canProceed: boolean;
}) {
  const emotions: Emotion[] = ['ansiedad', 'ilusion', 'nostalgia', 'culpa', 'enojo', 'confusion', 'calma'];
  const tendencies: PersonalTendency[] = ['idealizando', 'evitando', 'impulsivo', 'claro'];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
          Tu contexto ahora
        </h2>
        <p className="text-muted-foreground">
          Esto nos ayuda a darte mejor guía
        </p>
      </div>
      
      {/* Urgencia */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-medium text-foreground">Urgencia</span>
          <span className="text-primary font-semibold">{urgencia}/10</span>
        </div>
        <Slider
          value={[urgencia]}
          onValueChange={([v]) => setUrgencia(v)}
          min={1}
          max={10}
          step={1}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Puede esperar</span>
          <span>Muy urgente</span>
        </div>
      </div>
      
      {/* Emoción */}
      <div className="space-y-3">
        <span className="font-medium text-foreground">¿Qué emoción domina ahora?</span>
        <div className="flex flex-wrap gap-2">
          {emotions.map((e) => (
            <EmotionChip
              key={e}
              emotion={e}
              selected={emocion === e}
              onClick={() => setEmocion(e)}
            />
          ))}
        </div>
      </div>
      
      {/* Tendencia */}
      <div className="space-y-3">
        <span className="font-medium text-foreground">¿Cómo te sientes hoy?</span>
        <div className="flex flex-wrap gap-2">
          {tendencies.map((t) => (
            <Chip
              key={t}
              selected={tendencia === t}
              onClick={() => setTendencia(t)}
            >
              {TENDENCIES_LABELS[t]}
            </Chip>
          ))}
        </div>
      </div>
      
      <Button 
        className="w-full h-12"
        disabled={!canProceed}
        onClick={onNext}
      >
        Continuar
        <ChevronRight className="w-5 h-5 ml-1" />
      </Button>
    </div>
  );
}

function GoalStep({ 
  selected, 
  onSelect,
  onNext,
  canProceed,
}: { 
  selected: DecisionGoal | null; 
  onSelect: (g: DecisionGoal) => void;
  onNext: () => void;
  canProceed: boolean;
}) {
  const goals: DecisionGoal[] = ['paz', 'respuesta', 'cierre', 'avanzar', 'cuidarme', 'proteger'];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
          ¿Qué buscas realmente?
        </h2>
        <p className="text-muted-foreground">
          Sé honesto/a contigo
        </p>
      </div>
      
      <div className="flex flex-wrap gap-3 justify-center">
        {goals.map((g) => (
          <Chip
            key={g}
            selected={selected === g}
            onClick={() => onSelect(g)}
            className="text-base px-5 py-3"
          >
            {GOALS_LABELS[g]}
          </Chip>
        ))}
      </div>
      
      <Button 
        className="w-full h-12 mt-4"
        disabled={!canProceed}
        onClick={onNext}
      >
        <Compass className="w-5 h-5 mr-2" />
        Generar guía
      </Button>
    </div>
  );
}

function ResultStep({ 
  result,
  checkedQuestions,
  toggleQuestion,
  onSave,
  onCopyTemplate,
  copied,
  onNewDecision,
  isPro,
  setShowPaywall,
  setPaywallContext,
}: { 
  result: DecisionEntry;
  checkedQuestions: number[];
  toggleQuestion: (i: number) => void;
  onSave: () => void;
  onCopyTemplate: () => void;
  copied: boolean;
  onNewDecision: () => void;
  isPro: boolean;
  setShowPaywall: (show: boolean) => void;
  setPaywallContext: (context: string) => void;
}) {
  const handleProFeature = (feature: string) => {
    if (!isPro) {
      setPaywallContext(`Desbloquea "${feature}" con Pro`);
      setShowPaywall(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Dictamen */}
      <PiscisCard variant="glow" padding="lg">
        <h3 className="font-serif text-xl font-bold text-foreground mb-3">
          {result.dictamen}
        </h3>
        <SemaforoDisplay value={result.semaforo} />
      </PiscisCard>
      
      {/* Riesgo */}
      <PiscisCard>
        <RiskBar value={result.riesgo} />
      </PiscisCard>
      
      {/* Por qué */}
      <PiscisCard>
        <PiscisCardHeader title="Por qué" />
        <ul className="mt-3 space-y-2">
          {result.explicacion.map((exp, i) => (
            <li key={i} className="flex gap-2 text-sm text-foreground">
              <span className="text-primary shrink-0">•</span>
              {exp}
            </li>
          ))}
        </ul>
      </PiscisCard>
      
      {/* Preguntas de claridad */}
      <PiscisCard>
        <PiscisCardHeader 
          title="Preguntas de claridad" 
          subtitle="Responde mentalmente"
        />
        <div className="mt-3 space-y-3">
          {result.preguntasClaridad.map((q, i) => (
            <label 
              key={i} 
              className="flex items-start gap-3 cursor-pointer"
            >
              <Checkbox 
                checked={checkedQuestions.includes(i)}
                onCheckedChange={() => toggleQuestion(i)}
                className="mt-0.5"
              />
              <span className={cn(
                'text-sm transition-colors',
                checkedQuestions.includes(i) 
                  ? 'text-muted-foreground line-through' 
                  : 'text-foreground'
              )}>
                {q}
              </span>
            </label>
          ))}
        </div>
      </PiscisCard>
      
      {/* Plan de 3 pasos */}
      <PiscisCard className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
        <PiscisCardHeader title="Tu plan de 3 pasos" />
        <ol className="mt-3 space-y-3">
          {result.plan3Pasos.map((paso, i) => (
            <li key={i} className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-primary">{i + 1}</span>
              </div>
              <span className="text-sm text-foreground">{paso}</span>
            </li>
          ))}
        </ol>
      </PiscisCard>
      
      {/* Plantilla de texto */}
      {result.plantillaTexto && (
        <PiscisCard>
          <PiscisCardHeader 
            title="Plantilla sugerida" 
            subtitle="Mensaje empático y con límites"
          />
          <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-border">
            <p className="text-sm text-foreground italic">
              "{result.plantillaTexto}"
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3 gap-2"
            onClick={onCopyTemplate}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copiado' : 'Copiar'}
          </Button>
        </PiscisCard>
      )}
      
      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          className="h-12 gap-2"
          onClick={onSave}
        >
          <Save className="w-4 h-4" />
          Guardar
        </Button>
        
        <Button 
          variant="outline" 
          className={cn(
            "h-12 gap-2",
            !isPro && "opacity-70"
          )}
          onClick={() => isPro ? null : handleProFeature('Recordatorios')}
        >
          <Bell className="w-4 h-4" />
          Recordatorio
          {!isPro && <AlertCircle className="w-3 h-3 text-secondary" />}
        </Button>
      </div>
      
      <Button 
        className="w-full h-12 gap-2"
        onClick={onNewDecision}
      >
        <Plus className="w-5 h-5" />
        Nueva decisión
      </Button>
    </div>
  );
}

function HistoryView({ 
  decisions, 
  onBack,
  isPro,
}: { 
  decisions: DecisionEntry[]; 
  onBack: () => void;
  isPro: boolean;
}) {
  const savedDecisions = decisions.filter(d => d.guardada);
  
  return (
    <div className="px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="font-serif text-xl font-bold text-foreground">
          Historial
        </h1>
      </div>
      
      {savedDecisions.length === 0 ? (
        <div className="text-center py-12">
          <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
            Aún no hay decisiones guardadas
          </h3>
          <p className="text-sm text-muted-foreground">
            Cuando guardes una decisión, aparecerá aquí
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {savedDecisions.map((decision) => (
            <PiscisCard key={decision.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">
                    {new Date(decision.fecha).toLocaleDateString('es-MX', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                  <p className="text-foreground line-clamp-2">
                    {decision.texto}
                  </p>
                  <p className="text-sm text-primary mt-1">
                    {decision.dictamen}
                  </p>
                </div>
                <div className={cn(
                  'w-3 h-3 rounded-full shrink-0 mt-1',
                  decision.semaforo === 'verde' && 'bg-success',
                  decision.semaforo === 'amarillo' && 'bg-warning',
                  decision.semaforo === 'rojo' && 'bg-destructive'
                )} />
              </div>
            </PiscisCard>
          ))}
        </div>
      )}
    </div>
  );
}
