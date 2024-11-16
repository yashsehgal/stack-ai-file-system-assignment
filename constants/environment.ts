export const SUPABASE = {
  AUTH_URL: process.env['NEXT_PUBLIC_SUPABASE_AUTH_URL'] as string,
  ANON_KEY: process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] as string,
  EMAIL_ADDRESS: process.env['NEXT_PUBLIC_STACK_AI_EMAIL_ADDRESS'] as string,
  PASSWORD: process.env['NEXT_PUBLIC_STACK_AI_PASSWORD'] as string,
} as const;
