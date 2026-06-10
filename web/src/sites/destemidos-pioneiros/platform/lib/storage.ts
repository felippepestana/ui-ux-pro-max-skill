import { supabase } from '../supabaseClient'

// Uploads a file to a private bucket under a token-scoped path and returns the
// storage path (not a public URL — these buckets are private; staff reads via signed URL).
export async function uploadToBucket(
  bucket: 'exames' | 'mensagens' | 'prontuarios',
  pathPrefix: string,
  file: File,
): Promise<string> {
  const safeName = file.name.replace(/[^\w.\-]/g, '_')
  const path = `${pathPrefix}/${Date.now()}-${safeName}`
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error
  return path
}

// Staff-only: creates a short-lived signed URL to view a private object.
export async function signedUrl(
  bucket: 'exames' | 'mensagens' | 'prontuarios',
  path: string,
  expiresInSeconds = 300,
): Promise<string | null> {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresInSeconds)
  if (error) return null
  return data.signedUrl
}
