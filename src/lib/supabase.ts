import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a lazy-initialized client to avoid SSR issues
let supabaseInstance: SupabaseClient<Database> | null = null;

function getSupabaseClient(): SupabaseClient<Database> {
  if (!supabaseInstance && supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  // Return a dummy client that won't throw during SSR
  if (!supabaseInstance) {
    return {
      from: () => ({
        select: () => ({ data: null, error: null, single: () => ({ data: null, error: null }) }),
        insert: () => ({ data: null, error: null, select: () => ({ data: null, error: null, single: () => ({ data: null, error: null }) }) }),
        update: () => ({ data: null, error: null, eq: () => ({ data: null, error: null, select: () => ({ data: null, error: null, single: () => ({ data: null, error: null }) }) }) }),
        upsert: () => ({ data: null, error: null, select: () => ({ data: null, error: null, single: () => ({ data: null, error: null }) }) }),
        delete: () => ({ data: null, error: null, eq: () => ({ data: null, error: null }) }),
        eq: () => ({ data: null, error: null }),
        neq: () => ({ data: null, error: null }),
        order: () => ({ data: null, error: null }),
        limit: () => ({ data: null, error: null }),
      }),
      channel: () => ({ on: () => ({ subscribe: () => ({}) }), subscribe: () => ({}) }),
      removeChannel: () => {},
    } as unknown as SupabaseClient<Database>;
  }
  return supabaseInstance;
}

// Export a proxy that lazily initializes
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_, prop) {
    const client = getSupabaseClient();
    const value = client[prop as keyof SupabaseClient<Database>];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabaseUrl.length > 0 && supabaseAnonKey.length > 0;
};
