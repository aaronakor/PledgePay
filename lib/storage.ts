import { createClient } from '@supabase/supabase-js'
import { env } from './env'

const supabase = createClient(
  env.supabaseUrl,
  env.supabaseServiceRoleKey
)

const BUCKET = 'proof-of-payment'

export async function uploadProofOfPayment(
  fileBuffer: Buffer,
  mimeType: string,
  pledgeId: string,
  fileName: string
): Promise<string> {
  const path = `${pledgeId}/${Date.now()}-${fileName}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, fileBuffer, { contentType: mimeType, upsert: false })

  if (error) throw error
  return path
}

export async function getSignedProofUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 3600)

  if (error || !data) throw error
  return data.signedUrl
}
