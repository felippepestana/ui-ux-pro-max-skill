import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { PainelLayout } from './PainelLayout'
import { Spinner } from '../ui'
import { RISCO_COR, RISCO_LABEL, type Risco } from '../lib/risco'

interface Stats {
  total: number
  porStatus: Record<string, number>
  porRisco: Record<string, number>
  presentes: number
  examesPendentes: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    (async () => {
      const { data: senderistas } = await supabase.from('senderistas').select('status, classificacao_risco, status_presenca')
      const { count: examesPendentes } = await supabase.from('exames').select('*', { count: 'exact', head: true }).is('validado', null)
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

  if (!stats) return <PainelLayout title="Visão geral"><Spinner /></PainelLayout>

  return (
    <PainelLayout title="Visão geral">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: '1rem' }}>
        <Stat label="Senderistas" value={stats.total} />
        <Stat label="Presentes" value={stats.presentes} />
        <Stat label="Exames pendentes" value={stats.examesPendentes} accent="var(--dp-clay)" to="/destemidos-pioneiros/painel/exames" />
      </div>

      <h2 className="dp-display" style={{ fontSize: '1.2rem', margin: '1.75rem 0 0.75rem' }}>Por classificação de risco</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '1rem' }}>
        {(['baixo', 'medio', 'alto'] as Risco[]).map(r => (
          <Stat key={r} label={`Risco ${RISCO_LABEL[r]}`} value={stats.porRisco[r] ?? 0} accent={RISCO_COR[r]} />
        ))}
      </div>

      <h2 className="dp-display" style={{ fontSize: '1.2rem', margin: '1.75rem 0 0.75rem' }}>Por status de inscrição</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '1rem' }}>
        {Object.entries(stats.porStatus).map(([k, v]) => <Stat key={k} label={k} value={v} />)}
        {Object.keys(stats.porStatus).length === 0 && <p style={{ color: 'var(--dp-n-500)' }}>Sem inscrições ainda.</p>}
      </div>
    </PainelLayout>
  )
}

function Stat({ label, value, accent, to }: { label: string; value: number; accent?: string; to?: string }) {
  const inner = (
    <div className="dp-card" style={{ borderTop: `3px solid ${accent ?? 'var(--dp-ink)'}` }}>
      <div className="dp-display" style={{ fontSize: '2.2rem', color: accent ?? 'var(--dp-ink)' }}>{value}</div>
      <div style={{ color: 'var(--dp-n-700)', fontSize: '0.9rem', textTransform: 'capitalize' }}>{label}</div>
    </div>
  )
  return to ? <Link to={to} style={{ textDecoration: 'none' }}>{inner}</Link> : inner
}
