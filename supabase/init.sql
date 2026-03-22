-- MeetMates: создание таблиц в Supabase
-- Запусти этот скрипт в SQL Editor в Supabase Dashboard

-- Таблица пользователей
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('local', 'tourist')),
  interests TEXT[] DEFAULT '{}',
  avatar TEXT DEFAULT 'green-hat',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Таблица матчей (кто с кем хочет встретиться)
CREATE TABLE matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  mate_id UUID NOT NULL REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Таблица оценок
CREATE TABLE ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID NOT NULL REFERENCES users(id),
  to_user_id UUID NOT NULL REFERENCES users(id),
  safety INTEGER NOT NULL CHECK (safety BETWEEN 1 AND 10),
  experience INTEGER NOT NULL CHECK (experience BETWEEN 1 AND 10),
  communication INTEGER NOT NULL CHECK (communication BETWEEN 1 AND 10),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Включаем Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Политики: разрешаем всё для анонимных пользователей (для MVP)
-- В продакшене нужно будет ограничить
CREATE POLICY "Allow all for users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for matches" ON matches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for ratings" ON ratings FOR ALL USING (true) WITH CHECK (true);
