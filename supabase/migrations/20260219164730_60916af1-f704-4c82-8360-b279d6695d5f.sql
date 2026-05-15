
-- CPUs table
CREATE TABLE public.cpus (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  cores INTEGER NOT NULL,
  threads INTEGER NOT NULL,
  socket TEXT NOT NULL,
  tdp INTEGER NOT NULL,
  benchmark_score INTEGER NOT NULL,
  supported_ram_type TEXT NOT NULL,
  price_tier TEXT NOT NULL CHECK (price_tier IN ('budget', 'mid', 'high', 'premium')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- GPUs table
CREATE TABLE public.gpus (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  vram INTEGER NOT NULL,
  benchmark_score INTEGER NOT NULL,
  power_consumption INTEGER NOT NULL,
  price_tier TEXT NOT NULL CHECK (price_tier IN ('budget', 'mid', 'high', 'premium')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Motherboards table
CREATE TABLE public.motherboards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  socket TEXT NOT NULL,
  chipset TEXT NOT NULL,
  ram_support TEXT NOT NULL,
  form_factor TEXT NOT NULL,
  price_tier TEXT NOT NULL CHECK (price_tier IN ('budget', 'mid', 'high', 'premium')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RAM table
CREATE TABLE public.ram (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  type TEXT NOT NULL,
  speed INTEGER NOT NULL,
  price_tier TEXT NOT NULL CHECK (price_tier IN ('budget', 'mid', 'high', 'premium')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Storage table
CREATE TABLE public.storage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('SSD', 'HDD', 'NVMe')),
  capacity INTEGER NOT NULL,
  speed INTEGER NOT NULL,
  price_tier TEXT NOT NULL CHECK (price_tier IN ('budget', 'mid', 'high', 'premium')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- PSUs table
CREATE TABLE public.psus (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  wattage INTEGER NOT NULL,
  efficiency_rating TEXT NOT NULL,
  price_tier TEXT NOT NULL CHECK (price_tier IN ('budget', 'mid', 'high', 'premium')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Cooling table
CREATE TABLE public.cooling (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('air', 'AIO', 'custom')),
  supported_sockets TEXT[] NOT NULL DEFAULT '{}',
  price_tier TEXT NOT NULL CHECK (price_tier IN ('budget', 'mid', 'high', 'premium')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Cabinets table
CREATE TABLE public.cabinets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  form_factor TEXT NOT NULL,
  price_tier TEXT NOT NULL CHECK (price_tier IN ('budget', 'mid', 'high', 'premium')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables (public read access, no auth needed)
ALTER TABLE public.cpus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gpus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motherboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ram ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cooling ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cabinets ENABLE ROW LEVEL SECURITY;

-- Public read policies for all tables
CREATE POLICY "Public read cpus" ON public.cpus FOR SELECT USING (true);
CREATE POLICY "Public read gpus" ON public.gpus FOR SELECT USING (true);
CREATE POLICY "Public read motherboards" ON public.motherboards FOR SELECT USING (true);
CREATE POLICY "Public read ram" ON public.ram FOR SELECT USING (true);
CREATE POLICY "Public read storage" ON public.storage FOR SELECT USING (true);
CREATE POLICY "Public read psus" ON public.psus FOR SELECT USING (true);
CREATE POLICY "Public read cooling" ON public.cooling FOR SELECT USING (true);
CREATE POLICY "Public read cabinets" ON public.cabinets FOR SELECT USING (true);
