import { NextRequest, NextResponse } from 'next/server';

// In production, this would be stored in a database
// For now, we'll use Vercel KV or similar
interface Subscription {
  phone: string;
  time: string;
  userId: string;
  createdAt: string;
  active: boolean;
}

// Mock storage - in production use a database
const subscriptions: Map<string, Subscription> = new Map();

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

    // Format phone number with country code
    const formattedPhone = phone.startsWith('+') ? phone : `+52${phone}`;

    // Store subscription
    const subscription: Subscription = {
      phone: formattedPhone,
      time: time || '09:00',
      userId: userId || 'anonymous',
      createdAt: new Date().toISOString(),
      active: true,
    };

    subscriptions.set(formattedPhone, subscription);

    // In production, you would:
    // 1. Store in database (Supabase, Neon, etc.)
    // 2. Send a welcome message via Twilio/WhatsApp Business API
    // 3. Set up the cron job trigger

    console.log('[v0] WhatsApp subscription created:', subscription);

    return NextResponse.json({
      success: true,
      message: 'Suscripcion creada exitosamente',
      subscription: {
        phone: formattedPhone,
        time: subscription.time,
      },
    });
  } catch (error) {
    console.error('[v0] Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Error al crear suscripcion' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json(
        { error: 'Numero de telefono requerido' },
        { status: 400 }
      );
    }

    const formattedPhone = phone.startsWith('+') ? phone : `+52${phone}`;
    
    const subscription = subscriptions.get(formattedPhone);
    if (subscription) {
      subscription.active = false;
      subscriptions.set(formattedPhone, subscription);
    }

    return NextResponse.json({
      success: true,
      message: 'Suscripcion cancelada',
    });
  } catch (error) {
    console.error('[v0] Error canceling subscription:', error);
    return NextResponse.json(
      { error: 'Error al cancelar suscripcion' },
      { status: 500 }
    );
  }
}
