import { supabase } from './supabaseClient';
import type { ArriveLahResponse } from '../types';

const CACHE_DURATION_SECONDS = 30;

interface CacheEntry {
  bus_stop_code: string;
  arrival_data: ArriveLahResponse;
  cached_at: string;
  expires_at: string;
}

export async function getCachedArrival(busStopCode: string): Promise<ArriveLahResponse | null> {
  try {
    const { data, error } = await supabase
      .from('bus_arrival_cache')
      .select('arrival_data, expires_at')
      .eq('bus_stop_code', busStopCode)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (error) {
      console.warn('Cache read error:', error);
      return null;
    }

    if (data) {
      return data.arrival_data as ArriveLahResponse;
    }

    return null;
  } catch (error) {
    console.warn('Cache retrieval failed:', error);
    return null;
  }
}

export async function setCachedArrival(busStopCode: string, data: ArriveLahResponse): Promise<void> {
  try {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + CACHE_DURATION_SECONDS * 1000);

    const { data: existing } = await supabase
      .from('bus_arrival_cache')
      .select('id')
      .eq('bus_stop_code', busStopCode)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('bus_arrival_cache')
        .update({
          arrival_data: data,
          cached_at: now.toISOString(),
          expires_at: expiresAt.toISOString()
        })
        .eq('bus_stop_code', busStopCode);
    } else {
      await supabase
        .from('bus_arrival_cache')
        .insert({
          bus_stop_code: busStopCode,
          arrival_data: data,
          cached_at: now.toISOString(),
          expires_at: expiresAt.toISOString()
        });
    }
  } catch (error) {
    console.warn('Cache write failed:', error);
  }
}

export async function clearExpiredCache(): Promise<void> {
  try {
    await supabase
      .from('bus_arrival_cache')
      .delete()
      .lt('expires_at', new Date().toISOString());
  } catch (error) {
    console.warn('Cache cleanup failed:', error);
  }
}
