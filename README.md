# 🌊 Brújula Piscis - Plataforma de Decisiones para Piscis

Plataforma SaaS completa para ayudar a Piscis a tomar mejores decisiones con tarot, kabbalah, astrología y más. Con sistema de membresías, notificaciones por WhatsApp y un Mentor Espiritual con IA.

## 🚀 Estado de la Plataforma

✅ **LISTA PARA PRODUCCIÓN**

Todos los sistemas están configurados y funcionando:
- Autenticación con Supabase (email, Google, SMS)
- Sistema de pagos con Stripe (7 días de trial)
- Notificaciones diarias por WhatsApp
- Base de datos sincronizada
- UX/UI completa y responsive

## 📋 Requisitos Previos

Antes de hacer deploy, asegúrate de tener configurado:

1. **Supabase Project**: https://supabase.com
   - Base de datos PostgreSQL
   - Autenticación habilitada

2. **Stripe Account**: https://stripe.com
   - Modo de producción
   - Webhook configurado

3. **Twilio Account**: https://www.twilio.com
   - WhatsApp Business API configurado

## 🔧 Configuración Rápida

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/brujula-piscis.git
cd brujula-piscis
npm install
```

### 2. Variables de Entorno
Copia `.env.example` a `.env.local` y completa:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key

# Stripe (PRODUCCIÓN)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Twilio
TWILIO_ACCOUNT_SID=tu_sid
TWILIO_AUTH_TOKEN=tu_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+5215512345678

# Cron
CRON_SECRET=tu_secret_aleatorio
```

### 3. Base de Datos
Las migraciones se ejecutan automáticamente, pero si necesitas ejecutarlas manualmente:

```bash
# En Supabase SQL Editor
-- scripts/001_create_profiles.sql
-- scripts/002_profile_trigger.sql
-- scripts/004-add-trial-fields.sql
-- scripts/005-add-whatsapp-fields.sql
```

### 4. Deploy a Vercel
```bash
vercel deploy --prod
```

## 💳 Cómo Funciona el Negocio

### Planes
- **Free**: 1 decisión/semana (sin restricción de dinero)
- **Básico**: $79 MXN/mes → 10 decisiones/mes + 5 rituales
- **Pro**: $149 MXN/mes → Ilimitadas + Mentor Espiritual + Todos los rituales

### Trial
- 7 días gratis después de insertar tarjeta
- Se cobra automáticamente después del trial
- El usuario puede cancelar en cualquier momento

### Ingresos Esperados
- Conversión típica SaaS: 2-5% de usuarios a pago
- Retención: 80-90% mensual
- LTV (Lifetime Value): $200-500 por usuario

## 📊 Flujo de Usuario

1. **Signup** → Email/Google/SMS
2. **Onboarding** → Preferencias + Plan
3. **Trial** → 7 días gratis con tarjeta
4. **Uso** → Decisiones, rituales, comunidad
5. **Notificaciones** → Mensajes diarios por WhatsApp
6. **Renovación** → Cobro automático cada mes

## 🔐 Seguridad

- ✅ RLS policies en Supabase
- ✅ Validación en servidor
- ✅ Webhook signature verification
- ✅ CRON_SECRET para autorizar jobs
- ✅ Datos sensibles solo en server

## 📱 Features Disponibles

- ✅ Sistema de decisiones con IA
- ✅ Tarot, Kabbalah, Astrología (según preferencia)
- ✅ Mentor Espiritual (Plan Pro)
- ✅ Rituales personalizados
- ✅ Comunidad de Piscis
- ✅ Notificaciones diarias por WhatsApp
- ✅ Reportes semanales y mensuales (Pro)
- ✅ Historial completo de decisiones
- ✅ Dark mode / Light mode

## 🛠️ Troubleshooting

### El login no funciona
- Verifica que Supabase Auth esté habilitado
- Revisa las variables de entorno
- Comprueba que el callback URL sea correcto

### El pago no procesa
- Verifica que Stripe esté en modo PRODUCCIÓN (sk_live_ y pk_live_)
- Comprueba que el webhook esté registrado
- Revisa los logs en Stripe Dashboard

### WhatsApp no envía mensajes
- Verifica que TWILIO_WHATSAPP_NUMBER tenga formato correcto
- Comprueba que el número esté verificado en Twilio
- Revisa que CRON_SECRET coincida en vercel.json

## 📞 Soporte

Contacto disponible en la app:
- Email: soporte@brujulapiscis.com
- WhatsApp: Link directo integrado

## 📄 Licencia

Propiedad de Brújula Piscis - Todos los derechos reservados

## 🎯 Próximos Pasos

- [ ] Analítica: Track conversiones y retención
- [ ] Marketing: Email campaigns para trial expiring
- [ ] Testimonios: Video de usuarios satisfechos
- [ ] Affiliate: Programa de referridos
- [ ] Mobile App: iOS y Android nativa

---

**¡Listo para vender membresías a Piscis! 🌊✨**
