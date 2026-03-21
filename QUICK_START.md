# 🚀 QUICK START GUIDE

Sigue estos pasos para deployar Brújula Piscis en 30 minutos.

## PASO 1: Preparar Supabase (5 min)

1. Ve a https://supabase.com y crea proyecto
2. Copia en un notepad:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## PASO 2: Preparar Stripe (5 min)

1. Ve a https://stripe.com y crea cuenta
2. En Dashboard > Settings > API Keys, obtén:
   - Secret Key → `STRIPE_SECRET_KEY` (sk_live_...)
   - Publishable Key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_live_...)

## PASO 3: Preparar Twilio (5 min)

1. Ve a https://www.twilio.com y crea cuenta
2. Obtén:
   - Account SID → `TWILIO_ACCOUNT_SID`
   - Auth Token → `TWILIO_AUTH_TOKEN`
   - WhatsApp Business Number → `TWILIO_WHATSAPP_NUMBER` (formato: whatsapp:+52XXXXXXXXXX)

## PASO 4: Deploy a Vercel (10 min)

```bash
# 1. Conecta tu GitHub
git push origin main

# 2. Ve a https://vercel.com y conecta el repo

# 3. En Settings > Environment Variables, agrega:
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
STRIPE_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx (obten en paso siguiente)
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+52xxxxxxxxxx
CRON_SECRET=tu-secret-random-aqui

# 4. Vercel desplegará automáticamente
```

## PASO 5: Configurar Stripe Webhook (5 min)

1. Ve a https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://tu-app.vercel.app/api/stripe/webhook`
4. Selecciona eventos:
   - checkout.session.completed
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
5. Click "Add endpoint"
6. Click en el endpoint creado y copia "Signing secret" (whsec_...)
7. Actualiza `STRIPE_WEBHOOK_SECRET` en Vercel

## PASO 6: Verificar Funcionamiento

1. Ve a tu app: https://tu-app.vercel.app
2. Haz signup con email
3. Completa onboarding
4. Intenta pagar con tarjeta: 4242 4242 4242 4242
5. Verifica en Stripe Dashboard que aparezca la suscripción

## ✅ ¡LISTO!

Tu plataforma está ahora en producción generando ingresos.

---

## VARIABLES DE ENTORNO RESUMEN

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Stripe (PRODUCCIÓN)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=

# Security
CRON_SECRET=
```

## 🔍 Troubleshooting

**"Email not verified"**
- Revisa spam folder
- Reenvía email de confirmación en login page

**"Payment failed"**
- Verifica que Stripe esté en MODO PRODUCCIÓN (sk_live_, pk_live_)
- No uses test keys en producción

**"WhatsApp no envía mensajes"**
- Verifica que el número en Twilio sea el correcto
- Verifica que sea formato international: +52...

**"Webhook no funciona"**
- Verifica que STRIPE_WEBHOOK_SECRET coincida
- Comprueba que URL sea exacta: https://tu-app.vercel.app/api/stripe/webhook

---

**Necesitas ayuda? Ve a STATUS.md o DEPLOYMENT.md**
