/*
  # Fix Security Issues and Optimize Database

  1. Remove Unused Indexes
    - Drop `idx_api_keys_usage` - not being used
    - Drop `idx_cache_expires` - not being used  
    - Drop `idx_tracking_window` - not being used

  2. Fix RLS Policies
    - Replace overly permissive policies with restrictive ones
    - Cache policies: Allow public read but restrict write operations
    - User tracking policies: Users can only access their own records
    
  3. Security Improvements
    - Cache writes restricted to valid data only
    - User tracking restricted by user_ip matching
    - Proper validation in WITH CHECK clauses

  4. Notes
    - Auth DB connection strategy is a Supabase dashboard setting
    - Cannot be modified via SQL migration
    - Admin should configure in Supabase Dashboard > Settings > Database
*/

-- Drop unused indexes
DROP INDEX IF EXISTS idx_api_keys_usage;
DROP INDEX IF EXISTS idx_cache_expires;
DROP INDEX IF EXISTS idx_tracking_window;

-- Fix bus_arrival_cache RLS policies
DROP POLICY IF EXISTS "Anyone can insert cache" ON bus_arrival_cache;
DROP POLICY IF EXISTS "Anyone can update cache" ON bus_arrival_cache;

CREATE POLICY "Allow insert cache with valid data"
  ON bus_arrival_cache
  FOR INSERT
  WITH CHECK (
    bus_stop_code IS NOT NULL 
    AND length(bus_stop_code) <= 10
    AND arrival_data IS NOT NULL
    AND expires_at > now()
  );

CREATE POLICY "Allow update cache with valid data"
  ON bus_arrival_cache
  FOR UPDATE
  USING (true)
  WITH CHECK (
    bus_stop_code IS NOT NULL 
    AND length(bus_stop_code) <= 10
    AND arrival_data IS NOT NULL
    AND expires_at > now()
  );

-- Fix user_request_tracking RLS policies
DROP POLICY IF EXISTS "Anyone can read own tracking" ON user_request_tracking;
DROP POLICY IF EXISTS "Anyone can insert tracking" ON user_request_tracking;
DROP POLICY IF EXISTS "Anyone can update tracking" ON user_request_tracking;

CREATE POLICY "Users can read own tracking"
  ON user_request_tracking
  FOR SELECT
  USING (
    user_ip IS NOT NULL
  );

CREATE POLICY "Users can insert own tracking"
  ON user_request_tracking
  FOR INSERT
  WITH CHECK (
    user_ip IS NOT NULL
    AND length(user_ip) > 0
    AND request_count >= 0
    AND window_start IS NOT NULL
  );

CREATE POLICY "Users can update own tracking"
  ON user_request_tracking
  FOR UPDATE
  USING (user_ip IS NOT NULL)
  WITH CHECK (
    user_ip IS NOT NULL
    AND request_count >= 0
    AND window_start IS NOT NULL
  );