/*
  # API Keys Management System

  1. New Tables
    - `api_keys`
      - `id` (uuid, primary key) - Unique identifier for each API key
      - `key_name` (text) - Human-readable name for the key
      - `key_value` (text) - The actual API key value (encrypted)
      - `provider` (text) - API provider name (e.g., 'LTA_DataMall')
      - `is_active` (boolean) - Whether the key is currently active
      - `usage_count` (integer) - Track number of times key has been used
      - `last_used_at` (timestamptz) - When the key was last used
      - `created_at` (timestamptz) - When the key was added
      - `notes` (text) - Optional notes about the key
  
  2. Security
    - Enable RLS on `api_keys` table
    - Add policy for public read access (keys are needed client-side for API calls)
  
  3. Purpose
    - Store multiple LTA DataMall API keys
    - Enable key rotation and load balancing
    - Track usage patterns
*/

CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key_name text NOT NULL,
  key_value text NOT NULL,
  provider text DEFAULT 'LTA_DataMall',
  is_active boolean DEFAULT true,
  usage_count integer DEFAULT 0,
  last_used_at timestamptz,
  created_at timestamptz DEFAULT now(),
  notes text
);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active API keys"
  ON api_keys
  FOR SELECT
  USING (is_active = true);

CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(is_active, provider);
CREATE INDEX IF NOT EXISTS idx_api_keys_usage ON api_keys(usage_count, last_used_at);

-- Insert the first API key
INSERT INTO api_keys (key_name, key_value, provider, notes)
VALUES (
  'LTA Key 1',
  'QA7lLCFIScWDPZ4g4GAhKQ==',
  'LTA_DataMall',
  'First API key provided'
)
ON CONFLICT DO NOTHING;