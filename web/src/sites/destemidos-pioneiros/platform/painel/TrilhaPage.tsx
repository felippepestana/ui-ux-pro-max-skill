import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../auth/AuthProvider'
import { PainelLayout } from './PainelLayout'
import { Spinner, Banner, EmptyState, Field, inputStyle } from '../ui'
import type { AtividadeTop, Senderista } from '../database.types'

const TIPOS_ATIV = ['predica', 'hidratacao', 'acampamento', 'checkpoint', 'chegada', 'saida', 'outro']

export default function TrilhaPage() {
  const { hakuna } = useAuth()
  const [ativs, setAtivs] = useState<AtividadeTop[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  // create activity
  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState('checkpoint')
  const [descricao, setDescricao] = useState('')
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)

  // register participation
  const [ativSel, setAtivSel] = useState('')
  const [tipoReg, setTipoReg] = useState<'entrada' | 'saida'>('entrada')
  const [buscaSender, setBuscaSender] = useState('')
  const [achados, setAchados] = useState<Senderista[]>([])

  async function load() {
    setLoading(true)
    const { data, error } = await supabase.from('atividades_top').select('*').order('created_at', { ascending: false })
    if (error) {
      console.error('[trilha] load failed', error)
      setErro('Não foi possível carregar as atividades. Tente recarregar a página.')
      setAtivs([])
    } else {
      setErro(null)
      setAtivs(data ?? [])
      if (data?.[0] && !ativSel) setAtivSel(data[0].id)
    }
    setLoading(false)
  }
  useEffect(() => { load() /* eslint-disable-next-line */ }, [])

  function pegarGps() {
    if (!navigator.geolocation) { setMsg('Geolocalização indisponível neste dispositivo.'); return }
    navigator.geolocation.getCurrentPosition(
      p => setCoords({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setMsg('Não foi possível obter a localização.'),
    )
  }

  async function criarAtividade() {
    if (!nome) { setMsg('Dê um nome à atividade.'); return }
    const { error } = await supabase.from('atividades_top').insert({
      nome, tipo, descricao: descricao || null,
      localizacao_lat: coords?.lat ?? null, localizacao_lng: coords?.lng ?? null,
      hora_planejada: new Date().toISOString(), evento_nome: 'TOP 1270 — Destemidos Pioneiros',
    })
    if (error) { setMsg(`Erro: ${error.message}`); return }
    setNome(''); setDescricao(''); setCoords(null); setMsg('Atividade criada.')
    await load()
  }

  async function buscar() {
    // Sanitize: inside a PostgREST .or() string, "," "(" ")" are grammar chars and
    // "*" is the ilike wildcard — strip them so a name like "Silva, João" can't break
    // (or inject into) the filter. PostgREST ilike uses "*" as the wildcard, not "%".
    const q = buscaSender.trim().replace(/[,()*]/g, '')
    if (!q) return
    const { data, error } = await supabase.from('senderistas').select('*')
      .or(`nome.ilike.*${q}*,nfc_tag_id.eq.${q},cpf.ilike.*${q}*`).limit(8)
    if (error) { setMsg(`Erro na busca: ${error.message}`); return }
    setAchados(data ?? [])
  }

  async function registrar(senderista_id: string) {
    if (!ativSel) { setMsg('Selecione uma atividade.'); return }
    const { error } = await supabase.from('participacoes').insert({
      senderista_id, atividade_id: ativSel, tipo: tipoReg, hakuna_id: hakuna?.id ?? null,
    })
    if (error) { setMsg(`Erro: ${error.message}`); return }
    setMsg(`Registrado: ${tipoReg}.`)
  }

  if (loading) return <PainelLayout title="Trilha"><Spinner /></PainelLayout>

  return (
    <PainelLayout title="Trilha & checkpoints">
      {erro && <Banner kind="error">{erro}</Banner>}
      {msg && <Banner kind={msg.startsWith('Erro') ? 'error' : 'success'}>{msg}</Banner>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.25rem' }}>
        <div className="dp-card">
          <h3 className="dp-display" style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Nova atividade</h3>
          <Field label="Nome" required><input style={inputStyle} value={nome} onChange={e => setNome(e.target.value)} /></Field>
          <Field label="Tipo"><select style={inputStyle} value={tipo} onChange={e => setTipo(e.target.value)}>{TIPOS_ATIV.map(t => <option key={t}>{t}</option>)}</select></Field>
          <Field label="Descrição"><input style={inputStyle} value={descricao} onChange={e => setDescricao(e.target.value)} /></Field>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
            <button className="dp-btn dp-btn-ghost" style={{ padding: '0.4rem 0.8rem' }} onClick={pegarGps} type="button">Usar GPS</button>
            <span style={{ fontSize: '0.82rem', color: 'var(--dp-n-600)' }}>{coords ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : 'sem coordenada'}</span>
          </div>
          <button className="dp-btn dp-btn-primary" onClick={criarAtividade}>Criar atividade</button>
        </div>

        <div className="dp-card">
          <h3 className="dp-display" style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Registrar passagem</h3>
          <Field label="Atividade">
            <select style={inputStyle} value={ativSel} onChange={e => setAtivSel(e.target.value)}>
              {ativs.map(a => <option key={a.id} value={a.id}>{a.nome} ({a.tipo})</option>)}
            </select>
          </Field>
          <Field label="Tipo de registro">
            <select style={inputStyle} value={tipoReg} onChange={e => setTipoReg(e.target.value as 'entrada' | 'saida')}>
              <option value="entrada">Entrada</option><option value="saida">Saída</option>
            </select>
          </Field>
          <Field label="Buscar senderista (nome, CPF ou NFC)">
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <input style={inputStyle} value={buscaSender} onChange={e => setBuscaSender(e.target.value)} onKeyDown={e => e.key === 'Enter' && buscar()} />
              <button className="dp-btn dp-btn-ghost" style={{ padding: '0.4rem 0.8rem' }} onClick={buscar}>Buscar</button>
            </div>
          </Field>
          {achados.map(s => (
            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--dp-n-200)', padding: '0.5rem 0' }}>
              <span>{s.nome}</span>
              <button className="dp-btn dp-btn-primary" style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }} onClick={() => registrar(s.id)}>Registrar {tipoReg}</button>
            </div>
          ))}
        </div>
      </div>

      <h3 className="dp-display" style={{ fontSize: '1.1rem', margin: '1.5rem 0 0.5rem' }}>Atividades ({ativs.length})</h3>
      {ativs.length === 0 && !erro && (
        <EmptyState
          title="Nenhuma atividade cadastrada"
          description="Use o cartão acima para criar o primeiro checkpoint (prédica, hidratação, acampamento, chegada…)."
        />
      )}
      {ativs.map(a => (
        <div key={a.id} className="dp-card" style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
          <span><strong>{a.nome}</strong> <span style={{ color: 'var(--dp-n-500)' }}>· {a.tipo}</span></span>
          <span style={{ color: 'var(--dp-n-500)', fontSize: '0.85rem' }}>{a.localizacao_lat != null && a.localizacao_lng != null ? `${a.localizacao_lat.toFixed(4)}, ${a.localizacao_lng.toFixed(4)}` : 'sem GPS'}</span>
        </div>
      ))}
    </PainelLayout>
  )
}
