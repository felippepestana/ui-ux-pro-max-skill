import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { uploadToBucket } from '../lib/storage'
import { TIPOS_EXAME, type TipoExame } from '../lib/risco'
import { fetchSenderistaPorToken, type SenderistaPublico } from '../lib/senderistaToken'
import { PlatformShell, Field, inputStyle, Banner, Spinner } from '../ui'
import type { Exame } from '../database.types'

export default function ExamesUploadPage() {
  const { upload_token = '' } = useParams()
  const [senderista, setSenderista] = useState<SenderistaPublico | null>(null)
  const [exames, setExames] = useState<Exame[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [tipo, setTipo] = useState<TipoExame>('atestado_cg')
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [ok, setOk] = useState<string | null>(null)

  async function load() {
    const { data, error } = await fetchSenderistaPorToken(upload_token)
    if (error) { setErro(error); setLoading(false); return }
    setSenderista(data)
    if (data) {
      const { data: ex, error: exErr } = await supabase.from('exames').select('*').eq('senderista_id', data.id).order('created_at', { ascending: false })
      if (exErr) setErro(exErr.message)
      setExames(ex ?? [])
      const exigidos = data.exames_exigidos as TipoExame[]
      if (exigidos?.length) setTipo(exigidos[0])
    }
    setLoading(false)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load() }, [upload_token])

  async function enviar() {
    if (!senderista || !file) return
    setBusy(true); setErro(null); setOk(null)
    try {
      const path = await uploadToBucket('exames', senderista.id, file)
      const { error } = await supabase.from('exames').insert({ senderista_id: senderista.id, tipo, arquivo_url: path })
      if (error) throw error
      setOk('Exame enviado! A equipe médica vai validar em até 72 horas.')
      setFile(null)
      await load()
    } catch (e: any) {
      console.error('[exames-upload] failed', e)
      setErro('Não conseguimos registrar o envio. Tente de novo em alguns instantes — se persistir, fale com o staff.')
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <PlatformShell><Spinner /></PlatformShell>
  if (!senderista) return <PlatformShell title="Portal de exames"><Banner kind="error">{erro ?? 'Link inválido.'}</Banner></PlatformShell>

  const exigidos = (senderista.exames_exigidos as TipoExame[]) ?? []
  const enviadosPorTipo = new Set(exames.map(e => e.tipo))

  return (
    <PlatformShell title={`Olá, ${senderista.nome.split(' ')[0]}`} subtitle="Envio de exames médicos" back={{ to: '/destemidos-pioneiros', label: 'Site' }}>
      {ok && <Banner kind="success">{ok}</Banner>}
      {erro && <Banner kind="error">{erro}</Banner>}

      <div className="dp-card" style={{ marginBottom: '1rem' }}>
        <h3 className="dp-display" style={{ fontSize: '1.1rem' }}>Exames exigidos para você</h3>
        <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.1rem', color: 'var(--dp-n-700)' }}>
          {exigidos.map(t => (
            <li key={t} style={{ marginBottom: 4 }}>
              {TIPOS_EXAME[t]} {enviadosPorTipo.has(t)
                ? <span style={{ color: 'var(--dp-jungle)', fontWeight: 600 }}>· enviado</span>
                : <span style={{ color: 'var(--dp-clay)' }}>· pendente</span>}
            </li>
          ))}
          {exigidos.length === 0 && <li>Nenhum exame específico exigido até o momento.</li>}
        </ul>
      </div>

      <div className="dp-card" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--dp-river)', background: 'white' }}>
        <strong>O que aceitamos:</strong> PDF ou foto (JPG/PNG/HEIC), até 10&nbsp;MB. Foto do laudo serve, desde que esteja <strong>legível, com o nome do médico e a data visíveis</strong>. Atestados com mais de 6&nbsp;meses costumam ser reprovados — confira a validade antes de enviar.
      </div>

      <div className="dp-card" style={{ maxWidth: 520 }}>
        <h3 className="dp-display" style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Enviar um exame</h3>
        <Field label="Tipo de exame" required>
          <select style={inputStyle} value={tipo} onChange={e => setTipo(e.target.value as TipoExame)}>
            {Object.entries(TIPOS_EXAME).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
          </select>
        </Field>
        <Field label="Arquivo (PDF ou imagem)" required>
          <input type="file" accept="application/pdf,image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} />
        </Field>
        <button className="dp-btn dp-btn-primary" disabled={!file || busy} onClick={enviar}>
          {busy ? 'Enviando…' : 'Enviar exame'}
        </button>
      </div>

      {exames.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3 className="dp-display" style={{ fontSize: '1.1rem' }}>Seus envios</h3>
          {exames.map(e => (
            <div key={e.id} className="dp-card" style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{TIPOS_EXAME[e.tipo as TipoExame] ?? e.tipo}</span>
              <span style={{ fontWeight: 600, color: e.validado === true ? 'var(--dp-jungle)' : e.validado === false ? 'var(--dp-blood)' : 'var(--dp-clay)' }}>
                {e.validado === true ? 'Validado' : e.validado === false ? `Reprovado${e.motivo_reprovacao ? ` — ${e.motivo_reprovacao}` : ''}` : 'Em análise'}
              </span>
            </div>
          ))}
        </div>
      )}
    </PlatformShell>
  )
}
