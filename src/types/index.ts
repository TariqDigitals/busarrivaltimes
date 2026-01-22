export interface BusStop {
  code: string;
  name: string;
  road: string;
  latitude: number;
  longitude: number;
}

export interface BusArrival {
  time: string;
  duration_ms: number;
  lat: number;
  lng: number;
  load: 'SEA' | 'SDA' | 'LSD' | '';
  feature: 'WAB' | '';
  type: 'SD' | 'DD' | 'BD' | '';
  visit_number: string;
  origin_code: string;
  destination_code: string;
}

export interface BusService {
  no: string;
  operator: string;
  next?: BusArrival;
  subsequent?: BusArrival;
  next2?: BusArrival;
  next3?: BusArrival;
}

export interface ArriveLahResponse {
  services: BusService[];
}

export interface BusStopsRawData {
  [code: string]: [number, number, string, string];
}

export type LoadStatus = 'SEA' | 'SDA' | 'LSD' | '';

export interface NearbyStop extends BusStop {
  distance: number;
  walkingTime: number;
}

export type ScheduleType = 'once' | 'daily' | 'weekdays' | 'weekends' | 'custom' | 'date_specific';
export type NotificationType = 'scheduled' | 'manual' | 'snoozed';

export interface AlarmSchedule {
  id: string;
  alarm_id: string;
  schedule_type: ScheduleType;
  trigger_time: string;
  days_of_week?: number[];
  specific_dates?: string[];
  start_date?: string;
  end_date?: string;
  created_at: string;
}

export interface UserAlarm {
  id: string;
  user_id: string;
  bus_stop_code: string;
  bus_stop_name: string;
  service_no?: string;
  alarm_name: string;
  notification_minutes: number[];
  is_enabled: boolean;
  is_recurring: boolean;
  created_at: string;
  updated_at: string;
  schedules?: AlarmSchedule[];
}

export interface AlarmHistory {
  id: string;
  alarm_id: string;
  triggered_at: string;
  notification_type: NotificationType;
  bus_arrival_time?: string;
  was_successful: boolean;
  created_at: string;
}

export interface AlarmTemplate {
  id: string;
  name: string;
  description: string;
  default_notification_minutes: number[];
  default_schedule_type: ScheduleType;
  default_days_of_week?: number[];
  icon: string;
  created_at: string;
}
