import { createClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

// Browser client
export const supabase = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL) ? createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
) : null as any;

// Server component client (using cookies)
export const supabaseServer = (context: { req: any, res: any }) => {
  if (typeof window !== 'undefined') return null as any;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null as any;

  return createServerClient(
    url,
    key,
    {
      cookies: {
        get(name: string) {
          return context.req.cookies[name];
        },
        set(name: string, value: string, options: CookieOptions) {
          context.res.cookie(name, value, options);
        },
        remove(name: string, options: CookieOptions) {
          context.res.clearCookie(name, options);
        },
      },
    }
  );
};

// Admin client (service role key, server-only)
const serviceRoleKey = typeof process !== 'undefined' ? process.env.SUPABASE_SERVICE_ROLE_KEY : undefined;
const supabaseUrl = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_URL : undefined;

export const supabaseAdmin = (supabaseUrl && serviceRoleKey) ? createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
) : null as any;
