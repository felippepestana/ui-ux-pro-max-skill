import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { PainelLayout } from './PainelLayout'
import { Spinner, Banner, EmptyState } from '../ui'
import { signedUrl } from '../lib/storage'

interface MsgRow {
  id: string; tipo: string; titulo: string | null; conteudo: string | null
  arquivo_url: string | null; enviado_por: string; visualizado: boolean
  created_at: string; senderista_id: string; senderistas: { nome: string } | null
}

export default function MensagensPainelPage() {
  const [rows, setRows] = useState<MsgRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<'novas' | 'todas'>('novas')
  const [msg, setMsg] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    let q = supabase.from('mensagens_apoio').select('*, senderistas(nome)').order('created_at', { ascending: false })
    if (filtro === 'novas') q = q.eq('visualizado', false)
    const { data, error } = await q
    if (error) {
      console.error('[mensagens] load failed', error)
      setErro('Não foi possível carregar as mensagens. Tente recarregar a página.')
      setRows([])
    } else {
      setErro(null)
      setRows((data as unknown as MsgRow[]) ?? [])
    }
    setLoading(false)
  }
  useEffect(() => { load() /* eslint-disable-next-line */ }, [filtro])

  async function marcar(id: string) {
    const { error } = await supabase.from('mensagens_apoio').update({ visualizado: true, visualizado_em: new Date().toISOString() }).eq('id', id)
    if (error) { setMsg(`Erro: ${error.message}`); return }
    await load()
  }

  async function abrir(arquivo_url: string) {
    const url = await signedUrl('mensagens', arquivo_url)
    if (url) window.open(url, '_blank', 'noopener')
    else setMsg('Não foi possível abrir o arquivo.')
  }

  if (loading) return <PainelLayout title="Mensagens"><Spinner /></PainelLayout>

  return (
    <PainelLayout title="Mensagens de apoio">
      {erro && <Banner kind="error">{erro}</Banner>}
      {msg && <Banner kind="error">{msg}</Banner>}
      <div role="tablist" aria-label="Filtro de mensagens" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button role="tab" aria-selected={filtro === 'novas'} className={`dp-btn ${filtro === 'novas' ? 'dp-btn-primary' : 'dp-btn-ghost'}`} onClick={() => setFiltro('novas')}>Não entregues</button>
        <button role="tab" aria-selected={filtro === 'todas'} className={`dp-btn ${filtro === 'todas' ? 'dp-btn-primary' : 'dp-btn-ghost'}`} onClick={() => setFiltro('todas')}>Todas</button>
      </div>
      {rows.length === 0 && !erro && (
        <EmptyState
          title={filtro === 'novas' ? 'Todas as mensagens já foram entregues' : 'Nenhuma mensagem ainda'}
          description={filtro === 'novas' ? 'Quando uma família enviar pelo portal /mensagens, ela aparece aqui.' : 'O portal /mensagens/:token alimenta esta lista.'}
        />
      )}
      {rows.map(m => (
        <div key={m.id} className="dp-card" style={{ marginBottom: '0.6rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <div>
              <strong>{m.senderistas?.nome ?? 'Senderista'}</strong>
              <span style={{ color: 'var(--dp-n-500)', fontSize: '0.85rem' }}> · de {m.enviado_por} · {m.tipo}</span>
            </div>
            {!m.visualizado
              ? <button className="dp-btn dp-btn-primary" style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }} onClick={() => marcar(m.id)}>Marcar entregue</button>
              : <span style={{ color: 'var(--dp-jungle)', fontSize: '0.82rem', fontWeight: 600 }}>entregue</span>}
          </div>
          {m.titulo && <p style={{ margin: '0.4rem 0 0', fontWeight: 600 }}>{m.titulo}</p>}
          {m.conteudo && <p style={{ margin: '0.3rem 0', whiteSpace: 'pre-wrap', color: 'var(--dp-n-800)' }}>{m.conteudo}</p>}
          {m.arquivo_url && <button className="dp-btn dp-btn-ghost" style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }} onClick={() => abrir(m.arquivo_url!)}>Abrir {m.tipo}</button>}
        </div>
      ))}
    </PainelLayout>
  )
}
