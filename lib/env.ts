export const env = {
  databaseUrl: process.env.DATABASE_URL!,
  nextauthSecret: process.env.NEXTAUTH_SECRET!,
  nextauthUrl: process.env.NEXTAUTH_URL!,
  flutterwavePublicKey: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY!,
  flutterwaveSecretKey: process.env.FLW_SECRET_KEY!,
  flutterwaveWebhookSecret: process.env.FLW_WEBHOOK_SECRET!,
  gmailUser: process.env.GMAIL_USER!,
  gmailAppPassword: process.env.GMAIL_APP_PASSWORD!,
  emailFrom: process.env.EMAIL_FROM!,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  appUrl: process.env.NEXT_PUBLIC_APP_URL!,
}
