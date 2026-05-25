import type { EstadoTopico, Tentativa } from './types'
import { estadoTopicosInicial } from './mock-data'

const KEY_ESTADO = 'plataforma:estado_topicos'
const KEY_TENTATIVAS = 'plataforma:tentativas'

export function carregarEstado(): EstadoTopico[] {
  try {
    const raw = localStorage.getItem(KEY_ESTADO)
    return raw ? JSON.parse(raw) : estadoTopicosInicial()
  } catch {
    return estadoTopicosInicial()
  }
}

export function salvarEstado(estado: EstadoTopico[]): void {
  localStorage.setItem(KEY_ESTADO, JSON.stringify(estado))
}

export function carregarTentativas(): Tentativa[] {
  try {
    const raw = localStorage.getItem(KEY_TENTATIVAS)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function salvarTentativa(t: Tentativa): void {
  const tentativas = carregarTentativas()
  tentativas.push(t)
  localStorage.setItem(KEY_TENTATIVAS, JSON.stringify(tentativas))
}

export function jaRespondida(questaoId: string): boolean {
  return carregarTentativas().some((t) => t.questao_id === questaoId)
}

export function resetarProgresso(): void {
  localStorage.removeItem(KEY_ESTADO)
  localStorage.removeItem(KEY_TENTATIVAS)
}
