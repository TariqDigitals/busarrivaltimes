import { supabase } from './supabaseClient';

const RATE_LIMIT_MAX_REQUESTS = 500;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

interface UserTracking {
  user_ip: string;
  request_count: number;
  window_start: string;
  last_request_at: string;
}

function getUserIdentifier(): string {
  const sessionId = sessionStorage.getItem('user_session_id');
  if (sessionId) return sessionId;

  const newSessionId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  sessionStorage.setItem('user_session_id', newSessionId);
  return newSessionId;
}

export async function checkRateLimit(): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const userId = getUserIdentifier();

    const { data: tracking, error } = await supabase
      .from('user_request_tracking')
      .select('*')
      .eq('user_ip', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.warn('Rate limit check error:', error);
      return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS };
    }

    const now = new Date();

    if (!tracking) {
      await supabase
        .from('user_request_tracking')
        .insert({
          user_ip: userId,
          request_count: 1,
          window_start: now.toISOString(),
          last_request_at: now.toISOString()
        });

      return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
    }

    const windowStart = new Date(tracking.window_start);
    const windowElapsed = now.getTime() - windowStart.getTime();

    if (windowElapsed > RATE_LIMIT_WINDOW_MS) {
      await supabase
        .from('user_request_tracking')
        .update({
          request_count: 1,
          window_start: now.toISOString(),
          last_request_at: now.toISOString()
        })
        .eq('user_ip', userId);

      return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
    }

    if (tracking.request_count >= RATE_LIMIT_MAX_REQUESTS) {
      const timeRemaining = RATE_LIMIT_WINDOW_MS - windowElapsed;
      const minutesRemaining = Math.ceil(timeRemaining / 60000);

      return {
        allowed: false,
        remaining: 0
      };
    }

    await supabase
      .from('user_request_tracking')
      .update({
        request_count: tracking.request_count + 1,
        last_request_at: now.toISOString()
      })
      .eq('user_ip', userId);

    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX_REQUESTS - tracking.request_count - 1
    };

  } catch (error) {
    console.warn('Rate limiter error:', error);
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS };
  }
}

export function getRateLimitInfo() {
  return {
    maxRequests: RATE_LIMIT_MAX_REQUESTS,
    windowMinutes: RATE_LIMIT_WINDOW_MS / 60000
  };
}
