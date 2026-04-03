create extension if not exists "uuid-ossp";

create table users (
  id uuid primary key default uuid_generate_v4(),
  name text,
  email text unique,
  password text,
  role text default 'driver'
);

create table policies (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id),
  plan text,
  premium float,
  created_at timestamp default now()
);

create table claims (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id),
  amount float,
  status text,
  created_at timestamp default now()
);