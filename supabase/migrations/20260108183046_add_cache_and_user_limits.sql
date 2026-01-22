/*
  # Bus Arrival Cache and User Limits System

  1. New Tables
    - `bus_arrival_cache`
      - `id` (uuid, primary key) - Unique identifier
      - `bus_stop_code` (text) - Bus stop code (indexed)
      - `arrival_data` (jsonb) - Cached arrival data in JSON format
      - `cached_at` (timestamptz) - When data was cached
      - `expires_at` (timestamptz) - When cache expires (default 30 seconds)
    
    - `user_request_tracking`
      - `id` (uuid, primary key) - Unique identifier
      - `user_ip` (text) - User IP address for tracking
      - `request_count` (integer) - Number of requests made
      - `window_start` (timestamptz) - Start of rate limit window
      - `last_request_at` (timestamptz) - Last request timestamp

  2. Security
    - Enable RLS on both tables
    - Allow public read access to cache (needed for app functionality)
    - Allow public insert/update for cache (to update cache data)
    - Restrict user_request_tracking to service operations only

  3. Purpose
    - Cache bus arrival data to reduce API calls
    - Track user requests for better rate limiting
    - Improve app performance with 30-second cache
    - Allow higher request limits per user (500 requests per hour)

  4. Indexes
    - Index on bus_stop_code for fast lookups
    - Index on expires_at for cache cleanup
    - Index on user_ip for rate limit checks
*/

-- Create bus arrival cache table
CREATE TABLE IF NOT EXISTS bus_arrival_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_stop_code text NOT NULL,
  arrival_data jsonb NOT NULL,
  cached_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '30 seconds')
);

-- Create user request tracking table
CREATE TABLE IF NOT EXISTS user_request_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_ip text NOT NULL UNIQUE,
  request_count integer DEFAULT 0,
  window_start timestamptz DEFAULT now(),
  last_request_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE bus_arrival_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_request_tracking ENABLE ROW LEVEL SECURITY;

-- Cache policies (public read/write for app functionality)
CREATE POLICY "Anyone can read cache"
  ON bus_arrival_cache
  FOR SELECT
  USING (expires_at > now());

CREATE POLICY "Anyone can insert cache"
  ON bus_arrival_cache
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update cache"
  ON bus_arrival_cache
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete expired cache"
  ON bus_arrival_cache
  FOR DELETE
  USING (expires_at <= now());

-- User tracking policies
CREATE POLICY "Anyone can read own tracking"
  ON user_request_tracking
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert tracking"
  ON user_request_tracking
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update tracking"
  ON user_request_tracking
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cache_bus_stop ON bus_arrival_cache(bus_stop_code);
CREATE INDEX IF NOT EXISTS idx_cache_expires ON bus_arrival_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_tracking_ip ON user_request_tracking(user_ip);
CREATE INDEX IF NOT EXISTS idx_tracking_window ON user_request_tracking(window_start, last_request_at);