function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

function optionalEnv(key: string): string {
  return process.env[key] ?? ''
}

export const env = {
  databaseUrl: requireEnv('DATABASE_URL'),
  nextauthSecret: requireEnv('NEXTAUTH_SECRET'),
  nextauthUrl: requireEnv('NEXTAUTH_URL'),
  appUrl: requireEnv('NEXT_PUBLIC_APP_URL'),
  supabaseUrl: requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
  supabaseServiceRoleKey: requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
  gmailUser: requireEnv('GMAIL_USER'),
  gmailAppPassword: requireEnv('GMAIL_APP_PASSWORD'),
  emailFrom: requireEnv('EMAIL_FROM'),
  flutterwavePublicKey: optionalEnv('NEXT_PUBLIC_FLW_PUBLIC_KEY'),
  flutterwaveSecretKey: optionalEnv('FLW_SECRET_KEY'),
  flutterwaveWebhookSecret: optionalEnv('FLW_WEBHOOK_SECRET'),
}
