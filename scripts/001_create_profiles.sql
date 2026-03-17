-- Create profiles table for Brujula Piscis users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text,
  pisces_tipo text check (pisces_tipo in ('soñador', 'intuitivo', 'creativo', 'empatico')),
  fecha_nacimiento date,
  hora_nacimiento time,
  ciudad text,
  telefono text,
  plan text default 'gratis' check (plan in ('gratis', 'basico', 'pro')),
  whatsapp text,
  whatsapp_notificaciones boolean default false,
  hora_notificacion text default '09:00',
  decisiones_usadas_esta_semana integer default 0,
  ultimo_reset_semanal timestamp with time zone default now(),
  en_comunidad boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- Index for performance
create index if not exists profiles_id_idx on public.profiles(id);
