import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../auth/AuthProvider'
import { PainelLayout } from './PainelLayout'
import { Spinner, Banner, EmptyState } from '../ui'
import { signedUrl } from '../lib/storage'
import { TIPOS_EXAME, type TipoExame } from '../lib/risco'

interface ExameRow {
  id: string; tipo: string; arquivo_url: string; validado: boolean | null
  motivo_reprovacao: string | null; senderista_id: string; created_at: string
  senderistas: { nome: string } | null
}

export default function ExamesPage() {
  const { hakuna } = useAuth()
  const [rows, setRows] = useState<ExameRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<'pendentes' | 'todos'>('pendentes')
  const [msg, setMsg] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    let q = supabase.from('exames').select('*, senderistas(nome)').order('created_at', { ascending: true })
    if (filtro === 'pendentes') q = q.is('validado', null)
    const { data, error } = await q
    if (error) {
      console.error('[exames] load failed', error)
      setErro('Não foi possível carregar os exames. Tente recarregar a página.')
      setRows([])
    } else {
      setErro(null)
      setRows((data as unknown as ExameRow[]) ?? [])
    }
    setLoading(false)
  }
  useEffect(() => { load() /* eslint-disable-next-line */ }, [filtro])

  async function ver(arquivo_url: string) {
    const url = await signedUrl('exames', arquivo_url)
    if (url) window.open(url, '_blank', 'noopener')
    else setMsg('Não foi possível gerar o link do arquivo.')
  }

  async function validar(id: string, aprovado: boolean) {
    let motivo: string | null = null
    if (!aprovado) {
      motivo = window.prompt('Motivo da reprovação:') || null
      if (motivo === null) return
    }
    const { error } = await supabase.from('exames').update({
      validado: aprovado, motivo_reprovacao: motivo, validado_por: hakuna?.id ?? null,
    }).eq('id', id)
    if (error) { setMsg(`Erro: ${error.message}`); return }
    await load()
  }

  if (loading) return <PainelLayout title="Exames"><Spinner /></PainelLayout>

  return (
    <PainelLayout title="Validação de exames">
      {erro && <Banner kind="error">{erro}</Banner>}
      {msg && <Banner kind="error">{msg}</Banner>}
      <div role="tablist" aria-label="Filtro de exames" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button role="tab" aria-selected={filtro === 'pendentes'} className={`dp-btn ${filtro === 'pendentes' ? 'dp-btn-primary' : 'dp-btn-ghost'}`} onClick={() => setFiltro('pendentes')}>Pendentes</button>
        <button role="tab" aria-selected={filtro === 'todos'} className={`dp-btn ${filtro === 'todos' ? 'dp-btn-primary' : 'dp-btn-ghost'}`} onClick={() => setFiltro('todos')}>Todos</button>
      </div>
      {rows.length === 0 && !erro && (
        <EmptyState
          title={filtro === 'pendentes' ? 'Sem exames pendentes' : 'Nenhum exame enviado ainda'}
          description={filtro === 'pendentes' ? 'Todos foram validados — bom trabalho.' : 'Quando um senderista enviar pelo portal de exames, ele aparece aqui.'}
        />
      )}
      {rows.map(e => (
        <div key={e.id} className="dp-card" style={{ marginBottom: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <strong>{e.senderistas?.nome ?? 'Senderista'}</strong>
            <div style={{ color: 'var(--dp-n-600)', fontSize: '0.88rem' }}>
              {TIPOS_EXAME[e.tipo as TipoExame] ?? e.tipo}
              {e.validado === true && <span style={{ color: 'var(--dp-jungle)' }}> · validado</span>}
              {e.validado === false && <span style={{ color: 'var(--dp-blood)' }}> · reprovado{e.motivo_reprovacao ? `: ${e.motivo_reprovacao}` : ''}</span>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button className="dp-btn dp-btn-ghost" style={{ padding: '0.4rem 0.8rem' }} onClick={() => ver(e.arquivo_url)}>Ver arquivo</button>
            <button className="dp-btn dp-btn-primary" style={{ padding: '0.4rem 0.8rem', background: 'var(--dp-jungle)' }} onClick={() => validar(e.id, true)}>Aprovar</button>
            <button className="dp-btn dp-btn-primary" style={{ padding: '0.4rem 0.8rem' }} onClick={() => validar(e.id, false)}>Reprovar</button>
          </div>
        </div>
      ))}
    </PainelLayout>
  )
}
