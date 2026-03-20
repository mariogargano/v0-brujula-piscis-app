import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

// Send WhatsApp message via Twilio
async function sendWhatsAppMessage(to: string, message: string): Promise<boolean> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    console.error('Twilio credentials not configured');
    return false;
  }

  // Format phone number for WhatsApp
  const formattedTo = to.startsWith('+') ? to : `+${to}`;
  const formattedFrom = fromNumber.startsWith('+') ? fromNumber : `+${fromNumber}`;
  
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: `whatsapp:${formattedFrom}`,
        To: `whatsapp:${formattedTo}`,
        Body: message,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`Twilio error for ${formattedTo}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error sending to ${formattedTo}:`, error);
    return false;
  }
}

// This endpoint is called by Vercel Cron Job
export async function GET(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const supabase = await createClient();
    
    // Get current hour in Mexico City timezone
    const now = new Date();
    const mexicoTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Mexico_City' }));
    const currentHour = mexicoTime.getHours().toString().padStart(2, '0') + ':00';

    // Get all users with WhatsApp notifications enabled for this hour
    const { data: users, error } = await supabase
      .from('profiles')
      .select('id, whatsapp, nombre')
      .eq('whatsapp_notificaciones', true)
      .eq('hora_notificacion', currentHour)
      .not('whatsapp', 'is', null);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!users || users.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No users to notify at this hour',
        hour: currentHour,
        sent: 0,
      });
    }

    const message = getDailyMessage();
    let sentCount = 0;
    let failedCount = 0;

    // Send messages to all users
    for (const user of users) {
      if (!user.whatsapp) continue;
      
      const personalizedMessage = user.nombre 
        ? message.replace('Piscis', user.nombre)
        : message;
      
      const fullMessage = `${personalizedMessage}\n\n— Tu Brujula Piscis`;
      
      const success = await sendWhatsAppMessage(user.whatsapp, fullMessage);
      if (success) {
        sentCount++;
      } else {
        failedCount++;
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return NextResponse.json({
      success: true,
      hour: currentHour,
      sent: sentCount,
      failed: failedCount,
      total: users.length,
    });
  } catch (error) {
    console.error('Error sending daily messages:', error);
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
    const { phone, testMessage } = body;

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number required' },
        { status: 400 }
      );
    }

    const message = testMessage || getDailyMessage();
    const formattedPhone = phone.startsWith('+') ? phone : `+52${phone}`;
    const fullMessage = `${message}\n\n— Tu Brujula Piscis`;

    const success = await sendWhatsAppMessage(formattedPhone, fullMessage);

    if (success) {
      return NextResponse.json({
        success: true,
        phone: formattedPhone,
        message: 'Message sent successfully',
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send message. Check Twilio credentials.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending test message:', error);
    return NextResponse.json(
      { error: 'Error sending message' },
      { status: 500 }
    );
  }
}
