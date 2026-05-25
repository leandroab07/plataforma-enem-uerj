import type { EstadoTopico, Status } from './types'

// ADR-002 thresholds
const PRIOR_ALPHA = 2
const PRIOR_BETA = 2
const THRESHOLD_DOMINADO = 0.75
const THRESHOLD_ENFRAQUECIDO = 0.5
const MIN_QUESTOES_UNICAS_DOMINIO = 5
const PESO_RE_TENTATIVA = 0.3
const DECAY_HALF_LIFE_DAYS = 21

export function calcularMastery(
  estado: EstadoTopico,
  _questaoId: string,
  acertou: boolean,
  jaRespondida: boolean,
): EstadoTopico {
  const peso = jaRespondida ? PESO_RE_TENTATIVA : 1.0
  const alpha = PRIOR_ALPHA + (acertou ? peso : 0)
  const beta = PRIOR_BETA + (acertou ? 0 : peso)

  // Recalculate with accumulated history (simplified: use new alpha/beta directly)
  const novoScore = alpha / (alpha + beta)

  const novoEstado = { ...estado }
  novoEstado.total_tentativas += 1
  novoEstado.ultima_tentativa_em = new Date().toISOString()

  if (!jaRespondida) {
    novoEstado.questoes_unicas_tentadas += 1
    if (acertou) novoEstado.questoes_unicas_acertadas += 1
  }

  novoEstado.mastery_score = novoScore
  novoEstado.decay_score = novoScore

  const dominado =
    novoScore >= THRESHOLD_DOMINADO &&
    novoEstado.questoes_unicas_acertadas >= MIN_QUESTOES_UNICAS_DOMINIO

  const enfraquecido = novoScore < THRESHOLD_ENFRAQUECIDO && novoEstado.total_tentativas > 0

  if (dominado) {
    novoEstado.status = 'dominado'
  } else if (enfraquecido) {
    novoEstado.status = 'enfraquecido'
  } else if (novoEstado.total_tentativas > 0) {
    novoEstado.status = 'em_progresso'
  }

  return novoEstado
}

export function aplicarDecaimento(estado: EstadoTopico): number {
  if (!estado.ultima_tentativa_em || estado.decay_score === 0) return estado.decay_score
  const diasPassados =
    (Date.now() - new Date(estado.ultima_tentativa_em).getTime()) / (1000 * 60 * 60 * 24)
  return estado.mastery_score * Math.pow(0.5, diasPassados / DECAY_HALF_LIFE_DAYS)
}

export function statusColor(status: Status): string {
  switch (status) {
    case 'dominado':
      return 'text-emerald-600'
    case 'em_progresso':
      return 'text-blue-600'
    case 'enfraquecido':
      return 'text-amber-600'
    default:
      return 'text-slate-400'
  }
}

export function statusBg(status: Status): string {
  switch (status) {
    case 'dominado':
      return 'bg-emerald-500'
    case 'em_progresso':
      return 'bg-blue-500'
    case 'enfraquecido':
      return 'bg-amber-500'
    default:
      return 'bg-slate-200'
  }
}

export function statusLabel(status: Status): string {
  switch (status) {
    case 'dominado':
      return 'Dominado'
    case 'em_progresso':
      return 'Em progresso'
    case 'enfraquecido':
      return 'Enfraquecido'
    default:
      return 'Não iniciado'
  }
}
