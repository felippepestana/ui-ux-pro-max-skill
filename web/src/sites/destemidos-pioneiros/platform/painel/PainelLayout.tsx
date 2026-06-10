import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import '../../theme.css'

const NAV = [
  { to: '/destemidos-pioneiros/painel', label: 'Visão geral', exact: true },
  { to: '/destemidos-pioneiros/painel/senderistas', label: 'Senderistas' },
  { to: '/destemidos-pioneiros/painel/exames', label: 'Exames' },
  { to: '/destemidos-pioneiros/painel/trilha', label: 'Trilha' },
  { to: '/destemidos-pioneiros/painel/mensagens', label: 'Mensagens' },
]

export function PainelLayout({ children, title }: { children: ReactNode; title: string }) {
  const { hakuna, signOut } = useAuth()
  const loc = useLocation()
  return (
    <div data-site="destemidos-pioneiros" style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '230px 1fr', background: 'var(--dp-bone)' }}>
      <aside style={{ background: 'var(--dp-ink)', color: 'var(--dp-bone)', padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column' }}>
        <Link to="/destemidos-pioneiros/painel" className="dp-display" style={{ color: 'var(--dp-bone)', textDecoration: 'none', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
          Painel · TOP 1270
        </Link>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
          {NAV.map(n => {
            const active = n.exact ? loc.pathname === n.to : loc.pathname.startsWith(n.to)
            return (
              <Link key={n.to} to={n.to} style={{
                color: active ? 'var(--dp-bone)' : 'var(--dp-n-400)',
                background: active ? 'var(--dp-blood)' : 'transparent',
                padding: '0.5rem 0.7rem', borderRadius: 'var(--dp-radius)', textDecoration: 'none', fontSize: '0.92rem',
              }}>{n.label}</Link>
            )
          })}
        </nav>
        <div style={{ borderTop: '1px solid var(--dp-n-700)', paddingTop: '0.75rem', fontSize: '0.8rem', color: 'var(--dp-n-400)' }}>
          <div style={{ marginBottom: '0.5rem' }}>{hakuna?.nome ?? hakuna?.email}</div>
          <button className="dp-btn dp-btn-ghost" style={{ color: 'var(--dp-bone)', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={signOut}>Sair</button>
        </div>
      </aside>
      <main style={{ padding: '1.75rem 2rem', overflow: 'auto' }}>
        <h1 className="dp-display" style={{ fontSize: '1.8rem', marginBottom: '1.25rem' }}>{title}</h1>
        {children}
      </main>
    </div>
  )
}
