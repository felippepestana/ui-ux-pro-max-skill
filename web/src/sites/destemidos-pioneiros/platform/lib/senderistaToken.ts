import { supabase } from '../supabaseClient'

export interface SenderistaPublico {
  id: string
  nome: string
  status: string
  classificacao_risco: string
  exames_exigidos: string[]
  orientacoes: string | null
  motivo_reprovacao: string | null
  evento_nome: string | null
}

// Reads a minimal, public-safe slice of a senderista via the SECURITY DEFINER RPC
// get_senderista_publico (added in migration 008). Returns null if not found or if
// the migration has not been applied yet.
export async function fetchSenderistaPorToken(token: string): Promise<{ data: SenderistaPublico | null; error: string | null }> {
  const { data, error } = await supabase.rpc('get_senderista_publico', { p_token: token })
  if (error) {
    const msg = /function .* does not exist/i.test(error.message)
      ? 'O portal ainda não foi habilitado pela organização (migração de banco pendente).'
      : error.message
    return { data: null, error: msg }
  }
  const row = Array.isArray(data) ? data[0] : data
  return { data: (row as SenderistaPublico) ?? null, error: row ? null : 'Link inválido ou expirado.' }
}
