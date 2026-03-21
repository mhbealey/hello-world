import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // During build without env vars, return a stub
    return createServerClient(
      "https://placeholder.supabase.co",
      "placeholder-key",
      {
        cookies: {
          get() { return undefined; },
          set() {},
          remove() {},
        },
      }
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set(name, value, options);
        } catch {
          // Can be ignored in Server Components
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set(name, "", options);
        } catch {
          // Can be ignored in Server Components
        }
      },
    },
  });
}
