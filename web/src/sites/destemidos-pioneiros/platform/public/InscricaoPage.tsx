import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import type { TablesInsert } from '../database.types'
import {
  COMORBIDADES, calcularImc, classificarRisco, examesExigidosPorRisco,
  idadeFromNascimento, RISCO_LABEL, RISCO_COR,
} from '../lib/risco'
import { PlatformShell, Field, inputStyle, Banner } from '../ui'

const EVENTO = 'TOP 1270 — Destemidos Pioneiros'
const CAMISAS = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG']
const SANGUE = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Não sei']

interface FormValues {
  nome: string; cpf: string; email: string; telefone: string
  data_nascimento: string; cidade: string; estado: string; profissao: string
  instagram: string; igreja: string; familia: string; tamanho_camisa: string
  tipo_sanguineo: string; peso_kg: string; altura_cm: string
  cond_fisica_autorelatada: string
  plano_saude: boolean; qual_plano: string
  restricao_alimentar: boolean
  uso_medicamento: boolean; medicamentos: string
  cond_medica_detalhada: string
  comorbidades: string[]
  vai_acompanhado: boolean; nome_acompanhante: string
  nome_conjuge: string; whatsapp_conjuge: string; email_conjuge: string
  termo: boolean
}

export default function InscricaoPage() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: { comorbidades: [], plano_saude: false, restricao_alimentar: false, uso_medicamento: false, vai_acompanhado: false, termo: false },
  })
  const [done, setDone] = useState<null | { upload_token: string; mensagens_token: string; risco: string }>(null)
  const [erro, setErro] = useState<string | null>(null)

  const peso = parseFloat(watch('peso_kg') || '')
  const altura = parseFloat(watch('altura_cm') || '')
  const nascimento = watch('data_nascimento')
  const comorbidades = watch('comorbidades') || []
  const cond = parseInt(watch('cond_fisica_autorelatada') || '3', 10)
  const planoSaude = watch('plano_saude')
  const usoMed = watch('uso_medicamento')
  const acompanhado = watch('vai_acompanhado')

  const imc = useMemo(() => calcularImc(peso || null, altura || null), [peso, altura])
  const risco = useMemo(
    () => (nascimento ? classificarRisco({ dataNascimento: nascimento, imc, comorbidades, condFisica: cond }) : null),
    [nascimento, imc, comorbidades, cond],
  )

  async function onSubmit(v: FormValues) {
    setErro(null)
    if (!v.termo) { setErro('É necessário aceitar o termo de participação.'); return }
    const riscoFinal = classificarRisco({ dataNascimento: v.data_nascimento, imc, comorbidades: v.comorbidades, condFisica: cond })
    const payload: TablesInsert<'senderistas'> = {
      nome: v.nome,
      telefone: v.telefone,
      data_nascimento: v.data_nascimento,
      classificacao_risco: riscoFinal,
      exames_exigidos: examesExigidosPorRisco(riscoFinal),
      cpf: v.cpf || null,
      email: v.email || null,
      cidade: v.cidade || null,
      estado: v.estado || null,
      profissao: v.profissao || null,
      instagram: v.instagram || null,
      igreja: v.igreja || null,
      familia: v.familia || null,
      tamanho_camisa: v.tamanho_camisa || null,
      tipo_sanguineo: v.tipo_sanguineo || null,
      peso_kg: peso || null,
      altura_cm: altura || null,
      cond_fisica_autorelatada: cond || null,
      plano_saude: v.plano_saude,
      qual_plano: v.plano_saude ? (v.qual_plano || null) : null,
      restricao_alimentar: v.restricao_alimentar,
      uso_medicamento: v.uso_medicamento,
      medicamentos: v.uso_medicamento ? (v.medicamentos || null) : null,
      cond_medica_detalhada: v.cond_medica_detalhada || null,
      comorbidades: v.comorbidades,
      vai_acompanhado: v.vai_acompanhado,
      nome_acompanhante: v.vai_acompanhado ? (v.nome_acompanhante || null) : null,
      nome_conjuge: v.nome_conjuge || null,
      whatsapp_conjuge: v.whatsapp_conjuge || null,
      email_conjuge: v.email_conjuge || null,
      evento_nome: EVENTO,
      termo_aceito: true,
      termo_aceito_em: new Date().toISOString(),
    }
    const { data, error } = await supabase
      .from('senderistas')
      .insert(payload)
      .select('upload_token, mensagens_token, classificacao_risco')
      .single()
    if (error) { setErro(`Não foi possível concluir a inscrição: ${error.message}`); return }
    setDone({ upload_token: data.upload_token, mensagens_token: data.mensagens_token, risco: data.classificacao_risco })
  }

  if (done) {
    return (
      <PlatformShell title="Inscrição recebida!" subtitle="Guarde os links abaixo — eles são pessoais e intransferíveis.">
        <Banner kind="success">
          Sua classificação preliminar de risco é <strong>{RISCO_LABEL[done.risco as 'baixo']}</strong>.
          A equipe médica pode revisar essa classificação.
        </Banner>
        <div className="dp-card" style={{ marginBottom: '1rem' }}>
          <h3 className="dp-display" style={{ fontSize: '1.15rem' }}>Envio de exames</h3>
          <p style={{ color: 'var(--dp-n-700)', margin: '0.4rem 0' }}>Use este link para enviar seus atestados médicos:</p>
          <Link to={`/destemidos-pioneiros/exames/${done.upload_token}`} className="dp-btn dp-btn-primary">Abrir portal de exames →</Link>
        </div>
        <div className="dp-card">
          <h3 className="dp-display" style={{ fontSize: '1.15rem' }}>Mensagens da família</h3>
          <p style={{ color: 'var(--dp-n-700)', margin: '0.4rem 0' }}>Compartilhe este link com quem quiser te enviar uma mensagem de apoio para a montanha:</p>
          <Link to={`/destemidos-pioneiros/mensagens/${done.mensagens_token}`} className="dp-btn dp-btn-ghost">Abrir portal de mensagens →</Link>
        </div>
      </PlatformShell>
    )
  }

  return (
    <PlatformShell title="Inscrição do Senderista" subtitle={EVENTO + ' · Porto Velho/RO · 02–05 OUT 2025'} back={{ to: '/destemidos-pioneiros', label: 'Voltar ao site' }}>
      {erro && <Banner kind="error">{erro}</Banner>}
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 760 }}>
        <SectionTitle>1 · Dados pessoais</SectionTitle>
        <Field label="Nome completo" required>
          <input style={inputStyle} {...register('nome', { required: true })} aria-invalid={!!errors.nome} />
        </Field>
        <Row>
          <Field label="CPF"><input style={inputStyle} {...register('cpf')} placeholder="000.000.000-00" /></Field>
          <Field label="Telefone / WhatsApp" required><input style={inputStyle} {...register('telefone', { required: true })} /></Field>
        </Row>
        <Row>
          <Field label="E-mail"><input type="email" style={inputStyle} {...register('email')} /></Field>
          <Field label="Data de nascimento" required><input type="date" style={inputStyle} {...register('data_nascimento', { required: true })} /></Field>
        </Row>
        <Row>
          <Field label="Cidade"><input style={inputStyle} {...register('cidade')} /></Field>
          <Field label="Estado"><input style={inputStyle} maxLength={2} placeholder="RO" {...register('estado')} /></Field>
        </Row>
        <Row>
          <Field label="Profissão"><input style={inputStyle} {...register('profissao')} /></Field>
          <Field label="Instagram"><input style={inputStyle} placeholder="@usuario" {...register('instagram')} /></Field>
        </Row>
        <Row>
          <Field label="Igreja"><input style={inputStyle} {...register('igreja')} /></Field>
          <Field label="Família / equipe"><input style={inputStyle} {...register('familia')} /></Field>
        </Row>
        <Field label="Tamanho da camisa">
          <select style={inputStyle} {...register('tamanho_camisa')}>
            <option value="">Selecione…</option>
            {CAMISAS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>

        <SectionTitle>2 · Saúde</SectionTitle>
        <Row>
          <Field label="Tipo sanguíneo">
            <select style={inputStyle} {...register('tipo_sanguineo')}>
              <option value="">Selecione…</option>
              {SANGUE.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Condição física (1 = sedentário, 5 = atleta)">
            <select style={inputStyle} {...register('cond_fisica_autorelatada')} defaultValue="3">
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </Field>
        </Row>
        <Row>
          <Field label="Peso (kg)"><input type="number" step="0.1" style={inputStyle} {...register('peso_kg')} /></Field>
          <Field label="Altura (cm)"><input type="number" step="1" style={inputStyle} {...register('altura_cm')} /></Field>
        </Row>

        {(imc || risco) && (
          <div className="dp-card" style={{ display: 'flex', gap: '2rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {imc && <div><div style={{ fontSize: '0.8rem', color: 'var(--dp-n-500)' }}>IMC</div><div className="dp-display" style={{ fontSize: '1.6rem' }}>{imc}</div></div>}
            {nascimento && <div><div style={{ fontSize: '0.8rem', color: 'var(--dp-n-500)' }}>Idade</div><div className="dp-display" style={{ fontSize: '1.6rem' }}>{idadeFromNascimento(nascimento)}</div></div>}
            {risco && <div><div style={{ fontSize: '0.8rem', color: 'var(--dp-n-500)' }}>Risco preliminar</div><div className="dp-display" style={{ fontSize: '1.6rem', color: RISCO_COR[risco] }}>{RISCO_LABEL[risco]}</div></div>}
          </div>
        )}

        <Field label="Comorbidades (marque o que se aplica)">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '0.4rem' }}>
            {COMORBIDADES.map(c => (
              <label key={c} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', fontSize: '0.9rem' }}>
                <input type="checkbox" value={c} {...register('comorbidades')} /> {c}
              </label>
            ))}
          </div>
        </Field>
        <Field label="Condição médica detalhada (opcional)">
          <textarea style={{ ...inputStyle, minHeight: 70 }} {...register('cond_medica_detalhada')} />
        </Field>
        <Row>
          <Field label="Possui plano de saúde?">
            <label style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}><input type="checkbox" {...register('plano_saude')} /> Sim</label>
          </Field>
          {planoSaude && <Field label="Qual plano?"><input style={inputStyle} {...register('qual_plano')} /></Field>}
        </Row>
        <Row>
          <Field label="Usa medicamento contínuo?">
            <label style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}><input type="checkbox" {...register('uso_medicamento')} /> Sim</label>
          </Field>
          {usoMed && <Field label="Quais medicamentos?"><input style={inputStyle} {...register('medicamentos')} /></Field>}
        </Row>
        <Field label="Possui restrição alimentar?">
          <label style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}><input type="checkbox" {...register('restricao_alimentar')} /> Sim</label>
        </Field>

        <SectionTitle>3 · Família e acompanhante</SectionTitle>
        <Row>
          <Field label="Nome do cônjuge"><input style={inputStyle} {...register('nome_conjuge')} /></Field>
          <Field label="WhatsApp do cônjuge"><input style={inputStyle} {...register('whatsapp_conjuge')} /></Field>
        </Row>
        <Field label="E-mail do cônjuge"><input type="email" style={inputStyle} {...register('email_conjuge')} /></Field>
        <Field label="Vai acompanhado?">
          <label style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}><input type="checkbox" {...register('vai_acompanhado')} /> Sim</label>
        </Field>
        {acompanhado && <Field label="Nome do acompanhante"><input style={inputStyle} {...register('nome_acompanhante')} /></Field>}

        <SectionTitle>4 · Termo</SectionTitle>
        <div className="dp-card" style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
            <input type="checkbox" {...register('termo', { required: true })} style={{ marginTop: 4 }} />
            <span style={{ color: 'var(--dp-n-800)', fontSize: '0.92rem', lineHeight: 1.5 }}>
              Declaro que as informações são verdadeiras, estou ciente dos riscos físicos da travessia,
              autorizo atendimento médico de emergência e aceito as regras do Movimento Legendários para o {EVENTO}.
            </span>
          </label>
        </div>

        <button type="submit" className="dp-btn dp-btn-primary" disabled={isSubmitting} style={{ fontSize: '1rem' }}>
          {isSubmitting ? 'Enviando…' : 'Concluir inscrição'}
        </button>
      </form>
    </PlatformShell>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="dp-display" style={{ fontSize: '1.3rem', margin: '1.75rem 0 0.75rem', color: 'var(--dp-blood)' }}>{children}</h2>
}
function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '0 1rem' }}>{children}</div>
}
