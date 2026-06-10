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

  function normalizarErro(raw: string): string {
    const m = raw.toLowerCase()
    if (m.includes('invalid login') || m.includes('invalid credentials')) return 'E-mail ou senha não conferem. Confira e tente de novo.'
    if (m.includes('email not confirmed')) return 'Confirme o e-mail antes de entrar — o link foi enviado quando seu cadastro foi criado.'
    if (m.includes('rate limit') || m.includes('too many')) return 'Muitas tentativas em sequência. Aguarde alguns minutos e tente de novo.'
    if (m.includes('network') || m.includes('fetch')) return 'Sem conexão. Verifique a internet e tente de novo.'
    return 'Não conseguimos validar o acesso. Se persistir, fale com a coordenação.'
  }

  async function loginSenha(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setErro(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    setBusy(false)
    if (error) { console.error('[login] signIn failed', error); setErro(normalizarErro(error.message)); return }
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
    if (error) { console.error('[login] magicLink failed', error); setErro(normalizarErro(error.message)); return }
    setMagicSent(true)
  }

  return (
    <PlatformShell title="Painel da equipe" subtitle="Acesso restrito aos hakunas" back={{ to: '/destemidos-pioneiros', label: 'Site' }}>
      {erro && <Banner kind="error">{erro}</Banner>}
      {magicSent && <Banner kind="success">Enviamos um link de acesso para <strong>{email}</strong>. Confira o e-mail — o link expira em 1 hora.</Banner>}
      <div className="dp-card" style={{ maxWidth: 560, marginBottom: '1rem', borderLeft: '4px solid var(--dp-river)', background: 'white', color: 'var(--dp-n-800)' }}>
        O painel é a ferramenta de operação durante o TOP. Só hakunas cadastrados pela coordenação têm acesso. Se você não tem credencial, fale com a coordenação <strong>antes</strong> do evento — não cadastramos durante a travessia.
      </div>
      <form onSubmit={loginSenha} className="dp-card" style={{ maxWidth: 420 }}>
        <Field label="E-mail" required><input type="email" style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} /></Field>
        <Field label="Senha"><input type="password" style={inputStyle} value={senha} onChange={e => setSenha(e.target.value)} /></Field>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button type="submit" className="dp-btn dp-btn-primary" disabled={busy}>{busy ? 'Validando…' : 'Entrar'}</button>
          <button type="button" className="dp-btn dp-btn-ghost" disabled={busy} onClick={magicLink}>Receber link por e-mail</button>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--dp-n-500)', marginTop: '0.75rem', marginBottom: 0 }}>
          Esqueceu a senha? Use o link mágico — chega no seu e-mail e dispensa senha.
        </p>
      </form>
    </PlatformShell>
  )
}
