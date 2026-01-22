import type { ArriveLahResponse, BusStop, BusStopsRawData } from '../types';
import { isValidBusStopCode } from '../utils/security';

const ARRIVELAH_API = 'https://arrivelah2.busrouter.sg';
const BUS_STOPS_API = 'https://data.busrouter.sg/v1/stops.min.json';
const LTA_API = 'http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2';

const LTA_API_KEYS = [
  import.meta.env.VITE_LTA_API_KEY_1,
  import.meta.env.VITE_LTA_API_KEY_2,
  import.meta.env.VITE_LTA_API_KEY_3,
  import.meta.env.VITE_LTA_API_KEY_4,
].filter(Boolean);

let currentKeyIndex = 0;

function getNextApiKey(): string | null {
  if (LTA_API_KEYS.length === 0) return null;

  const key = LTA_API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % LTA_API_KEYS.length;
  return key;
}

let busStopsCache: BusStop[] | null = null;

const arrivalCache = new Map<string, { data: ArriveLahResponse; timestamp: number }>();
const CACHE_DURATION = 30000;

async function fetchWithLTARotation(busStopCode: string): Promise<ArriveLahResponse> {
  const apiKey = getNextApiKey();

  if (!apiKey) {
    throw new Error('No LTA API key available');
  }

  const response = await fetch(
    `${LTA_API}?BusStopCode=${encodeURIComponent(busStopCode)}`,
    {
      headers: {
        'AccountKey': apiKey,
        'accept': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch bus arrivals from LTA');
  }

  const data = await response.json();

  return {
    BusStopCode: data.BusStopCode,
    Services: data.Services.map((service: any) => ({
      ServiceNo: service.ServiceNo,
      Operator: service.Operator,
      NextBus: {
        OriginCode: service.NextBus.OriginCode,
        DestinationCode: service.NextBus.DestinationCode,
        EstimatedArrival: service.NextBus.EstimatedArrival,
        Latitude: service.NextBus.Latitude,
        Longitude: service.NextBus.Longitude,
        VisitNumber: service.NextBus.VisitNumber,
        Load: service.NextBus.Load,
        Feature: service.NextBus.Feature,
        Type: service.NextBus.Type
      },
      NextBus2: service.NextBus2 ? {
        OriginCode: service.NextBus2.OriginCode,
        DestinationCode: service.NextBus2.DestinationCode,
        EstimatedArrival: service.NextBus2.EstimatedArrival,
        Latitude: service.NextBus2.Latitude,
        Longitude: service.NextBus2.Longitude,
        VisitNumber: service.NextBus2.VisitNumber,
        Load: service.NextBus2.Load,
        Feature: service.NextBus2.Feature,
        Type: service.NextBus2.Type
      } : undefined,
      NextBus3: service.NextBus3 ? {
        OriginCode: service.NextBus3.OriginCode,
        DestinationCode: service.NextBus3.DestinationCode,
        EstimatedArrival: service.NextBus3.EstimatedArrival,
        Latitude: service.NextBus3.Latitude,
        Longitude: service.NextBus3.Longitude,
        VisitNumber: service.NextBus3.VisitNumber,
        Load: service.NextBus3.Load,
        Feature: service.NextBus3.Feature,
        Type: service.NextBus3.Type
      } : undefined
    }))
  };
}

export async function fetchBusArrivals(busStopCode: string): Promise<ArriveLahResponse> {
  if (!isValidBusStopCode(busStopCode)) {
    throw new Error('Invalid bus stop code format');
  }

  const cached = arrivalCache.get(busStopCode);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  let arrivalData: ArriveLahResponse;

  try {
    const response = await fetch(`${ARRIVELAH_API}/?id=${encodeURIComponent(busStopCode)}`);
    if (!response.ok) {
      throw new Error('ArriveLah API failed');
    }
    arrivalData = await response.json();
  } catch (error) {
    console.warn('ArriveLah API failed, falling back to LTA:', error);

    try {
      arrivalData = await fetchWithLTARotation(busStopCode);
    } catch (ltaError) {
      console.error('Both APIs failed:', ltaError);
      throw new Error('Failed to fetch bus arrivals from all sources');
    }
  }

  arrivalCache.set(busStopCode, { data: arrivalData, timestamp: Date.now() });

  return arrivalData;
}

export async function fetchAllBusStops(): Promise<BusStop[]> {
  if (busStopsCache) {
    return busStopsCache;
  }

  const response = await fetch(BUS_STOPS_API);
  if (!response.ok) {
    throw new Error('Failed to fetch bus stops');
  }

  const rawData: BusStopsRawData = await response.json();
  const stops: BusStop[] = Object.entries(rawData).map(([code, data]) => ({
    code,
    longitude: data[0],
    latitude: data[1],
    name: data[2],
    road: data[3],
  }));

  busStopsCache = stops;
  return stops;
}

export function searchBusStops(stops: BusStop[], query: string): BusStop[] {
  if (!query.trim()) return [];

  const sanitizedQuery = query.trim().slice(0, 50);
  const normalizedQuery = sanitizedQuery.toLowerCase();

  const exactCodeMatch = stops.filter((stop) => stop.code === normalizedQuery);
  if (exactCodeMatch.length > 0) return exactCodeMatch;

  const codeMatches = stops.filter((stop) => stop.code.startsWith(normalizedQuery));

  const nameMatches = stops.filter(
    (stop) =>
      stop.name.toLowerCase().includes(normalizedQuery) ||
      stop.road.toLowerCase().includes(normalizedQuery)
  );

  const combined = [...codeMatches];
  nameMatches.forEach((stop) => {
    if (!combined.find((s) => s.code === stop.code)) {
      combined.push(stop);
    }
  });

  return combined.slice(0, 20);
}

export function getBusStopByCode(stops: BusStop[], code: string): BusStop | undefined {
  return stops.find((stop) => stop.code === code);
}
