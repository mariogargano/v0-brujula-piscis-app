# Testing WhatsApp Integration

## Estado del Sistema

✅ **Código de WhatsApp:** Completamente implementado
✅ **Cron Job:** Configurado para ejecutarse cada hora
✅ **Base de Datos:** Campos de WhatsApp agregados
✅ **Twilio Integration:** Configurada

## Cómo Funciona

1. **Usuario se suscribe** en el modal de WhatsApp
2. **Se guarda en Supabase** con número de teléfono y hora
3. **Cada hora**, el cron job chequea usuarios con esa hora
4. **Se envía mensaje** personalizado por WhatsApp

## Pruebas Manuales

### Test 1: Enviar Mensaje de Prueba

```bash
curl -X POST http://localhost:3000/api/whatsapp/send-daily \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "5215512345678",
    "testMessage": "Hola! Este es un mensaje de prueba de Brujula Piscis."
  }'
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "phone": "+5215512345678",
  "message": "Message sent successfully"
}
```

### Test 2: Suscribir a WhatsApp

```bash
curl -X POST http://localhost:3000/api/whatsapp/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "5215512345678",
    "time": "09:00",
    "userId": "user-uuid-here"
  }'
```

### Test 3: Desuscribir

```bash
curl -X DELETE "http://localhost:3000/api/whatsapp/send-daily?userId=user-uuid-here"
```

## Verificar en Producción

### 1. Logs de Vercel Cron

Ve a tu proyecto en Vercel Dashboard:
- Deployments > Select latest
- Functions (en tabs)
- Busca `/api/whatsapp/send-daily`
- Verás los logs de cada ejecución

### 2. Revisar en Supabase

Query para ver usuarios suscritos:
```sql
SELECT id, nombre, whatsapp, whatsapp_notificaciones, hora_notificacion 
FROM profiles 
WHERE whatsapp_notificaciones = true;
```

### 3. Prueba End-to-End

1. Regístrate en Brújula Piscis
2. Ve a Perfil > WhatsApp
3. Ingresa tu número de WhatsApp
4. Espera a la próxima hora (máximo 1 hora)
5. Deberías recibir un mensaje

## Troubleshooting

### Error: "Twilio credentials not configured"

**Solución:** Verifica que estas variables estén en Vercel:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_NUMBER`
- `CRON_SECRET`

### No se reciben mensajes

**Checklist:**
1. ¿Está el número correcto guardado en Supabase?
2. ¿Es un número válido de WhatsApp?
3. ¿La hora coincide con `hora_notificacion`?
4. ¿`whatsapp_notificaciones` está en `true`?

### Mensaje llega muy tarde/temprano

**Causa:** Zona horaria en servidor
**Solución:** El código usa zona horaria de México (America/Mexico_City)

## Mensajes Disponibles

El sistema tiene 31 mensajes inspiracionales únicos, rotando cada día:

- "Buenos dias, Piscis. Hoy tu intuicion esta en su punto mas alto..."
- "Querido Piscis, las estrellas te sonrien hoy..."
- Y 29 más...

Cada usuario recibe el mensaje personalizado con su nombre.

## Estadísticas

- **Mensajes únicos:** 31
- **Rotación:** Cada 31 días se repite el ciclo
- **Personalización:** Se reemplaza "Piscis" por el nombre del usuario
- **Horas disponibles:** 7am a 8pm (13 horarios)

## Monitoreo Continuo

Vercel monitorea automáticamente:
- Tasa de éxito/error
- Latencia
- Errores de Twilio
- Fallos de base de datos

Ve a Vercel Dashboard > Monitoring para ver métricas en tiempo real.
