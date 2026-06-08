import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { PainelLayout } from './PainelLayout'
import { Spinner, Banner } from '../ui'
import { RISCO_COR, RISCO_LABEL, type Risco } from '../lib/risco'

interface Stats {
  total: number
  porStatus: Record<string, number>
  porRisco: Record<string, number>
  presentes: number
  examesPendentes: number
}

const STATUS_LABEL: Record<string, string> = {
  pendente: 'Em análise', aprovado: 'Aprovados', reprovado: 'Reprovados', confirmado: 'Confirmados',
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      const [{ data: senderistas, error: sErr }, { count: examesPendentes, error: eErr }] = await Promise.all([
        supabase.from('senderistas').select('status, classificacao_risco, status_presenca'),
        supabase.from('exames').select('*', { count: 'exact', head: true }).is('validado', null),
      ])
      if (sErr || eErr) {
        console.error('[dashboard] load failed', sErr ?? eErr)
        setErro('Não conseguimos carregar a visão geral. Tente atualizar a página — se persistir, fale com a coordenação.')
        return
      }
      const rows = senderistas ?? []
      const porStatus: Record<string, number> = {}
      const porRisco: Record<string, number> = {}
      let presentes = 0
      for (const r of rows) {
        porStatus[r.status] = (porStatus[r.status] ?? 0) + 1
        porRisco[r.classificacao_risco] = (porRisco[r.classificacao_risco] ?? 0) + 1
        if (r.status_presenca === 'presente') presentes++
      }
      setStats({ total: rows.length, porStatus, porRisco, presentes, examesPendentes: examesPendentes ?? 0 })
    })()
  }, [])

  if (erro) return <PainelLayout title="Visão geral"><Banner kind="error">{erro}</Banner></PainelLayout>
  if (!stats) return <PainelLayout title="Visão geral"><Spinner /></PainelLayout>

  return (
    <PainelLayout title="Visão geral">
      <div className="dp-card" style={{ marginBottom: '1.25rem', borderLeft: '4px solid var(--dp-river)', background: 'white', color: 'var(--dp-n-800)' }}>
        Os números abaixo atualizam a cada reload. Use como termômetro do turno: <strong>"Exames pendentes"</strong> alto significa fila no médico; <strong>"Risco alto"</strong> subindo é sinal para reforçar a equipe; <strong>"Presentes"</strong> é o head-count em campo agora.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: '1rem' }}>
        <Stat label="Senderistas" value={stats.total} hint="Total de inscritos" />
        <Stat label="Presentes" value={stats.presentes} hint="Check-in feito" />
        <Stat label="Exames pendentes" value={stats.examesPendentes} accent="var(--dp-clay)" to="/destemidos-pioneiros/painel/exames" hint="Aguardando validação" />
      </div>

      <h2 className="dp-display" style={{ fontSize: '1.2rem', margin: '1.75rem 0 0.75rem' }}>Por classificação de risco</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '1rem' }}>
        {(['baixo', 'medio', 'alto'] as Risco[]).map(r => (
          <Stat key={r} label={`Risco ${RISCO_LABEL[r]}`} value={stats.porRisco[r] ?? 0} accent={RISCO_COR[r]} />
        ))}
      </div>

      <h2 className="dp-display" style={{ fontSize: '1.2rem', margin: '1.75rem 0 0.75rem' }}>Por status de inscrição</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '1rem' }}>
        {Object.entries(stats.porStatus).map(([k, v]) => <Stat key={k} label={STATUS_LABEL[k] ?? k} value={v} />)}
        {Object.keys(stats.porStatus).length === 0 && <p style={{ color: 'var(--dp-n-500)' }}>Sem inscrições ainda.</p>}
      </div>
    </PainelLayout>
  )
}

function Stat({ label, value, accent, to, hint }: { label: string; value: number; accent?: string; to?: string; hint?: string }) {
  const inner = (
    <div className="dp-card" style={{ borderTop: `3px solid ${accent ?? 'var(--dp-ink)'}` }}>
      <div className="dp-display" style={{ fontSize: '2.2rem', color: accent ?? 'var(--dp-ink)' }}>{value}</div>
      <div style={{ color: 'var(--dp-n-700)', fontSize: '0.9rem', textTransform: 'capitalize' }}>{label}</div>
      {hint && <div style={{ color: 'var(--dp-n-500)', fontSize: '0.75rem', marginTop: 2 }}>{hint}</div>}
    </div>
  )
  return to ? <Link to={to} style={{ textDecoration: 'none' }}>{inner}</Link> : inner
}
