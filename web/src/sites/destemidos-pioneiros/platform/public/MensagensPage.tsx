import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { uploadToBucket } from '../lib/storage'
import { fetchSenderistaMensagens, type SenderistaMensagens } from '../lib/senderistaToken'
import { PlatformShell, Field, inputStyle, Banner, Spinner } from '../ui'

type TipoMsg = 'carta' | 'foto' | 'video' | 'audio'
const TIPOS: { id: TipoMsg; label: string; accept?: string }[] = [
  { id: 'carta', label: 'Carta (texto)' },
  { id: 'foto', label: 'Foto', accept: 'image/*' },
  { id: 'video', label: 'Vídeo', accept: 'video/*' },
  { id: 'audio', label: 'Áudio', accept: 'audio/*' },
]

export default function MensagensPage() {
  const { mensagens_token = '' } = useParams()
  const [senderista, setSenderista] = useState<SenderistaMensagens | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [ok, setOk] = useState(false)
  const [busy, setBusy] = useState(false)

  const [tipo, setTipo] = useState<TipoMsg>('carta')
  const [enviadoPor, setEnviadoPor] = useState('')
  const [titulo, setTitulo] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    fetchSenderistaMensagens(mensagens_token).then(({ data, error }) => {
      setSenderista(data); setErro(error); setLoading(false)
    })
  }, [mensagens_token])

  async function enviar() {
    if (!senderista || !enviadoPor.trim()) { setErro('Diga quem está enviando a mensagem.'); return }
    if (tipo === 'carta' && !conteudo.trim()) { setErro('Escreva a mensagem.'); return }
    if (tipo !== 'carta' && !file) { setErro('Anexe o arquivo.'); return }
    setBusy(true); setErro(null)
    try {
      let arquivo_url: string | null = null
      if (file) arquivo_url = await uploadToBucket('mensagens', senderista.id, file)
      const { error } = await supabase.from('mensagens_apoio').insert({
        senderista_id: senderista.id, tipo, enviado_por: enviadoPor.trim(),
        titulo: titulo || null, conteudo: tipo === 'carta' ? conteudo : (conteudo || null), arquivo_url,
      })
      if (error) throw error
      setOk(true)
    } catch (e: any) {
      console.error('[mensagens] failed', e)
      setErro('Não conseguimos registrar sua mensagem. Tente de novo em alguns instantes — se persistir, fale com o staff.')
    } finally { setBusy(false) }
  }

  if (loading) return <PlatformShell><Spinner /></PlatformShell>
  if (!senderista) return <PlatformShell title="Mensagens de apoio"><Banner kind="error">{erro ?? 'Link inválido.'}</Banner></PlatformShell>

  if (ok) return (
    <PlatformShell title="Mensagem registrada">
      <Banner kind="success">
        Sua mensagem para <strong>{senderista.nome.split(' ')[0]}</strong> foi registrada. A entrega acontece num dos pontos da travessia — escolhido pela equipe conforme o momento. Você pode mandar quantas quiser; cada uma é entregue em seu tempo.
      </Banner>
      <button className="dp-btn dp-btn-ghost" onClick={() => { setOk(false); setConteudo(''); setTitulo(''); setFile(null) }}>Enviar outra</button>
    </PlatformShell>
  )

  return (
    <PlatformShell title={`Mensagem para ${senderista.nome.split(' ')[0]}`} subtitle="Será entregue na montanha, durante a travessia." back={{ to: '/destemidos-pioneiros', label: 'Site' }}>
      {erro && <Banner kind="error">{erro}</Banner>}
      <div className="dp-card" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--dp-river)', background: 'white' }}>
        Durante os quatro dias do TOP, <strong>{senderista.nome.split(' ')[0]}</strong> fica sem celular e sem contato com casa. O que você mandar por aqui chega até ele pela mão do staff — na prédica, no acampamento, nos pontos de hidratação. Cartas, fotos, áudios e vídeos curtos funcionam.
      </div>
      <div className="dp-card" style={{ maxWidth: 560 }}>
        <Field label="Quem está enviando?" required>
          <input style={inputStyle} value={enviadoPor} onChange={e => setEnviadoPor(e.target.value)} placeholder="Ex.: Maria (esposa)" />
        </Field>
        <Field label="Tipo de mensagem" required>
          <select style={inputStyle} value={tipo} onChange={e => { setTipo(e.target.value as TipoMsg); setFile(null) }}>
            {TIPOS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </Field>
        <Field label="Título (opcional)"><input style={inputStyle} value={titulo} onChange={e => setTitulo(e.target.value)} /></Field>
        {tipo === 'carta' ? (
          <Field label="Mensagem" required>
            <textarea style={{ ...inputStyle, minHeight: 140 }} value={conteudo} onChange={e => setConteudo(e.target.value)} />
          </Field>
        ) : (
          <>
            <Field label="Arquivo" required>
              <input type="file" accept={TIPOS.find(t => t.id === tipo)?.accept} onChange={e => setFile(e.target.files?.[0] ?? null)} />
            </Field>
            <Field label="Legenda (opcional)"><input style={inputStyle} value={conteudo} onChange={e => setConteudo(e.target.value)} /></Field>
          </>
        )}
        <button className="dp-btn dp-btn-primary" disabled={busy} onClick={enviar}>{busy ? 'Enviando…' : 'Enviar mensagem'}</button>
      </div>
    </PlatformShell>
  )
}
