# 📡 API ENDPOINTS DOCUMENTATION

## Autenticación Endpoints

### POST /api/auth/sign-up
Registra nuevo usuario con email y contraseña

**Request:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña_segura"
}
```

**Response:**
```json
{
  "data": {
    "user": { "id": "uuid", "email": "usuario@ejemplo.com" }
  }
}
```

---

### POST /api/auth/sign-in
Inicia sesión con email y contraseña

**Request:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña_segura"
}
```

**Response:**
```json
{
  "data": {
    "session": { "access_token": "...", "user": { "id": "uuid" } }
  }
}
```

---

### GET /auth/callback
Callback para OAuth (Google, SMS)

**Query Params:**
- `code` - Authorization code de Supabase
- `state` - State para verificación

---

### POST /api/auth/sign-out
Cierra la sesión actual

**Response:**
```json
{ "success": true }
```

---

## Stripe Endpoints

### POST /api/stripe/checkout
Crea una sesión de checkout

**Request:**
```json
{
  "productId": "brujula-pro",
  "userId": "uuid"
}
```

**Response:**
```json
{
  "clientSecret": "pi_...",
  "sessionId": "cs_..."
}
```

---

### GET /api/stripe/session-status
Obtiene el estado de una sesión de checkout

**Query Params:**
- `session_id` - ID de la sesión

**Response:**
```json
{
  "status": "complete",
  "customerEmail": "user@example.com",
  "subscriptionId": "sub_...",
  "customerId": "cus_..."
}
```

---

### POST /api/stripe/webhook (⚠️ Webhook)
Recibe eventos de Stripe

**Events:**
- `checkout.session.completed` → Trial iniciado
- `customer.subscription.created` → Suscripción creada
- `customer.subscription.updated` → Plan actualizado
- `customer.subscription.deleted` → Suscripción cancelada
- `invoice.payment_succeeded` → Pago completado
- `invoice.payment_failed` → Pago fallido

---

## WhatsApp Endpoints

### POST /api/whatsapp/subscribe
Registra un número para mensajes diarios

**Request:**
```json
{
  "phone": "+5215512345678",
  "time": "09:00",
  "userId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscrito a mensajes diarios"
}
```

---

### GET /api/whatsapp/send-daily (🔒 Protected)
Cron job que envía mensajes diarios

**Headers Required:**
- `Authorization: Bearer {CRON_SECRET}`

**Runs:**
- Cada hora (7am, 8am, 9am, 12pm, 8pm)

**Response:**
```json
{
  "success": true,
  "messagesSent": 145,
  "failedDeliveries": 2
}
```

---

## Server Actions (Next.js)

### createCheckoutSession()
Crea sesión de checkout en servidor

```typescript
const { sessionId } = await createCheckoutSession(productId);
```

---

### getCheckoutSessionStatus()
Obtiene status de sesión completada

```typescript
const status = await getCheckoutSessionStatus(sessionId);
```

---

### saveSubscriptionToDatabase()
Guarda datos de suscripción en Supabase

```typescript
await saveSubscriptionToDatabase({
  userId: "uuid",
  plan: "pro",
  stripeCustomerId: "cus_...",
  stripeSubscriptionId: "sub_..."
});
```

---

## Database Queries

### Obtener profile
```sql
SELECT * FROM profiles WHERE id = '${userId}';
```

### Actualizar plan
```sql
UPDATE profiles 
SET plan = 'pro', subscription_status = 'active'
WHERE id = '${userId}';
```

### Obtener usuarios en trial
```sql
SELECT * FROM profiles 
WHERE trial_ends_at > NOW() 
  AND subscription_status = 'trialing';
```

### Obtener usuarios con WhatsApp activo
```sql
SELECT * FROM profiles 
WHERE whatsapp_notificaciones = true
  AND whatsapp IS NOT NULL;
```

---

## Error Codes

| Código | Significado |
|--------|------------|
| 200 | OK - Éxito |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - No autenticado |
| 402 | Payment Required - Pago fallido |
| 403 | Forbidden - No autorizado |
| 404 | Not Found - Recurso no existe |
| 500 | Server Error - Error del servidor |

---

## Rate Limiting

- API general: 100 requests/minuto
- Auth: 5 intentos/minuto
- Webhook: Sin límite (Stripe verifica signature)
- Cron: 1 ejecución/hora

---

## Authentication

Todos los endpoints excepto signup/login requieren:

**Header:**
```
Authorization: Bearer ${access_token}
```

O la sesión en cookie (automático en Next.js)

---

## Testing API

### Usando cURL

```bash
# Crear sesión de checkout
curl -X POST https://brujula-piscis.vercel.app/api/stripe/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "brujula-pro",
    "userId": "user-uuid"
  }'

# Obtener status de sesión
curl "https://brujula-piscis.vercel.app/api/stripe/session-status?session_id=cs_..."

# Suscribir a WhatsApp
curl -X POST https://brujula-piscis.vercel.app/api/whatsapp/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+5215512345678",
    "time": "09:00",
    "userId": "user-uuid"
  }'
```

---

## Webhook Secret Verification

Stripe signature es verificada automáticamente en el webhook:

```typescript
const sig = req.headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(
  body,
  sig,
  process.env.STRIPE_WEBHOOK_SECRET!
);
```

---

## Environment Variables Requeridas

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=whatsapp:+52...
CRON_SECRET=
```

---

**Última actualización: 2026-03-21**
