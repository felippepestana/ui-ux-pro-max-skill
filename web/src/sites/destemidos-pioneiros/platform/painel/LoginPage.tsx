import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../auth/AuthProvider'
import { PlatformShell, Field, inputStyle, Banner } from '../ui'

export default function LoginPage() {
  const nav = useNavigate()
  const { session } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [magicSent, setMagicSent] = useState(false)

  if (session) { nav('/destemidos-pioneiros/painel', { replace: true }) }

  async function loginSenha(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setErro(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    setBusy(false)
    if (error) { setErro(error.message); return }
    nav('/destemidos-pioneiros/painel', { replace: true })
  }

  async function magicLink() {
    if (!email) { setErro('Informe o e-mail.'); return }
    setBusy(true); setErro(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/destemidos-pioneiros/painel` },
    })
    setBusy(false)
    if (error) { setErro(error.message); return }
    setMagicSent(true)
  }

  return (
    <PlatformShell title="Painel da equipe" subtitle="Acesso restrito aos hakunas" back={{ to: '/destemidos-pioneiros', label: 'Site' }}>
      {erro && <Banner kind="error">{erro}</Banner>}
      {magicSent && <Banner kind="success">Enviamos um link de acesso para {email}. Confira seu e-mail.</Banner>}
      <form onSubmit={loginSenha} className="dp-card" style={{ maxWidth: 420 }}>
        <Field label="E-mail" required><input type="email" style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} /></Field>
        <Field label="Senha"><input type="password" style={inputStyle} value={senha} onChange={e => setSenha(e.target.value)} /></Field>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button type="submit" className="dp-btn dp-btn-primary" disabled={busy}>Entrar</button>
          <button type="button" className="dp-btn dp-btn-ghost" disabled={busy} onClick={magicLink}>Entrar por link mágico</button>
        </div>
      </form>
    </PlatformShell>
  )
}
