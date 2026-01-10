import { supabase } from './supabaseClient';

interface ApiKey {
  id: string;
  key_value: string;
  usage_count: number;
  last_used_at: string | null;
}

let cachedKeys: ApiKey[] = [];
let cacheTimestamp = 0;
const CACHE_DURATION = 60000;

async function fetchActiveKeys(): Promise<ApiKey[]> {
  const now = Date.now();

  if (cachedKeys.length > 0 && now - cacheTimestamp < CACHE_DURATION) {
    return cachedKeys;
  }

  const { data, error } = await supabase
    .from('api_keys')
    .select('id, key_value, usage_count, last_used_at')
    .eq('is_active', true)
    .eq('provider', 'LTA_DataMall')
    .order('usage_count', { ascending: true });

  if (error) {
    console.warn('Failed to fetch API keys from database:', error);
    return [];
  }

  cachedKeys = data || [];
  cacheTimestamp = now;
  return cachedKeys;
}

export async function getNextApiKey(): Promise<string | null> {
  const keys = await fetchActiveKeys();

  if (keys.length === 0) {
    return null;
  }

  const leastUsedKey = keys.sort((a, b) => {
    if (a.usage_count !== b.usage_count) {
      return a.usage_count - b.usage_count;
    }

    if (!a.last_used_at) return -1;
    if (!b.last_used_at) return 1;

    return new Date(a.last_used_at).getTime() - new Date(b.last_used_at).getTime();
  })[0];

  await supabase
    .from('api_keys')
    .update({
      usage_count: leastUsedKey.usage_count + 1,
      last_used_at: new Date().toISOString()
    })
    .eq('id', leastUsedKey.id);

  return leastUsedKey.key_value;
}

export async function getApiKeyCount(): Promise<number> {
  const keys = await fetchActiveKeys();
  return keys.length;
}
