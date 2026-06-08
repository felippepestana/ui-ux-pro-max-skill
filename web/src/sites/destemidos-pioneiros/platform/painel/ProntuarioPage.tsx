import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../auth/AuthProvider'
import { PainelLayout } from './PainelLayout'
import { Spinner, Banner, Field, inputStyle } from '../ui'
import { uploadToBucket, signedUrl } from '../lib/storage'
import type { Prontuario, Senderista } from '../database.types'

export default function ProntuarioPage() {
  const { senderista_id = '' } = useParams()
  const { hakuna } = useAuth()
  const [sender, setSender] = useState<Senderista | null>(null)
  const [rows, setRows] = useState<Prontuario[]>([])
  const [loading, setLoading] = useState(true)
  const [queixas, setQueixas] = useState('')
  const [condutas, setCondutas] = useState('')
  const [fotos, setFotos] = useState<FileList | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const [{ data: s }, { data: p }] = await Promise.all([
      supabase.from('senderistas').select('*').eq('id', senderista_id).maybeSingle(),
      supabase.from('prontuarios').select('*').eq('senderista_id', senderista_id).order('created_at', { ascending: false }),
    ])
    setSender(s); setRows(p ?? []); setLoading(false)
  }
  useEffect(() => { load() /* eslint-disable-next-line */ }, [senderista_id])

  async function salvar() {
    if (!queixas && !condutas && !fotos?.length) { setMsg('Preencha queixas, condutas ou anexe fotos antes de salvar.'); return }
    setBusy(true); setMsg(null)
    try {
      const fotos_urls: string[] = []
      if (fotos) for (const f of Array.from(fotos)) fotos_urls.push(await uploadToBucket('prontuarios', senderista_id, f))
      const { error } = await supabase.from('prontuarios').insert({
        senderista_id, hakuna_id: hakuna?.id ?? null, queixas: queixas || null, condutas: condutas || null, fotos_urls,
      })
      if (error) throw error
      setQueixas(''); setCondutas(''); setFotos(null); setMsg('Atendimento registrado no prontuário.')
      await load()
    } catch (e: any) {
      console.error('[prontuario] save failed', e)
      setMsg('Erro: não conseguimos registrar o atendimento. Tente de novo — se persistir, fale com a coordenação médica.')
    } finally { setBusy(false) }
  }

  async function verFoto(path: string) {
    const url = await signedUrl('prontuarios', path)
    if (url) window.open(url, '_blank', 'noopener')
  }

  if (loading) return <PainelLayout title="Prontuário"><Spinner /></PainelLayout>

  return (
    <PainelLayout title={`Prontuário — ${sender?.nome ?? ''}`}>
      {msg && <Banner kind={msg.startsWith('Erro') ? 'error' : 'success'}>{msg}</Banner>}
      {sender && (
        <p style={{ color: 'var(--dp-n-700)', marginBottom: '1rem' }}>
          Tipo sanguíneo {sender.tipo_sanguineo ?? '—'} · IMC {sender.imc ?? '—'} · Risco {sender.classificacao_risco}
          {sender.comorbidades?.length ? ` · ${sender.comorbidades.join(', ')}` : ''}
          {sender.uso_medicamento ? ` · Medicamentos: ${sender.medicamentos ?? 'sim'}` : ''}
        </p>
      )}

      <div className="dp-card" style={{ maxWidth: 620, marginBottom: '1rem', borderLeft: '4px solid var(--dp-river)', background: 'white', color: 'var(--dp-n-800)' }}>
        Cada atendimento é uma <strong>linha nova</strong> no histórico — não edite registros antigos. Em <strong>Queixas</strong>, use as palavras do senderista quando puder. Em <strong>Condutas</strong>, descreva o que foi feito (medicação, encaminhamento, liberação) com horário se relevante. <strong>Fotos</strong> só quando agregam (lesão, edema, sinal clínico) — evite rosto sem necessidade.
      </div>

      <div className="dp-card" style={{ maxWidth: 620, marginBottom: '1.5rem' }}>
        <h3 className="dp-display" style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Novo atendimento</h3>
        <Field label="Queixas"><textarea style={{ ...inputStyle, minHeight: 70 }} placeholder="Ex.: Dor no joelho direito há 2 horas, piora ao descer." value={queixas} onChange={e => setQueixas(e.target.value)} /></Field>
        <Field label="Condutas"><textarea style={{ ...inputStyle, minHeight: 70 }} placeholder="Ex.: Gelo 15min, dipirona 1g VO, liberado para próxima trilha." value={condutas} onChange={e => setCondutas(e.target.value)} /></Field>
        <Field label="Fotos (opcional)"><input type="file" accept="image/*" multiple onChange={e => setFotos(e.target.files)} /></Field>
        <button className="dp-btn dp-btn-primary" disabled={busy} onClick={salvar}>{busy ? 'Salvando…' : 'Salvar atendimento'}</button>
      </div>

      <h3 className="dp-display" style={{ fontSize: '1.1rem' }}>Histórico ({rows.length})</h3>
      {rows.map(p => (
        <div key={p.id} className="dp-card" style={{ marginTop: '0.6rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--dp-n-500)' }}>{new Date(p.created_at).toLocaleString('pt-BR')}</div>
          {p.queixas && <p style={{ margin: '0.4rem 0' }}><strong>Queixas:</strong> {p.queixas}</p>}
          {p.condutas && <p style={{ margin: '0.4rem 0' }}><strong>Condutas:</strong> {p.condutas}</p>}
          {p.fotos_urls?.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {p.fotos_urls.map((f, i) => <button key={i} className="dp-btn dp-btn-ghost" style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }} onClick={() => verFoto(f)}>Foto {i + 1}</button>)}
            </div>
          )}
        </div>
      ))}
      {rows.length === 0 && <p style={{ color: 'var(--dp-n-500)' }}>Sem atendimentos registrados.</p>}
    </PainelLayout>
  )
}
