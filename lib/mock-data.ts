import type { Ritual, WeeklyReport, DecisionEntry } from './types';

export const MOCK_RITUALS: Ritual[] = [
  {
    id: '1',
    titulo: 'Aterrizar antes de escribir',
    duracion: '5 min',
    descripcion: 'Un ritual breve para conectar con tu cuerpo y mente antes de enviar un mensaje importante.',
    beneficio: 'Reduce la impulsividad y aumenta la claridad',
    esPro: false,
    tipo: 'texto',
    contenido: `Antes de escribir ese mensaje, haz esto:

1. Respira profundo 3 veces
2. Siente tus pies en el suelo
3. Pregúntate: ¿Qué necesito realmente de esta conversación?
4. Escribe desde ese lugar, no desde la ansiedad

Recuerda: Un mensaje enviado desde la calma tiene más poder que cien mensajes desde el miedo.`,
  },
  {
    id: '2',
    titulo: 'Cortar la idealización',
    duracion: '7 min',
    descripcion: 'Ejercicio para distinguir entre lo que es real y lo que estás imaginando.',
    beneficio: 'Claridad mental y protección emocional',
    esPro: false,
    tipo: 'texto',
    contenido: `Piscis tiende a ver el potencial, no la realidad. Este ejercicio te ayuda a aterrizar:

1. Escribe 3 cosas que esa persona HA HECHO (no lo que crees que hará)
2. Escribe 3 cosas que TÚ necesitas (no lo que esperas que adivine)
3. Compara ambas listas

Si hay un desbalance grande, tu intuición ya sabe qué hacer. Escúchala.`,
  },
  {
    id: '3',
    titulo: 'Decidir con calma',
    duracion: '4 min',
    descripcion: 'Meditación guiada para tomar decisiones desde un estado de paz.',
    beneficio: 'Decisiones más acertadas',
    esPro: true,
    tipo: 'texto',
    contenido: `Cierra los ojos. Imagina que estás en el fondo del océano.

Todo está en silencio. Las olas de la superficie no te alcanzan aquí.

Desde este lugar de profunda calma, observa tu decisión como si fuera un pez que pasa nadando.

No lo persigas. Solo obsérvalo.

¿Qué te dice tu cuerpo? ¿Expansión o contracción?

Esa es tu respuesta.`,
  },
  {
    id: '4',
    titulo: 'Cerrar ciclos',
    duracion: '6 min',
    descripcion: 'Ritual para soltar lo que ya no te sirve y hacer espacio para lo nuevo.',
    beneficio: 'Liberación emocional y renovación',
    esPro: true,
    tipo: 'texto',
    contenido: `Este ritual es para cuando necesitas cerrar un capítulo:

1. Escribe lo que estás soltando en un papel
2. Lee en voz alta: "Agradezco lo que me enseñó. Ya no lo necesito."
3. Rompe el papel en pedazos pequeños
4. Tíralo a la basura (sí, a la basura, no lo guardes)

Lo que sueltas ya no tiene poder sobre ti. Eres libre.`,
  },
  {
    id: '5',
    titulo: 'Límites sin culpa',
    duracion: '5 min',
    descripcion: 'Aprende a decir no sin sentir que traicionas a alguien.',
    beneficio: 'Autoprotección y relaciones más sanas',
    esPro: true,
    tipo: 'texto',
    contenido: `Piscis, escucha: Decir "no" no te hace mala persona.

Repite:
- Mi energía es limitada y valiosa
- Protegerme no es egoísmo
- Un "no" honesto es mejor que un "sí" resentido

Plantilla para decir no:
"Lo aprecio mucho, pero no puedo comprometerme con eso ahora mismo. Espero que lo entiendas."

No tienes que explicar más. No tienes que disculparte.`,
  },
];

export const MOCK_WEEKLY_REPORTS: WeeklyReport[] = [
  {
    id: '1',
    semana: '2024-01-08',
    decisiones: 3,
    emocionDominante: 'ansiedad',
    urgenciaPromedio: 7,
    mayorRiesgo: 'Tomaste decisiones desde la ansiedad, lo cual puede llevar a arrepentimientos.',
    recomendacionClave: 'Esta semana, antes de cada decisión importante, espera 24 horas.',
    accionesSugeridas: [
      'Practica el ritual "Aterrizar antes de escribir" al menos 2 veces',
      'Evita tomar decisiones después de las 10pm',
      'Escribe tus pensamientos antes de actuar',
    ],
  },
];

export const MOCK_DECISIONS: DecisionEntry[] = [
  {
    id: '1',
    fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    categoria: 'amor',
    texto: '¿Le escribo después de que no me contestó hace 3 días?',
    urgencia: 8,
    emocion: 'ansiedad',
    tendencia: 'idealizando',
    objetivo: 'respuesta',
    dictamen: 'Espera 24 horas más. Si no responde, el silencio es la respuesta.',
    semaforo: 'rojo',
    riesgo: 75,
    explicacion: [
      'Tu ansiedad está elevada, lo cual nubla tu juicio',
      '3 días sin respuesta es una señal clara',
      'Escribir desde la desesperación nunca genera el resultado que buscas',
    ],
    preguntasClaridad: [
      '¿Qué esperas que pase si le escribes?',
      '¿Cómo te sentirás si no responde de nuevo?',
      '¿Esta persona ha demostrado con acciones que le importas?',
      '¿Estás buscando certeza o estás evitando aceptar la realidad?',
      '¿Qué le dirías a tu mejor amiga en esta situación?',
    ],
    plan3Pasos: [
      'Hoy: No escribas. Haz el ritual "Cortar la idealización"',
      'Mañana: Si sigue el impulso, escribe el mensaje pero NO lo envíes. Guárdalo.',
      'En 48 horas: Relee el mensaje. Si aún quieres enviarlo, hazlo. Pero probablemente ya no querrás.',
    ],
    guardada: true,
  },
];

// Decision engine logic
export function generateDecisionResult(data: {
  categoria: string;
  texto: string;
  urgencia: number;
  emocion: string;
  tendencia: string;
  objetivo: string;
}): Omit<DecisionEntry, 'id' | 'fecha' | 'guardada' | 'recordatorioFecha'> & {
  semaforo: 'verde' | 'amarillo' | 'rojo';
} {
  // Decision logic based on inputs
  let semaforo: 'verde' | 'amarillo' | 'rojo' = 'amarillo';
  let riesgo = 50;
  let dictamen = '';
  const explicacion: string[] = [];
  const preguntasClaridad: string[] = [];
  const plan3Pasos: string[] = [];
  let plantillaTexto: string | undefined;

  // High urgency + negative emotion = red
  if (data.urgencia >= 7 && ['ansiedad', 'enojo', 'confusion'].includes(data.emocion)) {
    semaforo = 'rojo';
    riesgo = 70 + Math.floor(Math.random() * 20);
    dictamen = 'Espera 24-48 horas. No decidas desde este estado emocional.';
    explicacion.push(
      'Tu nivel de urgencia es alto, pero eso no significa que debas actuar ahora',
      `La ${data.emocion === 'ansiedad' ? 'ansiedad' : data.emocion === 'enojo' ? 'ira' : 'confusión'} distorsiona la percepción de la realidad`,
      'Las decisiones tomadas en este estado suelen generar arrepentimiento'
    );
  }
  // Idealizing or avoiding = yellow/red
  else if (data.tendencia === 'idealizando') {
    semaforo = 'amarillo';
    riesgo = 55 + Math.floor(Math.random() * 20);
    dictamen = 'Antes de actuar, distingue entre lo que imaginas y lo que es real.';
    explicacion.push(
      'Piscis tiende a ver el potencial más que la realidad actual',
      'Antes de decidir, haz una lista de hechos concretos, no suposiciones',
      'Lo que imaginas que pasará no siempre coincide con lo que pasará'
    );
  }
  else if (data.tendencia === 'evitando') {
    semaforo = 'amarillo';
    riesgo = 45 + Math.floor(Math.random() * 15);
    dictamen = 'Evitar también es una decisión. ¿Qué estás protegiendo al no actuar?';
    explicacion.push(
      'A veces evitamos porque sabemos la respuesta pero no queremos enfrentarla',
      'La postergación indefinida drena más energía que la acción',
      'Pregúntate: ¿Qué es lo peor que puede pasar si actúas?'
    );
  }
  else if (data.tendencia === 'impulsivo') {
    semaforo = 'rojo';
    riesgo = 65 + Math.floor(Math.random() * 20);
    dictamen = 'Detente. La impulsividad rara vez termina bien para Piscis.';
    explicacion.push(
      'Cuando Piscis actúa impulsivamente, suele arrepentirse',
      'Tu naturaleza empática te hace vulnerable a las consecuencias',
      'Un día de espera puede ahorrarte semanas de malestar'
    );
  }
  // Calm + clear = green
  else if (data.tendencia === 'claro' && data.emocion === 'calma') {
    semaforo = 'verde';
    riesgo = 20 + Math.floor(Math.random() * 20);
    dictamen = 'Tienes claridad. Da un paso pequeño hoy.';
    explicacion.push(
      'Tu estado emocional es óptimo para tomar decisiones',
      'La calma te permite ver las cosas como son',
      'Confía en tu intuición, está alineada ahora'
    );
  }
  // Default moderate case
  else {
    semaforo = 'amarillo';
    riesgo = 40 + Math.floor(Math.random() * 20);
    dictamen = 'Procede con consciencia. Haz una pausa breve antes de actuar.';
    explicacion.push(
      'Tu estado es moderado, pero vale la pena reflexionar un momento',
      'Piscis se beneficia de pequeñas pausas antes de decidir',
      'Escucha tu cuerpo: ¿sientes expansión o contracción?'
    );
  }

  // Category-specific adjustments
  if (data.categoria === 'amor') {
    preguntasClaridad.push(
      '¿Esta persona ha demostrado con ACCIONES que le importas?',
      '¿Estás buscando amor o validación?',
      '¿Qué le aconsejarías a tu mejor amiga en esta situación?',
      '¿Estás viendo a esta persona como es, o como quieres que sea?',
      '¿Cómo te sentirás en una semana si haces esto?'
    );
    
    if (semaforo === 'verde' || semaforo === 'amarillo') {
      plantillaTexto = 'Hola. Estaba pensando en ti y quería saber cómo estás. Sin presión de responder si estás ocupado/a.';
    }
    
    plan3Pasos.push(
      'Hoy: Escribe lo que sientes en un papel, no en el chat',
      `${semaforo === 'rojo' ? 'En 24h' : 'Mañana'}: Relee lo que escribiste. ¿Sigue teniendo sentido?`,
      `${semaforo === 'rojo' ? 'En 48h' : 'Cuando estés listo/a'}: Si la claridad persiste, actúa desde la calma`
    );
  }
  else if (data.categoria === 'dinero') {
    preguntasClaridad.push(
      '¿Esta decisión te acerca o te aleja de tu estabilidad financiera?',
      '¿Estás comprando algo o estás comprando una emoción?',
      '¿Qué pasaría si esperas una semana para decidir?',
      '¿Tienes toda la información que necesitas?',
      '¿Tu yo del futuro te agradecerá esta decisión?'
    );
    
    plan3Pasos.push(
      'Hoy: No hagas la compra/inversión. Anota el monto y para qué es',
      'En 3 días: Revisa si sigue siendo necesario',
      'Antes de actuar: Consulta con alguien de confianza que sea práctico'
    );
    
    if (data.urgencia >= 7) {
      dictamen = 'Las decisiones financieras urgentes casi nunca son buenas decisiones. Espera.';
      riesgo = Math.min(riesgo + 10, 95);
    }
  }
  else if (data.categoria === 'bienestar') {
    preguntasClaridad.push(
      '¿Qué necesitas realmente en este momento?',
      '¿Estás cuidándote o estás escapando de algo?',
      '¿Esta decisión te nutre o te drena?',
      '¿Qué haría la versión más sabia de ti?',
      '¿Puedes pedir ayuda en lugar de decidir solo/a?'
    );
    
    plan3Pasos.push(
      'Hoy: Haz algo pequeño que cuide de ti (caminar, respirar, descansar)',
      'Esta semana: Identifica qué te está drenando energía',
      'Este mes: Establece un límite en el área que más lo necesita'
    );
  }
  else if (data.categoria === 'creatividad') {
    preguntasClaridad.push(
      '¿Este proyecto te emociona o te sientes obligado/a?',
      '¿Estás creando por amor al arte o por aprobación externa?',
      '¿Qué te impide empezar/continuar?',
      '¿El perfeccionismo te está paralizando?',
      '¿Puedes dar un paso pequeño hoy?'
    );
    
    plan3Pasos.push(
      'Hoy: Dedica 15 minutos a tu proyecto sin expectativas',
      'Esta semana: Muestra tu trabajo a una persona de confianza',
      'Este mes: Define qué "terminado" significa para ti'
    );
    
    // Creativity tends to be safer
    riesgo = Math.max(riesgo - 15, 15);
  }

  return {
    categoria: data.categoria as 'amor' | 'dinero' | 'bienestar' | 'creatividad',
    texto: data.texto,
    urgencia: data.urgencia,
    emocion: data.emocion as DecisionEntry['emocion'],
    tendencia: data.tendencia as DecisionEntry['tendencia'],
    objetivo: data.objetivo as DecisionEntry['objetivo'],
    dictamen,
    semaforo,
    riesgo,
    explicacion,
    preguntasClaridad,
    plan3Pasos,
    plantillaTexto,
  };
}
