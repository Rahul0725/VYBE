-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends auth.users)
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  display_name text,
  bio text,
  avatar_url text,
  theme_color text default '#000000',
  theme_background text default '#ffffff',
  theme_config jsonb default '{}'::jsonb,
  is_published boolean default false,
  custom_domain text unique,
  social_links jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  seo_title text,
  seo_description text,
  og_image_url text,
  og_template_style text default 'default'
);

-- Links table
create table public.links (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  url text not null,
  icon text,
  position integer default 0,
  is_active boolean default true,
  click_count integer default 0,
  show_clicks boolean default true,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  animation text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Clicks table (for analytics)
create table public.clicks (
  id uuid default uuid_generate_v4() primary key,
  link_id uuid references public.links(id) on delete cascade not null,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
  user_agent text,
  country text,
  referer text
);

-- Preview Tokens table
create table public.preview_tokens (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  token text unique not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.links enable row level security;
alter table public.clicks enable row level security;
alter table public.preview_tokens enable row level security;

-- Policies for Users
create policy "Public profiles are viewable by everyone."
  on public.users for select
  using ( true );

create policy "Users can insert their own profile."
  on public.users for insert
  with check ( auth.uid() = id );

create policy "Users can update their own profile."
  on public.users for update
  using ( auth.uid() = id );

-- Policies for Links
create policy "Public links are viewable by everyone."
  on public.links for select
  using ( true );

create policy "Users can insert their own links."
  on public.links for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own links."
  on public.links for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own links."
  on public.links for delete
  using ( auth.uid() = user_id );

-- Policies for Clicks
create policy "Anyone can insert clicks."
  on public.clicks for insert
  with check ( true );

create policy "Users can view clicks for their own links."
  on public.clicks for select
  using ( 
    exists (
      select 1 from public.links
      where links.id = clicks.link_id
      and links.user_id = auth.uid()
    )
  );

-- Policies for Preview Tokens
create policy "Users can manage their own preview tokens."
  on public.preview_tokens for all
  using ( auth.uid() = user_id );

create policy "Anyone can read valid preview tokens."
  on public.preview_tokens for select
  using ( expires_at > now() );

-- Function to handle new user creation automatically (optional but recommended)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, username, display_name, avatar_url, theme_config)
  values (
    new.id, 
    new.raw_user_meta_data->>'username', 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    '{"template": "minimal", "accentColor": "#000000", "font": "inter"}'::jsonb
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
