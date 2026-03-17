import { NextRequest, NextResponse } from 'next/server';

// Daily inspirational messages for Pisces
const DAILY_MESSAGES = [
  "Buenos dias, Piscis. Hoy tu intuicion esta en su punto mas alto. Confia en esas corazonadas que te guian hacia las mejores decisiones.",
  "Querido Piscis, las estrellas te sonrien hoy. Es un excelente momento para dar ese paso que has estado considerando.",
  "Tu energia creativa fluye con fuerza hoy, Piscis. Deja que tu imaginacion te guie hacia nuevas posibilidades.",
  "Recuerda, Piscis: tu sensibilidad es tu mayor fortaleza. Hoy es perfecto para conectar con quienes mas amas.",
  "El universo conspira a tu favor hoy, Piscis. Mantente abierto a las senales y oportunidades que se presenten.",
  "Tu compasion y empatia brillan hoy, Piscis. Usa estos dones para crear armonia en tu entorno.",
  "Hoy es un dia para sonar en grande, Piscis. Tus suenos tienen el poder de convertirse en realidad.",
  "La luna te favorece hoy, Piscis. Es momento ideal para reflexionar y tomar decisiones importantes con calma.",
  "Tu naturaleza artistica esta especialmente activa hoy. Expresa lo que sientes, Piscis.",
  "Las aguas de tu signo fluyen con claridad hoy. Confia en tu sabiduria interior, Piscis.",
  "Hoy es un dia para nutrir tu espiritu, Piscis. Tomate un momento para ti y recarga energias.",
  "Tu capacidad de adaptacion te llevara lejos hoy, Piscis. Fluye con los cambios como solo tu sabes hacerlo.",
  "El amor esta en el aire para ti hoy, Piscis. Ya sea romantico o de amistad, deja que entre en tu vida.",
  "Tu intuicion te susurra verdades importantes hoy. Escucha con atencion, querido Piscis.",
  "Hoy es perfecto para cerrar ciclos y comenzar nuevos capitulos. Adelante, Piscis.",
  "Tu imaginacion es tu superpoder hoy. Usala para visualizar el futuro que deseas, Piscis.",
  "Las estrellas te invitan a ser valiente hoy. Da ese salto de fe que tu corazon te pide.",
  "Tu energia magnetica atrae cosas buenas hoy, Piscis. Mantente positivo y receptivo.",
  "Hoy es un dia para confiar en el proceso, Piscis. Todo esta fluyendo hacia donde debe.",
  "Tu corazon generoso merece recibir tanto como da. Permitete recibir hoy, Piscis.",
  "La creatividad te llama hoy. Explora nuevas formas de expresarte, querido Piscis.",
  "Tu sexto sentido esta especialmente agudo hoy. No ignores esas senales sutiles, Piscis.",
  "Hoy es un buen dia para tomar decisiones desde el corazon. Tu intuicion no te fallara.",
  "Las aguas cosmicas estan calmas hoy. Aprovecha para meditar y conectar contigo mismo, Piscis.",
  "Tu luz interior brilla con fuerza hoy. Comparte esa magia con quienes te rodean.",
  "Hoy el universo te recuerda: mereces todas las cosas buenas que estan por venir, Piscis.",
  "Tu sensibilidad artistica esta en su maximo esplendor. Crea algo hermoso hoy, Piscis.",
  "Las oportunidades fluyen hacia ti como el agua. Mantente alerta y receptivo hoy.",
  "Tu don para entender a otros te abrira puertas hoy. Usa tu empatia como guia, Piscis.",
  "Hoy es perfecto para manifestar tus deseos. Visualiza con claridad lo que quieres, Piscis.",
  "Tu resiliencia es admirable. Recuerda que cada ola que superas te hace mas fuerte.",
];

// Function to get message of the day based on date
function getDailyMessage(): string {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const messageIndex = dayOfYear % DAILY_MESSAGES.length;
  return DAILY_MESSAGES[messageIndex];
}

// This endpoint would be called by a Vercel Cron Job
// Configure in vercel.json: { "crons": [{ "path": "/api/whatsapp/send-daily", "schedule": "0 * * * *" }] }
export async function GET(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // In development, allow without auth
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const currentHour = new Date().toISOString().slice(11, 16); // "HH:MM" format
    const message = getDailyMessage();

    // In production, you would:
    // 1. Query database for all subscriptions with matching time
    // 2. Send messages via Twilio WhatsApp API or WhatsApp Business API
    
    // Example Twilio integration:
    // const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // for (const subscription of subscriptionsToSend) {
    //   await twilio.messages.create({
    //     body: message,
    //     from: 'whatsapp:+14155238886', // Your Twilio WhatsApp number
    //     to: `whatsapp:${subscription.phone}`,
    //   });
    // }

    console.log('[v0] Daily message ready to send:', {
      time: currentHour,
      message: message.substring(0, 50) + '...',
    });

    return NextResponse.json({
      success: true,
      time: currentHour,
      messagePreview: message.substring(0, 100) + '...',
      // In production: sentCount: subscriptionsToSend.length
    });
  } catch (error) {
    console.error('[v0] Error sending daily messages:', error);
    return NextResponse.json(
      { error: 'Error sending messages' },
      { status: 500 }
    );
  }
}

// Manual trigger for testing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number required' },
        { status: 400 }
      );
    }

    const message = getDailyMessage();
    const formattedPhone = phone.startsWith('+') ? phone : `+52${phone}`;

    // In production, send via Twilio:
    // const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // await twilio.messages.create({
    //   body: message,
    //   from: 'whatsapp:+14155238886',
    //   to: `whatsapp:${formattedPhone}`,
    // });

    console.log('[v0] Test message would be sent to:', formattedPhone);

    return NextResponse.json({
      success: true,
      phone: formattedPhone,
      message: message,
    });
  } catch (error) {
    console.error('[v0] Error sending test message:', error);
    return NextResponse.json(
      { error: 'Error sending message' },
      { status: 500 }
    );
  }
}
