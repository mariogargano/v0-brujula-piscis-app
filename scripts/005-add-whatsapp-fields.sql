-- Add WhatsApp notification fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS whatsapp text,
ADD COLUMN IF NOT EXISTS whatsapp_notificaciones boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS hora_notificacion text DEFAULT '09:00';

-- Create index for efficient cron queries
CREATE INDEX IF NOT EXISTS idx_profiles_whatsapp_notifications 
ON public.profiles (hora_notificacion) 
WHERE whatsapp_notificaciones = true AND whatsapp IS NOT NULL;
