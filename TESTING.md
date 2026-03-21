# 🧪 TESTING CHECKLIST - Brújula Piscis

## 1️⃣ AUTENTICACIÓN

### ✅ Email/Password Signup
```
- Ve a /auth/sign-up
- Ingresa email y contraseña
- Verifica que recibas email de confirmación
- Confirma el email
- Deberías ser redirigido a onboarding
```

### ✅ Email/Password Login
```
- Ve a /auth/login
- Ingresa credentials
- Deberías acceder a la app
```

### ✅ Google OAuth
```
- Haz clic en "Google" en login
- Completa el flow de Google
- Deberías crear cuenta automáticamente
```

### ✅ SMS/Phone (Twilio)
```
- Haz clic en "Teléfono" en login
- Ingresa número con formato +52...
- Deberías recibir código por SMS
- Ingresa el código
```

---

## 2️⃣ ONBOARDING

### ✅ Flujo Completo
```
- Paso 1: Click en "Empezar"
- Paso 2: Selecciona objetivo (ej: "Amor")
- Paso 3: Selecciona tono (ej: "Tarot")
- Paso 4: Selecciona frecuencia (ej: "Diario")
- Paso 5: Ingresa datos (nombre, fecha, ciudad)
- Paso 6: Selecciona plan (Free/Básico/Pro)
```

### ✅ Plan Free
```
- Selecciona "Continuar gratis"
- Deberías entrar a la app sin pagar
- En home deberías ver límite de 1 decisión/semana
```

---

## 3️⃣ PLANES Y PAGOS (Tarjeta de Prueba Stripe)

### ✅ Plan Básico - Trial
```
- Selecciona Plan Básico ($79 MXN/mes)
- Haz clic en "Empezar 7 días gratis"
- Te redirige a checkout de Stripe
- Ingresa tarjeta: 4242 4242 4242 4242
- Vence: cualquier fecha futura (ej: 12/25)
- CVC: 424
- Nombre: cualquier nombre
- Email: cualquier email
- Completa el pago
- Deberías ver "Tu prueba de 7 días ha comenzado"
- Ve a Supabase y verifica que tu profile tenga:
  - plan: "basico"
  - subscription_status: "trialing"
  - trial_ends_at: fecha en 7 días
```

### ✅ Plan Pro - Trial
```
- Abre paywall nuevamente (haz clic en feature bloqueada)
- Selecciona Plan Pro ($149 MXN/mes)
- Repite proceso de pago
- Deberías tener acceso a Mentor
```

### ✅ Tarjetas que Fallan (para testing error handling)
```
- 4000 0000 0000 0002: Card declined
- 4000 0025 0000 3155: Requires 3D Secure
```

---

## 4️⃣ FUNCIONALIDADES PRINCIPALES

### ✅ Home Screen
```
- Deberías ver card con pregunta del día
- Si eres Free: 1 decisión/semana
- Si eres Básico: 10 decisiones/mes
- Si eres Pro: ilimitadas
```

### ✅ Decidir Screen
```
- Ingresa tu pregunta
- Selecciona tipo de consulta (Tarot, Kabbalah, etc)
- Haz clic en "Consultar"
- Deberías recibir respuesta de IA
- Deberías ver tu pregunta en el historial
- Si excedes límite, deberías ver botón de upgrade
```

### ✅ Mentor Screen (Solo Pro)
```
- Si eres Free o Básico: deberías ver paywall
- Si eres Pro: deberías ver chat activo
- Escribe un mensaje
- Deberías recibir respuesta del Mentor
```

### ✅ Rituales Screen
```
- Si eres Free: no deberías ver rituales
- Si eres Básico: deberías ver 5 rituales
- Si eres Pro: deberías ver todos los rituales
- Haz clic en un ritual
- Deberías ver instrucciones completas
```

### ✅ Comunidad Screen
```
- Si eres Free: no deberías ver comunidad
- Si eres Básico o Pro: deberías ver salas
- Salas regulares: accesibles para todos
- Salas Pro: solo para Pro (otros ven paywall)
- Haz clic en una sala regular
- Deberías ver mensajes de otros usuarios
```

### ✅ Profile Screen
```
- Deberías ver tu nombre, plan actual
- Deberías ver tu email y fecha de nacimiento
- Deberías ver tu ciudad si la ingresaste
- Deberías ver botón de "Mensajes diarios" (WhatsApp)
- Deberías ver botón de "Soporte"
- Deberías ver botón de "Cerrar sesión"
```

---

## 5️⃣ WHATSAPP

### ✅ Suscripción a Mensajes
```
- En Profile, haz clic en "Mensajes diarios"
- Ingresa tu número de WhatsApp con formato +52...
- Selecciona hora de notificación
- Haz clic en "Guardar"
- Deberías ver "Notificaciones activadas"
- Ve a Supabase y verifica que tu profile tenga:
  - whatsapp: tu número
  - whatsapp_notificaciones: true
  - hora_notificacion: la hora que seleccionaste
```

### ✅ Mensajes Diarios
```
- El cron job se ejecuta cada hora
- A tu hora seleccionada deberías recibir mensaje en WhatsApp
- Deberías recibir mensaje diferente cada día (31 únicos)
- El mensaje debería incluir inspiración para Piscis
```

---

## 6️⃣ SOPORTE

### ✅ Modal de Soporte
```
- En Profile, haz clic en "Soporte"
- Deberías ver:
  - Email: soporte@brujulapiscis.com
  - WhatsApp: link directo
  - Preguntas frecuentes
- Haz clic en email → debería abrir tu cliente de email
- Haz clic en WhatsApp → debería abrir WhatsApp Web/app
```

---

## 7️⃣ LOGOUT

### ✅ Cerrar Sesión
```
- En Profile, haz clic en "Cerrar sesión"
- Deberías ver confirmación
- Haz clic en "Cerrar sesión"
- Deberías ser redirigido a /auth/login
- El local storage debería estar limpio
- En Supabase debería cerrarse la sesión
```

---

## 8️⃣ BASE DE DATOS

### ✅ Verificar Datos en Supabase
```
- Ve a Supabase Dashboard
- Tabla profiles debería tener:
  - id (user id)
  - nombre
  - plan (free, basico, pro)
  - whatsapp (si ingresó)
  - trial_ends_at (si está en trial)
  - subscription_status (active, trialing, canceled)
  - stripe_customer_id (si pagó)
  - stripe_subscription_id (si pagó)
```

---

## 9️⃣ ANALYTICS (Stripe)

### ✅ Verificar Pagos en Stripe
```
- Ve a Stripe Dashboard
- Deberías ver:
  - Checkout sessions completadas
  - Suscripciones activas
  - Customers creados
  - Invoices (facturas)
  - Trial period de 7 días
```

---

## 🔟 PERFORMANCE

### ✅ Velocidad de Carga
```
- Home debería cargar en < 2 segundos
- Decisiones debería cargar respuesta en < 5 segundos
- Mentor debería responder en < 10 segundos
```

### ✅ Responsive Design
```
- App debería verse bien en:
  - iPhone (375px)
  - iPad (768px)
  - Desktop (1024px+)
```

---

## 🎯 CASOS EDGE

### ✅ Limite de Decisiones Alcanzado
```
- Si eres Básico con 10 decisiones este mes
- Intenta hacer 11ª decisión
- Deberías ver paywall para upgrade
- Deberías poder completar la decisión si subes a Pro
```

### ✅ Trial Expirando
```
- Cuando falten 2 días para trial expirar
- Deberías ver notificación
- Si no actualizas, el 7º día se cobra automáticamente
```

### ✅ Cancelación de Suscripción
```
- En Stripe Dashboard, cancela la suscripción
- El webhook debería actualizar el plan a "free"
- El usuario debería ver plan "Free" en Profile
```

---

## ✅ CHECKLIST FINAL

- [ ] Todo el flujo de signup funciona
- [ ] Login con email, Google y SMS funcionan
- [ ] Onboarding se completa correctamente
- [ ] Plan Free permite 1 decisión/semana
- [ ] Planes pagos procesaron con Stripe
- [ ] Trial está registrado (7 días)
- [ ] WhatsApp recibe mensajes diarios
- [ ] Mentor solo accesible para Pro
- [ ] Rituales limitados según plan
- [ ] Comunidad funciona
- [ ] Logout limpia sesión
- [ ] BD está sincronizada
- [ ] Webhook de Stripe funciona
- [ ] Performance es óptimo
- [ ] UI/UX es responsive

---

**¡Si todo está ✅, estás listo para PRODUCCIÓN!** 🚀
