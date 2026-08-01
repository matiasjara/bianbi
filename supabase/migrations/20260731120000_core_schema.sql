-- Demand Engine — esquema núcleo
-- Propiedades → POIs → Eventos → Intenciones → Campañas → Oportunidades

create extension if not exists "pgcrypto";

create type poi_category as enum (
  'venue', 'barrio', 'atraccion', 'salud', 'transporte', 'gastronomia', 'cultura'
);

create type event_audience as enum (
  'conciertos', 'deportes', 'congresos', 'festivales', 'turismo', 'negocios', 'familias'
);

create type demand_level as enum ('baja', 'media', 'alta', 'muy_alta');
create type event_status as enum ('upcoming', 'active', 'ended');
create type intention_status as enum ('draft', 'published', 'archived');
create type campaign_status as enum ('draft', 'pending_approval', 'active', 'paused', 'ended');
create type opportunity_status as enum (
  'detected', 'content_ready', 'campaign_proposed', 'active', 'dismissed', 'expired'
);
create type campaign_channel as enum (
  'google_search', 'google_pmax', 'meta', 'tiktok', 'seo', 'remarketing'
);

create table properties (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  neighborhood text not null,
  address text not null,
  lat double precision not null,
  lng double precision not null,
  capacity int not null check (capacity > 0),
  bedrooms int not null default 1,
  amenities text[] not null default '{}',
  photos text[] not null default '{}',
  airbnb_url text not null,
  occupancy_next_30 numeric(4,3) not null default 0,
  available_nights_next_30 int not null default 0,
  metro_stations text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table pois (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category poi_category not null,
  lat double precision not null,
  lng double precision not null,
  influence_radius_km numeric(5,2) not null default 2,
  seasonality text,
  description text,
  created_at timestamptz not null default now()
);

create table property_pois (
  property_id uuid not null references properties(id) on delete cascade,
  poi_id uuid not null references pois(id) on delete cascade,
  distance_km numeric(6,2),
  primary key (property_id, poi_id)
);

create table events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  poi_id uuid not null references pois(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  estimated_attendance int,
  audience event_audience not null,
  expected_demand demand_level not null default 'media',
  status event_status not null default 'upcoming',
  created_at timestamptz not null default now()
);

create table intentions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  query text not null,
  headline text not null,
  supporting_copy text not null,
  poi_id uuid references pois(id),
  event_id uuid references events(id),
  landing_path text not null unique,
  seo_title text not null,
  seo_description text not null,
  cta_label text not null default 'Ver disponibilidad',
  status intention_status not null default 'draft',
  created_at timestamptz not null default now()
);

create table intention_properties (
  intention_id uuid not null references intentions(id) on delete cascade,
  property_id uuid not null references properties(id) on delete cascade,
  primary key (intention_id, property_id)
);

create table campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  intention_id uuid not null references intentions(id),
  channels campaign_channel[] not null default '{}',
  status campaign_status not null default 'draft',
  daily_budget_clp int not null default 0,
  spend_clp int not null default 0,
  conversions int not null default 0,
  nights_booked int not null default 0,
  starts_at date,
  ends_at date,
  created_at timestamptz not null default now()
);

create table opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  reason text not null,
  event_id uuid references events(id),
  intention_id uuid references intentions(id),
  score int not null check (score between 0 and 100),
  suggested_budget_clp int not null default 0,
  status opportunity_status not null default 'detected',
  missing_assets text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table opportunity_properties (
  opportunity_id uuid not null references opportunities(id) on delete cascade,
  property_id uuid not null references properties(id) on delete cascade,
  primary key (opportunity_id, property_id)
);

create index events_starts_at_idx on events (starts_at);
create index events_poi_id_idx on events (poi_id);
create index campaigns_status_idx on campaigns (status);
create index opportunities_status_idx on opportunities (status);
