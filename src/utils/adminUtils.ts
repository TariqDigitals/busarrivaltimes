import { supabase } from './supabaseClient';

export async function addApiKey(keyValue: string, keyName: string, notes?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('api_keys')
      .insert({
        key_name: keyName,
        key_value: keyValue,
        provider: 'LTA_DataMall',
        is_active: true,
        notes: notes || null
      });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function listApiKeys(): Promise<any[]> {
  const { data, error } = await supabase
    .from('api_keys')
    .select('id, key_name, provider, is_active, usage_count, last_used_at, created_at, notes')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching API keys:', error);
    return [];
  }

  return data || [];
}

export async function toggleApiKeyStatus(keyId: string, isActive: boolean): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('api_keys')
      .update({ is_active: isActive })
      .eq('id', keyId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function deleteApiKey(keyId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', keyId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
