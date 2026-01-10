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
