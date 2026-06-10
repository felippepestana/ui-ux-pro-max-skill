import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import '../theme.css'

// Wraps platform pages so the --dp-* tokens from theme.css apply.
export function PlatformShell({ children, title, subtitle, back }: {
  children: ReactNode
  title?: string
  subtitle?: string
  back?: { to: string; label: string }
}) {
  return (
    <div data-site="destemidos-pioneiros" style={{ minHeight: '100vh', background: 'var(--dp-bone)' }}>
      <header style={{ background: 'var(--dp-ink)', color: 'var(--dp-bone)' }}>
        <div className="dp-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.25rem' }}>
          <Link to="/destemidos-pioneiros" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', color: 'var(--dp-bone)' }}>
            <span style={{ width: 24, height: 24, background: 'var(--dp-blood)', display: 'inline-block', borderRadius: 6 }} />
            <strong className="dp-display" style={{ fontSize: '1rem' }}>TOP 1270 · Destemidos Pioneiros</strong>
          </Link>
          {back && <Link to={back.to} style={{ color: 'var(--dp-clay)', fontSize: '0.9rem' }}>← {back.label}</Link>}
        </div>
      </header>
      <main className="dp-container" style={{ padding: '2rem 1.25rem 4rem' }}>
        {title && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 className="dp-display" style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>{title}</h1>
            {subtitle && <p style={{ color: 'var(--dp-n-700)', marginTop: '0.35rem' }}>{subtitle}</p>}
          </div>
        )}
        {children}
      </main>
    </div>
  )
}

export function Field({ label, children, hint, required }: {
  label: string; children: ReactNode; hint?: string; required?: boolean
}) {
  return (
    <label style={{ display: 'block', marginBottom: '1rem' }}>
      <span style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
        {label}{required && <span style={{ color: 'var(--dp-blood)' }}> *</span>}
      </span>
      {children}
      {hint && <span style={{ display: 'block', color: 'var(--dp-n-500)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{hint}</span>}
    </label>
  )
}

export const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem 0.75rem',
  border: '1px solid var(--dp-n-300)',
  borderRadius: 'var(--dp-radius)',
  fontSize: '0.95rem',
  fontFamily: 'var(--dp-text)',
  background: 'white',
  color: 'var(--dp-ink)',
}

export function Banner({ kind, children }: { kind: 'info' | 'success' | 'error' | 'warning'; children: ReactNode }) {
  const colors: Record<string, string> = {
    info: 'var(--dp-river)', success: 'var(--dp-jungle)', error: 'var(--dp-blood)', warning: 'var(--dp-clay)',
  }
  const role = kind === 'error' || kind === 'warning' ? 'alert' : 'status'
  return (
    <div role={role} style={{
      borderLeft: `4px solid ${colors[kind]}`, background: 'white',
      padding: '0.85rem 1rem', borderRadius: 'var(--dp-radius)', marginBottom: '1rem',
      color: 'var(--dp-n-800)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>{children}</div>
  )
}

export function Spinner({ label = 'Carregando…' }: { label?: string }) {
  return (
    <p role="status" aria-live="polite" style={{ color: 'var(--dp-n-500)', padding: '2rem 0' }}>
      {label}
    </p>
  )
}

export function EmptyState({ title, description, action }: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div role="status" style={{
      textAlign: 'center', padding: '2.5rem 1rem', background: 'white',
      borderRadius: 'var(--dp-radius)', border: '1px dashed var(--dp-n-300)',
    }}>
      <p className="dp-display" style={{ fontSize: '1.1rem', margin: 0 }}>{title}</p>
      {description && (
        <p style={{ color: 'var(--dp-n-600)', fontSize: '0.9rem', margin: '0.4rem 0 0' }}>{description}</p>
      )}
      {action && <div style={{ marginTop: '1rem' }}>{action}</div>}
    </div>
  )
}
