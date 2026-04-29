create extension if not exists "pgcrypto";

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  instagram_handle text,
  skill_level text,
  profile_image_url text,
  status text default 'active',
  created_at timestamp with time zone default now()
);

create table if not exists seasons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  start_date date,
  end_date date,
  is_active boolean default false,
  created_at timestamp with time zone default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  season_id uuid references seasons(id),
  event_name text not null,
  event_type text default 'league',
  week_number int,
  event_date date,
  location text,
  entry_fee numeric default 15,
  organizer_cut_per_player numeric default 3,
  status text default 'scheduled',
  created_at timestamp with time zone default now()
);

create table if not exists registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  player_id uuid references players(id) on delete cascade,
  checked_in boolean default false,
  paid boolean default false,
  amount_paid numeric default 0,
  payment_method text,
  notes text,
  created_at timestamp with time zone default now()
);

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  player_a_id uuid references players(id),
  player_b_id uuid references players(id),
  winner_id uuid references players(id),
  loser_id uuid references players(id),
  game_scores text,
  games_won_a int,
  games_won_b int,
  point_diff int,
  game_diff int,
  match_type text,
  verified boolean default false,
  created_at timestamp with time zone default now()
);

create table if not exists payouts (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  total_collected numeric,
  organizer_cut_total numeric,
  prize_pool_total numeric,
  first_place_player_id uuid references players(id),
  first_place_amount numeric,
  second_place_player_id uuid references players(id),
  second_place_amount numeric,
  third_place_player_id uuid references players(id),
  third_place_amount numeric,
  status text default 'pending',
  created_at timestamp with time zone default now()
);
