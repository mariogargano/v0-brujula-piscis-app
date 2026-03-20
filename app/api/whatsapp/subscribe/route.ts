import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, time, userId } = body;

    if (!phone || phone.length < 10) {
      return NextResponse.json(
        { error: 'Numero de telefono invalido' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      );
    }

    // Format phone number with country code
    const formattedPhone = phone.startsWith('+') ? phone : `+52${phone}`;
    const notificationTime = time || '09:00';

    const supabase = await createClient();

    // Update user profile with WhatsApp settings
    const { error } = await supabase
      .from('profiles')
      .update({
        whatsapp: formattedPhone,
        whatsapp_notificaciones: true,
        hora_notificacion: notificationTime,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Error al guardar configuracion' },
        { status: 500 }
      );
    }

    // Send welcome message
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

    if (accountSid && authToken && fromNumber) {
      const formattedFrom = fromNumber.startsWith('+') ? fromNumber : `+${fromNumber}`;
      const welcomeMessage = `Bienvenido a Brujula Piscis! Recibiras mensajes de inspiracion diaria a las ${notificationTime}. Responde STOP para cancelar en cualquier momento.`;
      
      try {
        await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            From: `whatsapp:${formattedFrom}`,
            To: `whatsapp:${formattedPhone}`,
            Body: welcomeMessage,
          }),
        });
      } catch (twilioError) {
        console.error('Twilio welcome message error:', twilioError);
        // Don't fail the subscription if welcome message fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Suscripcion creada exitosamente',
      subscription: {
        phone: formattedPhone,
        time: notificationTime,
      },
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Error al crear suscripcion' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    // Disable WhatsApp notifications
    const { error } = await supabase
      .from('profiles')
      .update({
        whatsapp_notificaciones: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Error al cancelar suscripcion' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Suscripcion cancelada',
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json(
      { error: 'Error al cancelar suscripcion' },
      { status: 500 }
    );
  }
}
