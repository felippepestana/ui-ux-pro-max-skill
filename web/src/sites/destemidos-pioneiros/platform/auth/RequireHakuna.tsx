import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import { PlatformShell, Spinner, Banner } from '../ui'

// Gate for staff routes: requires an authenticated Supabase session that maps to a
// row in `hakunas`. Anyone else is redirected to login.
export function RequireHakuna({ children }: { children: ReactNode }) {
  const { session, hakuna, loading } = useAuth()
  const location = useLocation()

  if (loading) return <PlatformShell><Spinner label="Verificando acesso…" /></PlatformShell>

  if (!session) {
    return <Navigate to="/destemidos-pioneiros/painel/login" state={{ from: location.pathname }} replace />
  }

  if (!hakuna) {
    return (
      <PlatformShell title="Acesso restrito">
        <Banner kind="warning">
          Sua conta ({session.user.email}) está autenticada, mas não está cadastrada como
          membro da equipe (hakuna). Peça à organização para incluir seu e-mail na tabela de staff.
        </Banner>
      </PlatformShell>
    )
  }

  return <>{children}</>
}
