import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.');
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
};

// For backward compatibility, but use getSupabase() where possible
export const supabase = (() => {
  try {
    return getSupabase();
  } catch (e) {
    // Return a proxy that doesn't throw, but logs warnings
    const noop = () => {
      console.warn('Supabase operation called but Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return {
        data: null,
        error: new Error('Supabase not configured'),
        select: () => ({ from: noop, eq: noop, single: noop, order: noop, limit: noop, ilike: noop }),
        from: () => ({ select: noop, insert: noop, update: noop, delete: noop, upsert: noop }),
        auth: {
          getSession: async () => ({ data: { session: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
          signUp: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
          signOut: async () => ({ error: null }),
        },
        storage: {
          from: () => ({ upload: noop, getPublicUrl: () => ({ data: { publicUrl: '' } }) }),
        }
      };
    };

    return new Proxy({} as SupabaseClient, {
      get: (target, prop) => {
        if (prop === 'auth') return noop().auth;
        if (prop === 'storage') return noop().storage;
        if (prop === 'from') return noop().from;
        return noop;
      }
    });
  }
})();
