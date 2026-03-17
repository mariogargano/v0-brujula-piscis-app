// Brújula Piscis - Data Types

export type Plan = 'free' | 'basico' | 'pro';

export type Objective = 'amor' | 'dinero' | 'bienestar' | 'creatividad';

export type GuideTone = 'suave' | 'directo';

export type Emotion = 
  | 'ansiedad' 
  | 'ilusion' 
  | 'nostalgia' 
  | 'culpa' 
  | 'enojo' 
  | 'confusion' 
  | 'calma';

export type PersonalTendency = 
  | 'idealizando' 
  | 'evitando' 
  | 'impulsivo' 
  | 'claro';

export type DecisionGoal = 
  | 'paz' 
  | 'respuesta' 
  | 'cierre' 
  | 'avanzar' 
  | 'cuidarme' 
  | 'proteger';

export type TrafficLight = 'verde' | 'amarillo' | 'rojo';

// Community types
export type PiscesTipo = 'soñador' | 'intuitivo' | 'creativo' | 'empatico';

export interface UserProfile {
  id: string;
  nombre?: string;
  objetivoPrincipal: Objective;
  tono: GuideTone;
  recordatorioCheckIn: boolean;
  recordatorioPausa: boolean;
  fechaNacimiento?: string;
  horaNacimiento?: string;
  ciudad?: string;
  plan: Plan;
  decisionesUsadasEstaSemana: number;
  ultimoResetSemanal: string;
  onboardingCompleto: boolean;
  piscesTipo?: PiscesTipo;
  enComunidad?: boolean;
  avatar?: string;
  whatsapp?: string;
  whatsappNotificaciones?: boolean;
  horaNotificacion?: string; // "09:00" formato 24h
}

export interface DecisionEntry {
  id: string;
  fecha: string;
  categoria: Objective;
  texto: string;
  urgencia: number; // 1-10
  emocion: Emotion;
  tendencia: PersonalTendency;
  objetivo: DecisionGoal;
  dictamen: string;
  semaforo: TrafficLight;
  riesgo: number; // 0-100
  explicacion: string[];
  preguntasClaridad: string[];
  plan3Pasos: string[];
  plantillaTexto?: string;
  guardada: boolean;
  recordatorioFecha?: string;
}

export interface Ritual {
  id: string;
  titulo: string;
  duracion: string;
  descripcion: string;
  beneficio: string;
  esPro: boolean;
  tipo: 'audio' | 'texto';
  contenido: string;
}

export interface WeeklyReport {
  id: string;
  semana: string;
  decisiones: number;
  emocionDominante: Emotion | null;
  urgenciaPromedio: number;
  mayorRiesgo: string;
  recomendacionClave: string;
  accionesSugeridas: string[];
}

export interface MonthlyReport {
  id: string;
  mes: string;
  totalDecisiones: number;
  categoriaFrecuente: Objective | null;
  patronesDetectados: string[];
  evolucionEmocional: string;
  recomendacionesMes: string[];
}

export interface CommunityMember {
  id: string;
  nombre: string;
  avatar: string;
  piscesTipo: PiscesTipo;
  miembroDesde: string;
  enLinea: boolean;
}

export interface ChatMessage {
  id: string;
  autorId: string;
  autorNombre: string;
  autorAvatar: string;
  mensaje: string;
  timestamp: string;
  likes: number;
  esPropio: boolean;
  roomId: string;
}

export interface CommunityRoom {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  miembrosActivos: number;
  esPro: boolean;
}

// Helper type for the decision wizard
export interface DecisionWizardData {
  categoria?: Objective;
  texto?: string;
  urgencia?: number;
  emocion?: Emotion;
  tendencia?: PersonalTendency;
  objetivo?: DecisionGoal;
}

// Mock data generators
export const EMOTIONS_LABELS: Record<Emotion, string> = {
  ansiedad: 'Ansiedad',
  ilusion: 'Ilusión',
  nostalgia: 'Nostalgia',
  culpa: 'Culpa',
  enojo: 'Enojo',
  confusion: 'Confusión',
  calma: 'Calma',
};

export const TENDENCIES_LABELS: Record<PersonalTendency, string> = {
  idealizando: 'Estoy idealizando',
  evitando: 'Estoy evitando',
  impulsivo: 'Estoy impulsivo/a',
  claro: 'Estoy claro/a',
};

export const GOALS_LABELS: Record<DecisionGoal, string> = {
  paz: 'Paz',
  respuesta: 'Respuesta',
  cierre: 'Cierre',
  avanzar: 'Avanzar',
  cuidarme: 'Cuidarme',
  proteger: 'Proteger dinero/tiempo',
};

export const OBJECTIVES_LABELS: Record<Objective, string> = {
  amor: 'Amor y relaciones',
  dinero: 'Dinero y trabajo',
  bienestar: 'Bienestar emocional',
  creatividad: 'Creatividad y proyectos',
};

export const TRAFFIC_LIGHT_CONFIG: Record<TrafficLight, { label: string; color: string; bgColor: string }> = {
  verde: { label: 'Adelante', color: 'text-success', bgColor: 'bg-success' },
  amarillo: { label: 'Con cuidado', color: 'text-warning', bgColor: 'bg-warning' },
  rojo: { label: 'No hoy', color: 'text-destructive', bgColor: 'bg-destructive' },
};

export const PISCES_TIPOS: PiscesTipo[] = ['soñador', 'intuitivo', 'creativo', 'empatico'];

export const PISCES_TIPOS_LABELS: Record<PiscesTipo, string> = {
  soñador: 'Piscis Sonador',
  intuitivo: 'Piscis Intuitivo',
  creativo: 'Piscis Creativo',
  empatico: 'Piscis Empatico',
};

export const PISCES_TIPOS_DESCRIPTIONS: Record<PiscesTipo, string> = {
  soñador: 'Vives en un mundo de posibilidades infinitas',
  intuitivo: 'Tu sexto sentido es tu mejor guía',
  creativo: 'Transformas emociones en arte',
  empatico: 'Sientes lo que otros sienten',
};

// Mentor & Philosophy types
export type PhilosophyType = 
  | 'kabbalah' 
  | 'tarot' 
  | 'astrologia' 
  | 'numerologia' 
  | 'budismo' 
  | 'estoicismo'
  | 'jung'
  | 'mindfulness';

export interface MentorPhilosophy {
  id: PhilosophyType;
  nombre: string;
  descripcion: string;
  icono: string;
  esPro: boolean;
}

export interface MentorMessage {
  id: string;
  tipo: 'user' | 'mentor';
  contenido: string;
  timestamp: string;
  filosofia?: PhilosophyType;
}

export const PHILOSOPHIES: MentorPhilosophy[] = [
  {
    id: 'mindfulness',
    nombre: 'Mindfulness',
    descripcion: 'Claridad desde la presencia y el momento actual',
    icono: '🧘',
    esPro: false,
  },
  {
    id: 'tarot',
    nombre: 'Tarot Intuitivo',
    descripcion: 'Arquetipos y símbolos para iluminar tu camino',
    icono: '🃏',
    esPro: false,
  },
  {
    id: 'kabbalah',
    nombre: 'Kabbalah',
    descripcion: 'Sabiduría mística del árbol de la vida',
    icono: '✡️',
    esPro: true,
  },
  {
    id: 'astrologia',
    nombre: 'Astrología Profunda',
    descripcion: 'Los astros como guía de tu alma Piscis',
    icono: '♓',
    esPro: true,
  },
  {
    id: 'numerologia',
    nombre: 'Numerología',
    descripcion: 'Los números revelan patrones ocultos',
    icono: '🔢',
    esPro: true,
  },
  {
    id: 'budismo',
    nombre: 'Budismo Zen',
    descripcion: 'El camino medio hacia la paz interior',
    icono: '☸️',
    esPro: true,
  },
  {
    id: 'estoicismo',
    nombre: 'Estoicismo',
    descripcion: 'Sabiduría práctica para decisiones difíciles',
    icono: '🏛️',
    esPro: true,
  },
  {
    id: 'jung',
    nombre: 'Psicología Jungiana',
    descripcion: 'Arquetipos y el inconsciente colectivo',
    icono: '🪞',
    esPro: true,
  },
];

export const PLAN_FEATURES = {
  free: {
    nombre: 'Gratis',
    precio: 0,
    decisiones: 1,
    rituales: 2,
    mentor: false,
    comunidad: false,
    reportes: false,
  },
  basico: {
    nombre: 'Básico',
    precio: 79,
    decisiones: 10,
    rituales: 5,
    mentor: false,
    comunidad: true,
    reportes: false,
  },
  pro: {
    nombre: 'Pro',
    precio: 149,
    decisiones: -1, // ilimitado
    rituales: -1, // todos
    mentor: true,
    comunidad: true,
    reportes: true,
  },
};
