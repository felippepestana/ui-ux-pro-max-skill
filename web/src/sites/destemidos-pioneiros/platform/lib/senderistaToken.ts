import { supabase } from '../supabaseClient'

// Full public-safe slice for the exam/status portals — resolved ONLY from upload_token.
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

// Minimal slice for the family-messages portal — resolved ONLY from mensagens_token.
// The messages link is meant to be shared broadly, so it must NOT expose health/exam
// data or unlock the exam/status portal (see migration 009).
export interface SenderistaMensagens {
  id: string
  nome: string
  evento_nome: string | null
}

type Result<T> = { data: T | null; error: string | null }

function unwrap<T>(data: unknown, error: { message: string } | null): Result<T> {
  if (error) {
    // Never forward raw RPC error.message to the public portals — it can leak
    // backend internals (UUID parse traces, function metadata, stack info). Map
    // to safe, user-facing strings; keep the migration hint because it tells
    // the operator something specific they can fix.
    console.error('[senderistaToken] rpc failed', error)
    let msg = 'Não foi possível validar o link no momento. Tente novamente em instantes.'
    if (/function .* does not exist/i.test(error.message)) {
      msg = 'O portal ainda não foi habilitado pela organização (migração de banco pendente).'
    } else if (/invalid input syntax for type uuid|22P02/i.test(error.message)) {
      msg = 'Link inválido ou expirado.'
    }
    return { data: null, error: msg }
  }
  const row = Array.isArray(data) ? data[0] : data
  return { data: (row as T) ?? null, error: row ? null : 'Link inválido ou expirado.' }
}

// Exam upload + status portals (upload_token).
export async function fetchSenderistaPorToken(token: string): Promise<Result<SenderistaPublico>> {
  const { data, error } = await supabase.rpc('get_senderista_publico', { p_token: token })
  return unwrap<SenderistaPublico>(data, error)
}

// Family-messages portal (mensagens_token) — minimal, no health/exam data.
export async function fetchSenderistaMensagens(token: string): Promise<Result<SenderistaMensagens>> {
  const { data, error } = await supabase.rpc('get_senderista_mensagens', { p_token: token })
  return unwrap<SenderistaMensagens>(data, error)
}
