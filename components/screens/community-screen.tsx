'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { PiscisCard } from '@/components/piscis-card';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { 
  Users, 
  MessageCircle, 
  Heart,
  Send,
  ArrowLeft,
  Crown,
  Lock,
  Sparkles,
  Check,
} from 'lucide-react';
import type { PiscesTipo, CommunityRoom, ChatMessage } from '@/lib/types';
import { PISCES_TIPOS_LABELS, PISCES_TIPOS_DESCRIPTIONS } from '@/lib/types';

// Join Community Modal
function JoinCommunityModal({ onJoin }: { onJoin: (nombre: string, tipo: PiscesTipo) => void }) {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<PiscesTipo | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  const tipos: PiscesTipo[] = ['soñador', 'intuitivo', 'creativo', 'empatico'];

  const handleContinue = () => {
    if (step === 1 && nombre.trim()) {
      setStep(2);
    } else if (step === 2 && tipo) {
      onJoin(nombre.trim(), tipo);
    }
  };

  return (
    <div className="min-h-screen px-5 py-8 flex flex-col">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Logo size="lg" />
        </div>
        <h1 className="font-serif text-2xl text-foreground mb-2">
          Únete al Cardumen
        </h1>
        <p className="text-muted-foreground text-sm">
          Conecta con otros Piscis que entienden tu profundidad
        </p>
      </div>

      {/* Progress */}
      <div className="flex gap-2 mb-8 max-w-xs mx-auto w-full">
        <div className={cn(
          "h-1 flex-1 rounded-full transition-colors",
          step >= 1 ? "bg-primary" : "bg-muted"
        )} />
        <div className={cn(
          "h-1 flex-1 rounded-full transition-colors",
          step >= 2 ? "bg-primary" : "bg-muted"
        )} />
      </div>

      <div className="flex-1 flex flex-col">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                ¿Cómo quieres que te llamen?
              </label>
              <Input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre o apodo"
                className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground text-base"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Puede ser tu nombre real o un nombre místico
              </p>
            </div>

            <PiscisCard variant="default" className="bg-muted/30">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-foreground font-medium mb-1">
                    Comunidad solo para Piscis
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Un espacio seguro donde todos entienden tu sensibilidad, tu intuición y tu forma de ver el mundo.
                  </p>
                </div>
              </div>
            </PiscisCard>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                ¿Qué tipo de Piscis eres?
              </label>
              <p className="text-xs text-muted-foreground mb-4">
                Esto ayuda a conectarte con Piscis afines
              </p>
            </div>

            <div className="grid gap-3">
              {tipos.map((t) => (
                <button
                  key={t}
                  onClick={() => setTipo(t)}
                  className={cn(
                    "p-4 rounded-xl border text-left transition-all",
                    tipo === t
                      ? "border-primary bg-primary/10"
                      : "border-border bg-muted/30 hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-foreground">
                      {PISCES_TIPOS_LABELS[t]}
                    </span>
                    {tipo === t && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {PISCES_TIPOS_DESCRIPTIONS[t]}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action */}
      <div className="mt-8">
        <Button
          onClick={handleContinue}
          disabled={step === 1 ? !nombre.trim() : !tipo}
          className="w-full h-12 bg-primary text-primary-foreground font-medium"
        >
          {step === 1 ? 'Continuar' : 'Unirme al Cardumen'}
        </Button>
      </div>
    </div>
  );
}

// Room List View
function RoomListView({ 
  rooms, 
  onSelectRoom,
  user,
}: { 
  rooms: CommunityRoom[];
  onSelectRoom: (room: CommunityRoom) => void;
  user: { plan: string };
}) {
  const { setPaywallContext, setShowPaywall } = useAppStore();
  const isPro = user.plan === 'pro';
  const hasPaidPlan = user.plan !== 'free'; // basico or pro - both have community access

  const handleRoomClick = (room: CommunityRoom) => {
    // Pro rooms require Pro plan, regular rooms available to all paid plans
    if (room.esPro && !isPro) {
      setPaywallContext('Accede a salas exclusivas de la comunidad');
      setShowPaywall(true);
    } else {
      onSelectRoom(room);
    }
  };

  return (
    <div className="space-y-3">
      {rooms.map((room) => {
        const isLocked = room.esPro && !isPro;
        
        return (
          <button
            key={room.id}
            onClick={() => handleRoomClick(room)}
            className={cn(
              "w-full p-4 rounded-xl border text-left transition-all",
              isLocked
                ? "border-border bg-muted/20 opacity-75"
                : "border-border bg-card hover:border-primary/50"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{room.icono}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-foreground truncate">
                    {room.nombre}
                  </span>
                  {room.esPro && (
                    <span className="shrink-0">
                      {isLocked ? (
                        <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                      ) : (
                        <Crown className="w-3.5 h-3.5 text-secondary" />
                      )}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {room.descripcion}
                </p>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                  <span>{room.miembrosActivos} activos</span>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// Chat View
function ChatView({ 
  room,
  messages,
  onBack,
  onSendMessage,
  onLikeMessage,
  currentUserId,
}: { 
  room: CommunityRoom;
  messages: ChatMessage[];
  onBack: () => void;
  onSendMessage: (message: string) => void;
  onLikeMessage: (messageId: string) => void;
  currentUserId: string;
}) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const roomMessages = messages.filter(m => m.roomId === room.id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomMessages.length]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
      inputRef.current?.focus();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="text-xl">{room.icono}</div>
        <div className="flex-1 min-w-0">
          <h2 className="font-medium text-foreground truncate">{room.nombre}</h2>
          <p className="text-xs text-muted-foreground">
            {room.miembrosActivos} Piscis activos
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {roomMessages.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              Sé el primero en iniciar la conversación
            </p>
          </div>
        ) : (
          roomMessages.map((msg) => {
            const isOwn = msg.autorId === currentUserId || msg.esPropio;
            
            return (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3",
                  isOwn && "flex-row-reverse"
                )}
              >
                {!isOwn && (
                  <img
                    src={msg.autorAvatar}
                    alt={msg.autorNombre}
                    className="w-8 h-8 rounded-full shrink-0"
                  />
                )}
                <div className={cn(
                  "max-w-[75%]",
                  isOwn && "text-right"
                )}>
                  {!isOwn && (
                    <p className="text-xs text-muted-foreground mb-1">
                      {msg.autorNombre}
                    </p>
                  )}
                  <div className={cn(
                    "inline-block p-3 rounded-2xl text-sm",
                    isOwn
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted/50 text-foreground rounded-bl-sm"
                  )}>
                    {msg.mensaje}
                  </div>
                  <div className={cn(
                    "flex items-center gap-2 mt-1",
                    isOwn ? "justify-end" : "justify-start"
                  )}>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(msg.timestamp)}
                    </span>
                    {!isOwn && (
                      <button
                        onClick={() => onLikeMessage(msg.id)}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Heart className={cn(
                          "w-3 h-3",
                          msg.likes > 0 && "fill-destructive text-destructive"
                        )} />
                        {msg.likes > 0 && msg.likes}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu mensaje..."
            className="flex-1 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground text-base"
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            size="icon"
            className="shrink-0 bg-primary text-primary-foreground h-10 w-10"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Main Community Screen
export function CommunityScreen() {
  const { 
    user, 
    communityRooms, 
    chatMessages, 
    activeCommunityRoom,
    setActiveCommunityRoom,
    addChatMessage,
    likeChatMessage,
    joinCommunity,
  } = useAppStore();

  const [activeRoom, setActiveRoom] = useState<CommunityRoom | null>(null);

  // Check if user has joined community
  if (!user?.enComunidad) {
    return (
      <JoinCommunityModal 
        onJoin={(nombre, tipo) => joinCommunity(nombre, tipo)} 
      />
    );
  }

  // If a room is selected, show chat
  if (activeRoom) {
    return (
      <ChatView
        room={activeRoom}
        messages={chatMessages}
        onBack={() => setActiveRoom(null)}
        onSendMessage={(message) => {
          const newMsg: ChatMessage = {
            id: crypto.randomUUID(),
            autorId: user.id,
            autorNombre: user.nombre || 'Piscis Anónimo',
            autorAvatar: user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anon',
            mensaje: message,
            timestamp: new Date().toISOString(),
            likes: 0,
            esPropio: true,
            roomId: activeRoom.id,
          };
          addChatMessage(newMsg);
        }}
        onLikeMessage={likeChatMessage}
        currentUserId={user.id}
      />
    );
  }

  // Room list view
  return (
    <div className="px-5 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-foreground">Comunidad</h1>
          <p className="text-sm text-muted-foreground">
            Hola, {user.nombre || 'Piscis'}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs text-primary font-medium">
            {PISCES_TIPOS_LABELS[user.piscesTipo || 'soñador']}
          </span>
        </div>
      </div>

      {/* Welcome Card */}
      <PiscisCard variant="glow" className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-foreground font-medium text-sm">
              {communityRooms.reduce((acc, r) => acc + r.miembrosActivos, 0)} Piscis conectados
            </p>
            <p className="text-xs text-muted-foreground">
              Únete a la conversación
            </p>
          </div>
        </div>
      </PiscisCard>

      {/* Rooms */}
      <div className="mb-4">
        <h2 className="font-medium text-foreground mb-3">Salas</h2>
        <RoomListView 
          rooms={communityRooms}
          onSelectRoom={setActiveRoom}
          user={user}
        />
      </div>
    </div>
  );
}
