export type Prova = 'ENEM' | 'UERJ'
export type Status = 'nao_iniciado' | 'em_progresso' | 'dominado' | 'enfraquecido'
export type Confianca = 1 | 2 | 3 | 4 | 5

export interface Topico {
  id: string
  titulo: string
  descricao: string
  area: string
  disciplina: string
  nivel: 1 | 2 | 3 | 4
  pre_requisitos: string[]
}

export interface EstadoTopico {
  topico_id: string
  status: Status
  mastery_score: number
  decay_score: number
  total_tentativas: number
  questoes_unicas_tentadas: number
  questoes_unicas_acertadas: number
  ultima_tentativa_em: string | null
}

export interface Questao {
  id: string
  id_origem: string
  prova: Prova
  ano: number
  numero_original: string | null
  area_origem: string | null
  tipo: 'objetiva' | 'discursiva'
  enunciado: string
  alternativas: Record<string, string>
  topico_id: string | null
  imagens_locais: string[] | null
}

export interface Tentativa {
  questao_id: string
  resposta_marcada: string
  acertou: boolean
  confianca: Confianca | null
}

export interface RespostaSubmissao {
  acertou: boolean
  gabarito: string
  mastery_score_novo: number
  status_novo: Status
  proximo_topico_desbloqueado: string | null
}

export interface SessaoPratica {
  topico: Topico
  questoes: Questao[]
  indiceAtual: number
  respostas: Tentativa[]
}
