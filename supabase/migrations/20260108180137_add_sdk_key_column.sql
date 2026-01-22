/*
  # Add SDK Key Column to API Keys Table

  1. Changes
    - Add `sdk_key` column to `api_keys` table to store SDK keys alongside API keys
    - This allows storing both LTA DataMall API Key and SDK Key for each account
  
  2. Notes
    - SDK Key is optional (nullable) as some providers may not have separate SDK keys
    - Existing rows will have NULL sdk_key until updated
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'api_keys' AND column_name = 'sdk_key'
  ) THEN
    ALTER TABLE api_keys ADD COLUMN sdk_key text;
  END IF;
END $$;
