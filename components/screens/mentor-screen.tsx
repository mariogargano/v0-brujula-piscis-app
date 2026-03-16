'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { PiscisCard } from '@/components/piscis-card';
import { Button } from '@/components/ui/button';
import { 
  Send, 
  Lock, 
  Sparkles, 
  ArrowLeft,
  Crown,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  PHILOSOPHIES, 
  type PhilosophyType, 
  type MentorMessage 
} from '@/lib/types';

// Respuestas del mentor basadas en filosofía
const MENTOR_RESPONSES: Record<PhilosophyType, string[]> = {
  mindfulness: [
    "Respira profundo, Piscis. En este momento presente está toda la claridad que necesitas.",
    "Observa tus pensamientos sin juzgarlos. La respuesta ya está en ti, solo necesitas silencio para escucharla.",
    "¿Qué te dice tu cuerpo ahora mismo? A veces la sabiduría no está en la mente, sino en las sensaciones.",
  ],
  tarot: [
    "La Luna ilumina tu camino, Piscis. Como el arcano de los Peces, tu intuición es tu mayor don.",
    "El Colgado te recuerda: a veces la pausa es la acción más poderosa. Cambia tu perspectiva.",
    "La Estrella brilla para ti. Mantén la fe, la esperanza guía a quienes confían en el universo.",
  ],
  kabbalah: [
    "En el Árbol de la Vida, Piscis habita en Jesod - el fundamento de los sueños. Tus visiones son portales.",
    "Tikkun: tu propósito es reparar lo que tu alma vino a sanar. Esta decisión es parte de tu misión.",
    "El Ein Sof fluye a través de ti. En la incertidumbre, recuerda que eres parte del infinito.",
  ],
  astrologia: [
    "Con Neptuno como tu regente, la niebla es tu elemento natural. Pero hoy, Júpiter te da claridad.",
    "Tu carta natal sugiere que tu mayor don es la compasión. ¿Esta decisión honra tu naturaleza?",
    "Los tránsitos actuales favorecen la introspección. No es momento de acción externa, sino de trabajo interno.",
  ],
  numerologia: [
    "Tu número personal hoy vibra en el 7 - introspección y sabiduría. Escucha más, actúa menos.",
    "El 12 de Piscis (1+2=3) habla de creatividad. ¿Puedes encontrar una tercera opción creativa?",
    "Los ciclos de 9 días son clave para ti. ¿En qué fase de tu ciclo estás?",
  ],
  budismo: [
    "El sufrimiento viene del apego. ¿A qué resultado estás aferrado? Suelta y observa.",
    "El camino medio: ni extremo optimismo ni pesimismo. La verdad está en el centro.",
    "Impermanencia: esta situación, como todas, cambiará. ¿Qué decisión honra el flujo natural?",
  ],
  estoicismo: [
    "Distingue lo que está en tu control de lo que no. Enfoca tu energía solo en lo primero.",
    "Marco Aurelio diría: '¿Esto depende de mí o de otros?' Actúa solo donde tienes poder.",
    "El obstáculo es el camino. ¿Qué te está enseñando esta dificultad?",
  ],
  jung: [
    "Tu sombra tiene un mensaje. ¿Qué parte de ti niegas que esta situación está revelando?",
    "Los arquetipos hablan: ¿eres el héroe, el sabio o el inocente en esta historia?",
    "Sincronicidad: no hay coincidencias. ¿Qué patrones ves repetirse en tu vida?",
  ],
};

function generateMentorResponse(filosofia: PhilosophyType, userMessage: string): string {
  const responses = MENTOR_RESPONSES[filosofia];
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
}

export function MentorScreen() {
  const { user, setShowPaywall, setPaywallContext } = useAppStore();
  const [selectedPhilosophy, setSelectedPhilosophy] = useState<PhilosophyType | null>(null);
  const [messages, setMessages] = useState<MentorMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const isPro = user?.plan === 'pro';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSelectPhilosophy = (philosophy: PhilosophyType) => {
    const phil = PHILOSOPHIES.find(p => p.id === philosophy);
    if (phil?.esPro && !isPro) {
      setPaywallContext('Desbloquea el Mentor Espiritual con todas las filosofías');
      setShowPaywall(true);
      return;
    }
    setSelectedPhilosophy(philosophy);
    setMessages([{
      id: '1',
      tipo: 'mentor',
      contenido: `Bienvenido, alma Piscis. Soy tu guía desde la sabiduría de ${phil?.nombre}. ¿Qué situación te trae hoy? Cuéntame con confianza.`,
      timestamp: new Date().toISOString(),
      filosofia: philosophy,
    }]);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || !selectedPhilosophy) return;

    const userMessage: MentorMessage = {
      id: Date.now().toString(),
      tipo: 'user',
      contenido: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simular respuesta del mentor
    setTimeout(() => {
      const mentorResponse: MentorMessage = {
        id: (Date.now() + 1).toString(),
        tipo: 'mentor',
        contenido: generateMentorResponse(selectedPhilosophy, inputValue),
        timestamp: new Date().toISOString(),
        filosofia: selectedPhilosophy,
      };
      setMessages(prev => [...prev, mentorResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleBack = () => {
    setSelectedPhilosophy(null);
    setMessages([]);
  };

  if (!isPro) {
    return (
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-foreground">
              Mentor Espiritual
            </h1>
            <p className="text-muted-foreground">
              Tu guía personal basado en filosofías ancestrales
            </p>
          </div>

          <PiscisCard variant="glow" className="text-center">
            <Crown className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">
              Exclusivo para Piscis Pro
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Accede a sabiduría de Kabbalah, Tarot, Astrología, Numerología, Budismo, Estoicismo y más.
            </p>
            <Button 
              className="w-full"
              onClick={() => {
                setPaywallContext('Desbloquea el Mentor Espiritual con todas las filosofías');
                setShowPaywall(true);
              }}
            >
              Desbloquear Mentor Pro
            </Button>
          </PiscisCard>

          <div className="space-y-3">
            <h3 className="font-medium text-foreground">Filosofías disponibles en Pro:</h3>
            <div className="grid grid-cols-2 gap-3">
              {PHILOSOPHIES.map((phil) => (
                <div 
                  key={phil.id}
                  className="p-3 rounded-xl bg-muted/30 border border-border opacity-60"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{phil.icono}</span>
                    <span className="font-medium text-sm text-foreground">{phil.nombre}</span>
                    <Lock className="w-3 h-3 text-muted-foreground ml-auto" />
                  </div>
                  <p className="text-xs text-muted-foreground">{phil.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedPhilosophy) {
    return (
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mb-4 animate-pulse-glow">
              <Sparkles className="w-10 h-10 text-secondary" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-foreground">
              Mentor Espiritual
            </h1>
            <p className="text-muted-foreground">
              Elige una filosofía para tu consulta
            </p>
          </div>

          <div className="space-y-3">
            {PHILOSOPHIES.map((phil) => (
              <button
                key={phil.id}
                onClick={() => handleSelectPhilosophy(phil.id)}
                className="w-full text-left"
              >
                <PiscisCard 
                  className="hover:border-secondary/50 transition-all hover:bg-secondary/5"
                  padding="md"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center text-2xl shrink-0">
                      {phil.icono}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground">{phil.nombre}</div>
                      <p className="text-sm text-muted-foreground">{phil.descripcion}</p>
                    </div>
                    <MessageCircle className="w-5 h-5 text-muted-foreground shrink-0" />
                  </div>
                </PiscisCard>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentPhil = PHILOSOPHIES.find(p => p.id === selectedPhilosophy);

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-xl">
            {currentPhil?.icono}
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{currentPhil?.nombre}</h2>
            <p className="text-xs text-muted-foreground">Mentor Espiritual</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex',
              msg.tipo === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'max-w-[85%] p-4 rounded-2xl',
                msg.tipo === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-muted/50 border border-border rounded-bl-md'
              )}
            >
              <p className="text-sm leading-relaxed">{msg.contenido}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted/50 border border-border rounded-2xl rounded-bl-md p-4">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-background">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Escribe tu consulta..."
            className="flex-1 bg-muted/30 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-secondary transition-colors"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="h-auto px-4 bg-secondary hover:bg-secondary/90"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
