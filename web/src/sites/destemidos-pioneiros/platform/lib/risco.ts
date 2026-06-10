// Preliminary risk classification + required exams, computed client-side from the
// registration form. senderistas.classificacao_risco is NOT NULL, so the public form
// must supply a value; staff can override it later in the panel.

export type Risco = 'baixo' | 'medio' | 'alto'

export const TIPOS_EXAME = {
  atestado_cg: 'Atestado clínico geral',
  atestado_cardio: 'Atestado cardiológico',
  teste_esteira: 'Teste ergométrico (esteira)',
} as const

export type TipoExame = keyof typeof TIPOS_EXAME

export function idadeFromNascimento(dataNascimento: string): number {
  const nasc = new Date(dataNascimento)
  if (Number.isNaN(nasc.getTime())) return 0
  const diff = Date.now() - nasc.getTime()
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000))
}

export function calcularImc(pesoKg?: number | null, alturaCm?: number | null): number | null {
  if (!pesoKg || !alturaCm || alturaCm <= 0) return null
  const m = alturaCm / 100
  return Math.round((pesoKg / (m * m)) * 10) / 10
}

export function classificarRisco(input: {
  dataNascimento: string
  imc: number | null
  comorbidades: string[]
  condFisica?: number | null
}): Risco {
  const idade = idadeFromNascimento(input.dataNascimento)
  const nComorb = input.comorbidades.length
  const cond = input.condFisica ?? 3

  if (idade >= 60 || (input.imc ?? 0) >= 35 || nComorb >= 2 || cond <= 1) return 'alto'
  if (idade >= 45 || (input.imc ?? 0) >= 30 || nComorb === 1 || cond === 2) return 'medio'
  return 'baixo'
}

export function examesExigidosPorRisco(risco: Risco): TipoExame[] {
  if (risco === 'alto') return ['atestado_cg', 'atestado_cardio', 'teste_esteira']
  if (risco === 'medio') return ['atestado_cg', 'atestado_cardio']
  return ['atestado_cg']
}

export const COMORBIDADES = [
  'Hipertensão',
  'Diabetes',
  'Cardiopatia',
  'Asma / DPOC',
  'Obesidade',
  'Problema articular / ortopédico',
  'Doença renal',
  'Epilepsia',
  'Outra',
]

export const RISCO_LABEL: Record<Risco, string> = {
  baixo: 'Baixo',
  medio: 'Médio',
  alto: 'Alto',
}

export const RISCO_COR: Record<Risco, string> = {
  baixo: 'var(--dp-jungle)',
  medio: 'var(--dp-clay)',
  alto: 'var(--dp-blood)',
}
