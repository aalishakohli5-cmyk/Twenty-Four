import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getSupabasePublishableKey, getSupabaseUrl, isSupabaseConfigured } from './supabaseConfig';

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(getSupabaseUrl(), getSupabasePublishableKey())
  : null;

export function requireSupabaseClient(): SupabaseClient {
  if (!supabase) {
    throw new Error('Supabase is not configured. Check your .env file.');
  }
  return supabase;
}
