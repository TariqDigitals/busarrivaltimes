/*
  # Alarm System Implementation

  1. New Tables
    - user_alarms: Stores user alarm configurations
    - alarm_schedules: Defines when alarms should trigger
    - alarm_history: Logs all alarm notifications
    - alarm_templates: Pre-made alarm templates

  2. Security
    - RLS enabled on all tables
    - Policies for managing alarms
*/

-- Create user_alarms table
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

-- Create alarm_schedules table
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

-- Create alarm_history table
CREATE TABLE IF NOT EXISTS alarm_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alarm_id uuid REFERENCES user_alarms(id) ON DELETE CASCADE,
  triggered_at timestamptz DEFAULT now(),
  notification_type text DEFAULT 'scheduled' CHECK (notification_type IN ('scheduled', 'manual', 'snoozed')),
  bus_arrival_time text,
  was_successful boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create alarm_templates table
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

-- Enable RLS
ALTER TABLE user_alarms ENABLE ROW LEVEL SECURITY;
ALTER TABLE alarm_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE alarm_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE alarm_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_alarms
CREATE POLICY "Anyone can view alarms"
  ON user_alarms FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create alarms"
  ON user_alarms FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update alarms"
  ON user_alarms FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete alarms"
  ON user_alarms FOR DELETE
  USING (true);

-- RLS Policies for alarm_schedules
CREATE POLICY "Anyone can view schedules"
  ON alarm_schedules FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create schedules"
  ON alarm_schedules FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update schedules"
  ON alarm_schedules FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete schedules"
  ON alarm_schedules FOR DELETE
  USING (true);

-- RLS Policies for alarm_history
CREATE POLICY "Anyone can view history"
  ON alarm_history FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create history"
  ON alarm_history FOR INSERT
  WITH CHECK (true);

-- RLS Policies for alarm_templates (public read)
CREATE POLICY "Anyone can view templates"
  ON alarm_templates FOR SELECT
  USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_alarms_user_id ON user_alarms(user_id);
CREATE INDEX IF NOT EXISTS idx_user_alarms_enabled ON user_alarms(is_enabled);
CREATE INDEX IF NOT EXISTS idx_alarm_schedules_alarm_id ON alarm_schedules(alarm_id);
CREATE INDEX IF NOT EXISTS idx_alarm_history_alarm_id ON alarm_history(alarm_id);

-- Insert default templates
INSERT INTO alarm_templates (name, description, default_notification_minutes, default_schedule_type, default_days_of_week, icon)
VALUES 
  ('Morning Commute', 'Perfect for your daily morning bus to work or school', ARRAY[15, 5], 'weekdays', ARRAY[1,2,3,4,5], 'Sunrise'),
  ('Evening Return', 'Set alarm for your evening bus back home', ARRAY[10, 5], 'weekdays', ARRAY[1,2,3,4,5], 'Sunset'),
  ('Weekend Trip', 'Plan your weekend outings with ease', ARRAY[15, 10], 'weekends', ARRAY[0,6], 'Palmtree'),
  ('Daily Bus', 'Everyday bus alarm at your preferred time', ARRAY[10], 'daily', ARRAY[0,1,2,3,4,5,6], 'Calendar'),
  ('Quick Reminder', 'One-time alarm for occasional trips', ARRAY[10], 'once', NULL, 'Bell')
ON CONFLICT DO NOTHING;