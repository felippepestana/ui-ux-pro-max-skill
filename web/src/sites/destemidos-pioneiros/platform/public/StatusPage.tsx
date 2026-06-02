import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { TIPOS_EXAME, type TipoExame, type Risco, RISCO_LABEL, RISCO_COR } from '../lib/risco'
import { fetchSenderistaPorToken, type SenderistaPublico } from '../lib/senderistaToken'
import { PlatformShell, Banner, Spinner } from '../ui'
import type { Exame } from '../database.types'

const STATUS_LABEL: Record<string, string> = {
  pendente: 'Em análise', aprovado: 'Aprovado', reprovado: 'Reprovado', confirmado: 'Confirmado',
}

export default function StatusPage() {
  const { upload_token = '' } = useParams()
  const [s, setS] = useState<SenderistaPublico | null>(null)
  const [exames, setExames] = useState<Exame[]>([])
  const [erro, setErro] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSenderistaPorToken(upload_token).then(async ({ data, error }) => {
      setS(data); setErro(error)
      if (data) {
        const { data: ex } = await supabase.from('exames').select('*').eq('senderista_id', data.id)
        setExames(ex ?? [])
      }
      setLoading(false)
    })
  }, [upload_token])

  if (loading) return <PlatformShell><Spinner /></PlatformShell>
  if (!s) return <PlatformShell title="Status da inscrição"><Banner kind="error">{erro ?? 'Link inválido.'}</Banner></PlatformShell>

  const risco = s.classificacao_risco as Risco
  return (
    <PlatformShell title={`Status — ${s.nome}`} subtitle={s.evento_nome ?? undefined} back={{ to: '/destemidos-pioneiros', label: 'Site' }}>
      <div className="dp-card" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <div><div style={{ fontSize: '0.8rem', color: 'var(--dp-n-500)' }}>Inscrição</div><div className="dp-display" style={{ fontSize: '1.4rem' }}>{STATUS_LABEL[s.status] ?? s.status}</div></div>
        <div><div style={{ fontSize: '0.8rem', color: 'var(--dp-n-500)' }}>Risco</div><div className="dp-display" style={{ fontSize: '1.4rem', color: RISCO_COR[risco] ?? 'var(--dp-ink)' }}>{RISCO_LABEL[risco] ?? s.classificacao_risco}</div></div>
      </div>
      {s.motivo_reprovacao && <Banner kind="error">Pendência: {s.motivo_reprovacao}</Banner>}
      {s.orientacoes && <Banner kind="info">{s.orientacoes}</Banner>}

      <h3 className="dp-display" style={{ fontSize: '1.1rem', marginTop: '1rem' }}>Exames</h3>
      {((s.exames_exigidos ?? []) as TipoExame[]).map(t => {
        const e = exames.find(x => x.tipo === t)
        const estado = !e ? 'Pendente' : e.validado === true ? 'Validado' : e.validado === false ? 'Reprovado' : 'Em análise'
        const cor = !e ? 'var(--dp-clay)' : e.validado === true ? 'var(--dp-jungle)' : e.validado === false ? 'var(--dp-blood)' : 'var(--dp-river)'
        return (
          <div key={t} className="dp-card" style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>{TIPOS_EXAME[t]}</span><span style={{ fontWeight: 600, color: cor }}>{estado}</span>
          </div>
        )
      })}
      <p style={{ marginTop: '1.5rem' }}>
        <Link to={`/destemidos-pioneiros/exames/${upload_token}`} className="dp-btn dp-btn-primary">Enviar / atualizar exames →</Link>
      </p>
    </PlatformShell>
  )
}
