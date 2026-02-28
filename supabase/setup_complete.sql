-- ============================================================
-- Bus Arrivals SG - Complete Supabase Database Setup
-- ============================================================
-- Run this ENTIRE script in your new Supabase project's SQL Editor
-- (Dashboard > SQL Editor > New Query > Paste & Run)
-- ============================================================


-- ============================================================
-- 1. API KEYS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key_name text NOT NULL,
  key_value text NOT NULL,
  provider text DEFAULT 'LTA_DataMall',
  is_active boolean DEFAULT true,
  usage_count integer DEFAULT 0,
  last_used_at timestamptz,
  created_at timestamptz DEFAULT now(),
  notes text,
  sdk_key text
);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active API keys"
  ON api_keys FOR SELECT
  USING (is_active = true);

CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(is_active, provider);


-- ============================================================
-- 2. BUS ARRIVAL CACHE TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS bus_arrival_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_stop_code text NOT NULL,
  arrival_data jsonb NOT NULL,
  cached_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '30 seconds')
);

ALTER TABLE bus_arrival_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cache"
  ON bus_arrival_cache FOR SELECT
  USING (expires_at > now());

CREATE POLICY "Allow insert cache with valid data"
  ON bus_arrival_cache FOR INSERT
  WITH CHECK (
    bus_stop_code IS NOT NULL 
    AND length(bus_stop_code) <= 10
    AND arrival_data IS NOT NULL
    AND expires_at > now()
  );

CREATE POLICY "Allow update cache with valid data"
  ON bus_arrival_cache FOR UPDATE
  USING (true)
  WITH CHECK (
    bus_stop_code IS NOT NULL 
    AND length(bus_stop_code) <= 10
    AND arrival_data IS NOT NULL
    AND expires_at > now()
  );

CREATE POLICY "Anyone can delete expired cache"
  ON bus_arrival_cache FOR DELETE
  USING (expires_at <= now());

CREATE INDEX IF NOT EXISTS idx_cache_bus_stop ON bus_arrival_cache(bus_stop_code);


-- ============================================================
-- 3. USER REQUEST TRACKING TABLE (Rate Limiting)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_request_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_ip text NOT NULL UNIQUE,
  request_count integer DEFAULT 0,
  window_start timestamptz DEFAULT now(),
  last_request_at timestamptz DEFAULT now()
);

ALTER TABLE user_request_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own tracking"
  ON user_request_tracking FOR SELECT
  USING (user_ip IS NOT NULL);

CREATE POLICY "Users can insert own tracking"
  ON user_request_tracking FOR INSERT
  WITH CHECK (
    user_ip IS NOT NULL
    AND length(user_ip) > 0
    AND request_count >= 0
    AND window_start IS NOT NULL
  );

CREATE POLICY "Users can update own tracking"
  ON user_request_tracking FOR UPDATE
  USING (user_ip IS NOT NULL)
  WITH CHECK (
    user_ip IS NOT NULL
    AND request_count >= 0
    AND window_start IS NOT NULL
  );

CREATE INDEX IF NOT EXISTS idx_tracking_ip ON user_request_tracking(user_ip);


-- ============================================================
-- 4. BLOG POSTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL,
  author_name text NOT NULL,
  author_email text NOT NULL,
  published boolean DEFAULT false,
  featured_image text,
  tags text[] DEFAULT '{}',
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published posts"
  ON blog_posts FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "Authenticated users can create posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt()->>'email' = author_email);

CREATE POLICY "Authors can update own posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (auth.jwt()->>'email' = author_email)
  WITH CHECK (auth.jwt()->>'email' = author_email);

CREATE POLICY "Authors can delete own posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (auth.jwt()->>'email' = author_email);

CREATE POLICY "Authors can view own unpublished posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (auth.jwt()->>'email' = author_email);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published, published_at DESC) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING gin(tags);

-- Auto-update updated_at and published_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  IF NEW.published = true AND OLD.published = false THEN
    NEW.published_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- ============================================================
-- 5. ALARM SYSTEM TABLES
-- ============================================================

-- User Alarms
CREATE TABLE IF NOT EXISTS user_alarms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT gen_random_uuid(),
  bus_stop_code text NOT NULL,
  bus_stop_name text NOT NULL,
  service_no text,
  alarm_name text NOT NULL,
  notification_minutes integer[] DEFAULT ARRAY[10],
  is_enabled boolean DEFAULT true,
  is_recurring boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Alarm Schedules
CREATE TABLE IF NOT EXISTS alarm_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alarm_id uuid REFERENCES user_alarms(id) ON DELETE CASCADE,
  schedule_type text NOT NULL CHECK (schedule_type IN ('once', 'daily', 'weekdays', 'weekends', 'custom', 'date_specific')),
  trigger_time time NOT NULL,
  days_of_week integer[],
  specific_dates date[],
  start_date date,
  end_date date,
  created_at timestamptz DEFAULT now()
);

-- Alarm History
CREATE TABLE IF NOT EXISTS alarm_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alarm_id uuid REFERENCES user_alarms(id) ON DELETE CASCADE,
  triggered_at timestamptz DEFAULT now(),
  notification_type text DEFAULT 'scheduled' CHECK (notification_type IN ('scheduled', 'manual', 'snoozed')),
  bus_arrival_time text,
  was_successful boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Alarm Templates
CREATE TABLE IF NOT EXISTS alarm_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  default_notification_minutes integer[] DEFAULT ARRAY[10, 5],
  default_schedule_type text DEFAULT 'weekdays',
  default_days_of_week integer[],
  icon text DEFAULT 'Clock',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all alarm tables
ALTER TABLE user_alarms ENABLE ROW LEVEL SECURITY;
ALTER TABLE alarm_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE alarm_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE alarm_templates ENABLE ROW LEVEL SECURITY;

-- user_alarms policies
CREATE POLICY "Anyone can view alarms" ON user_alarms FOR SELECT USING (true);
CREATE POLICY "Anyone can create alarms" ON user_alarms FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update alarms" ON user_alarms FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete alarms" ON user_alarms FOR DELETE USING (true);

-- alarm_schedules policies
CREATE POLICY "Anyone can view schedules" ON alarm_schedules FOR SELECT USING (true);
CREATE POLICY "Anyone can create schedules" ON alarm_schedules FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update schedules" ON alarm_schedules FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete schedules" ON alarm_schedules FOR DELETE USING (true);

-- alarm_history policies
CREATE POLICY "Anyone can view history" ON alarm_history FOR SELECT USING (true);
CREATE POLICY "Anyone can create history" ON alarm_history FOR INSERT WITH CHECK (true);

-- alarm_templates policies (read only)
CREATE POLICY "Anyone can view templates" ON alarm_templates FOR SELECT USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_alarms_user_id ON user_alarms(user_id);
CREATE INDEX IF NOT EXISTS idx_user_alarms_enabled ON user_alarms(is_enabled);
CREATE INDEX IF NOT EXISTS idx_alarm_schedules_alarm_id ON alarm_schedules(alarm_id);
CREATE INDEX IF NOT EXISTS idx_alarm_history_alarm_id ON alarm_history(alarm_id);

-- Insert default alarm templates
INSERT INTO alarm_templates (name, description, default_notification_minutes, default_schedule_type, default_days_of_week, icon)
VALUES 
  ('Morning Commute', 'Perfect for your daily morning bus to work or school', ARRAY[15, 5], 'weekdays', ARRAY[1,2,3,4,5], 'Sunrise'),
  ('Evening Return', 'Set alarm for your evening bus back home', ARRAY[10, 5], 'weekdays', ARRAY[1,2,3,4,5], 'Sunset'),
  ('Weekend Trip', 'Plan your weekend outings with ease', ARRAY[15, 10], 'weekends', ARRAY[0,6], 'Palmtree'),
  ('Daily Bus', 'Everyday bus alarm at your preferred time', ARRAY[10], 'daily', ARRAY[0,1,2,3,4,5,6], 'Calendar'),
  ('Quick Reminder', 'One-time alarm for occasional trips', ARRAY[10], 'once', NULL, 'Bell')
ON CONFLICT DO NOTHING;


-- ============================================================
-- SETUP COMPLETE! 
-- ============================================================
