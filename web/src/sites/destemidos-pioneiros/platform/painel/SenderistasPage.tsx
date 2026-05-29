import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { PainelLayout } from './PainelLayout'
import { Spinner, Banner, inputStyle } from '../ui'
import { RISCO_COR, RISCO_LABEL, TIPOS_EXAME, type TipoExame } from '../lib/risco'
import type { Senderista } from '../database.types'

const STATUS_OPCOES = ['pendente', 'aprovado', 'reprovado', 'confirmado']
const RISCO_OPCOES = ['baixo', 'medio', 'alto']

export default function SenderistasPage() {
  const [rows, setRows] = useState<Senderista[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [sel, setSel] = useState<Senderista | null>(null)
  const [msg, setMsg] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('senderistas').select('*').order('created_at', { ascending: false })
    setRows(data ?? []); setLoading(false)
  }
  useEffect(() => { load() }, [])

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(r => [r.nome, r.cpf, r.email, r.cidade, r.igreja].some(v => v?.toLowerCase().includes(q)))
  }, [rows, busca])

  async function salvar(patch: Partial<Senderista>) {
    if (!sel) return
    const { error } = await supabase.from('senderistas').update(patch).eq('id', sel.id)
    if (error) { setMsg(`Erro: ${error.message}`); return }
    setMsg('Salvo.')
    setSel({ ...sel, ...patch } as Senderista)
    await load()
  }

  if (loading) return <PainelLayout title="Senderistas"><Spinner /></PainelLayout>

  return (
    <PainelLayout title={`Senderistas (${rows.length})`}>
      {msg && <Banner kind={msg.startsWith('Erro') ? 'error' : 'success'}>{msg}</Banner>}
      <input style={{ ...inputStyle, maxWidth: 360, marginBottom: '1rem' }} placeholder="Buscar por nome, CPF, e-mail…" value={busca} onChange={e => setBusca(e.target.value)} />

      <div style={{ display: 'grid', gridTemplateColumns: sel ? '1fr 1fr' : '1fr', gap: '1.25rem' }}>
        <div style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', background: 'white', borderRadius: 'var(--dp-radius)' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--dp-n-500)' }}>
                <th style={th}>Nome</th><th style={th}>Cidade</th><th style={th}>Risco</th><th style={th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map(r => (
                <tr key={r.id} onClick={() => setSel(r)} style={{ cursor: 'pointer', borderTop: '1px solid var(--dp-n-200)', background: sel?.id === r.id ? 'var(--dp-n-100)' : 'transparent' }}>
                  <td style={td}>{r.nome}</td>
                  <td style={td}>{r.cidade ?? '—'}</td>
                  <td style={{ ...td, color: RISCO_COR[r.classificacao_risco as 'baixo'], fontWeight: 600 }}>{RISCO_LABEL[r.classificacao_risco as 'baixo'] ?? r.classificacao_risco}</td>
                  <td style={td}>{r.status}</td>
                </tr>
              ))}
              {filtrados.length === 0 && <tr><td style={td} colSpan={4}>Nenhum senderista encontrado.</td></tr>}
            </tbody>
          </table>
        </div>

        {sel && (
          <div className="dp-card" style={{ alignSelf: 'start', position: 'sticky', top: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="dp-display" style={{ fontSize: '1.3rem' }}>{sel.nome}</h3>
              <button className="dp-btn dp-btn-ghost" style={{ padding: '0.3rem 0.7rem' }} onClick={() => setSel(null)}>Fechar</button>
            </div>
            <p style={{ color: 'var(--dp-n-700)', fontSize: '0.9rem', margin: '0.25rem 0 1rem' }}>
              {sel.cidade}/{sel.estado} · {sel.telefone} · {sel.email ?? 'sem e-mail'}<br />
              IMC {sel.imc ?? '—'} · Cond. física {sel.cond_fisica_autorelatada ?? '—'} · Igreja {sel.igreja ?? '—'}
              {sel.comorbidades?.length ? <><br />Comorbidades: {sel.comorbidades.join(', ')}</> : null}
              {sel.uso_medicamento ? <><br />Medicamentos: {sel.medicamentos ?? 'sim'}</> : null}
            </p>

            <label style={lbl}>Status
              <select style={inputStyle} value={sel.status} onChange={e => salvar({ status: e.target.value })}>
                {STATUS_OPCOES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label style={lbl}>Classificação de risco
              <select style={inputStyle} value={sel.classificacao_risco} onChange={e => salvar({ classificacao_risco: e.target.value })}>
                {RISCO_OPCOES.map(s => <option key={s} value={s}>{RISCO_LABEL[s as 'baixo']}</option>)}
              </select>
            </label>
            <label style={lbl}>Exames exigidos
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
                {(Object.keys(TIPOS_EXAME) as TipoExame[]).map(t => (
                  <label key={t} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', fontSize: '0.88rem' }}>
                    <input type="checkbox" checked={sel.exames_exigidos?.includes(t)} onChange={e => {
                      const set = new Set(sel.exames_exigidos ?? [])
                      e.target.checked ? set.add(t) : set.delete(t)
                      salvar({ exames_exigidos: Array.from(set) })
                    }} /> {TIPOS_EXAME[t]}
                  </label>
                ))}
              </div>
            </label>
            <label style={lbl}>Orientações ao participante
              <textarea style={{ ...inputStyle, minHeight: 60 }} defaultValue={sel.orientacoes ?? ''} onBlur={e => salvar({ orientacoes: e.target.value || null })} />
            </label>
            <label style={lbl}>Motivo de reprovação / pendência
              <textarea style={{ ...inputStyle, minHeight: 50 }} defaultValue={sel.motivo_reprovacao ?? ''} onBlur={e => salvar({ motivo_reprovacao: e.target.value || null })} />
            </label>
            <Link to={`/destemidos-pioneiros/painel/prontuarios/${sel.id}`} className="dp-btn dp-btn-primary" style={{ marginTop: '0.5rem' }}>Prontuário →</Link>
          </div>
        )}
      </div>
    </PainelLayout>
  )
}

const th: React.CSSProperties = { padding: '0.6rem 0.75rem', fontWeight: 600 }
const td: React.CSSProperties = { padding: '0.55rem 0.75rem' }
const lbl: React.CSSProperties = { display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.75rem' }
