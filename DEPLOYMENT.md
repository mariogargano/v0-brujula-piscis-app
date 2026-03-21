# DEPLOYMENT CHECKLIST - Brújula Piscis

## ✅ AUTENTICACIÓN
- [x] Login con email/password
- [x] Login con Google OAuth (requiere configuración en Google Cloud)
- [x] Login con teléfono/SMS (requiere Twilio configurado en Supabase)
- [x] Auth Provider sincronizado con Supabase
- [x] Protección de rutas con middleware

## ✅ BASE DE DATOS (Supabase)
- [x] Tabla profiles con campos completos
- [x] Trigger para crear perfil automáticamente en signup
- [x] Row Level Security (RLS) habilitado
- [x] Campos de trial (trial_ends_at, subscription_status)
- [x] Campos de Stripe (stripe_customer_id, stripe_subscription_id)
- [x] Campos de WhatsApp (whatsapp, whatsapp_notificaciones, hora_notificacion)

## ✅ PLANES Y MEMBRESÍAS
- [x] Plan Free: 1 decisión/semana, sin acceso a mentor
- [x] Plan Básico: $79 MXN/mes, 10 decisiones/mes, 5 rituales
- [x] Plan Pro: $149 MXN/mes, ilimitadas, mentor completo
- [x] 7 días de trial gratuito para ambos planes pagos
- [x] Cobro automático después del trial

## ✅ STRIPE
- [x] Checkout embebido con Stripe
- [x] Sesiones de checkout con trial_period_days: 7
- [x] payment_method_collection: 'always' (requiere tarjeta)
- [x] API para obtener status de checkout
- [x] API para guardar suscripción en BD
- [x] Webhook para eventos de Stripe

## ✅ ONBOARDING
- [x] Paso 1: Bienvenida
- [x] Paso 2: Objetivo (decisiones sobre qué)
- [x] Paso 3: Tono de respuesta (Tarot, Kabbalah, etc)
- [x] Paso 4: Check-in (frecuencia)
- [x] Paso 5: Datos personales (nombre, fecha, ciudad)
- [x] Paso 6: Selección de plan (Free/Básico/Pro)
- [x] Guarda todo en Supabase y store local

## ✅ SCREENS PRINCIPALES
- [x] Home: Card de decisión del día
- [x] Decidir: Consulta con IA, historial con limites por plan
- [x] Mentor: Solo Pro, chat con IA especializada
- [x] Rituales: 5 para Básico, todos para Pro
- [x] Comunidad: Acceso para Básico y Pro, salas Pro solo para Pro
- [x] Perfil: Config de notificaciones, planes, logout

## ✅ WHATSAPP
- [x] Modal para ingresar número de WhatsApp
- [x] Selección de hora para notificaciones (7am-8pm)
- [x] Integración con Twilio para envío de mensajes
- [x] Cron job cada hora para enviar mensajes
- [x] 31 mensajes inspiracionales únicos
- [x] Guarda preferencias en Supabase

## 📋 VARIABLES DE ENTORNO REQUERIDAS

### Supabase
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

### Stripe (PRODUCCIÓN)
- STRIPE_SECRET_KEY (sk_live_...)
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (pk_live_...)
- STRIPE_WEBHOOK_SECRET (whsec_...)

### Twilio
- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN
- TWILIO_WHATSAPP_NUMBER (Tu número de WhatsApp Business de Twilio)

### Cron
- CRON_SECRET (Token para proteger el cron job)

## 🔒 SEGURIDAD
- [x] RLS policies en todas las tablas
- [x] Server-only imports en funciones sensibles
- [x] Validación en servidor para pagos
- [x] Webhook signature verification para Stripe
- [x] CRON_SECRET para proteger cron jobs

## 🚀 DEPLOYMENT
1. Deploy a Vercel (conecta tu GitHub)
2. Agrega todas las variables de entorno en Settings > Environment Variables
3. Verifica que el build sea exitoso
4. Prueba login con email de prueba
5. Prueba compra con tarjeta de prueba Stripe (4242 4242 4242 4242)
6. Verifica que el trial se registre en BD
7. Configura webhook de Stripe en dashboard

## ✨ FEATURES COMPLETADAS
- Autenticación multi-método
- Sistema de membresías con trial
- Sincronización Supabase ↔ Store local
- Notificaciones diarias por WhatsApp
- Flujo de pago automatizado con Stripe
- Protección por plan (features limitadas)
- UX/UI completa y responsive
- Mensajes inspiracionales personalizados por Piscis

## 📞 SOPORTE
- Modal de soporte con email y WhatsApp
- Preguntas frecuentes integradas
- Enlaces directos a contacto
