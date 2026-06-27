function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

export const env = {
  databaseUrl: requireEnv('DATABASE_URL'),
  nextauthSecret: requireEnv('NEXTAUTH_SECRET'),
  nextauthUrl: requireEnv('NEXTAUTH_URL'),
  flutterwavePublicKey: requireEnv('NEXT_PUBLIC_FLW_PUBLIC_KEY'),
  flutterwaveSecretKey: requireEnv('FLW_SECRET_KEY'),
  flutterwaveWebhookSecret: requireEnv('FLW_WEBHOOK_SECRET'),
  gmailUser: requireEnv('GMAIL_USER'),
  gmailAppPassword: requireEnv('GMAIL_APP_PASSWORD'),
  emailFrom: requireEnv('EMAIL_FROM'),
  supabaseUrl: requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
  supabaseServiceRoleKey: requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
  appUrl: requireEnv('NEXT_PUBLIC_APP_URL'),
}
