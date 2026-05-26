export type TipoSimulacao = 'phet_embed' | 'custom_konva' | 'nenhuma'
export type StatusUAI = 'rascunho' | 'revisao' | 'publicada'
export type TipoSecaoTeoria = 'texto' | 'formula' | 'destaque' | 'lista' | 'exemplo'
export type TipoConexao = 'prerequisito' | 'desbloqueia'

export interface SecaoTeoria {
  tipo: TipoSecaoTeoria
  conteudo?: string
  itens?: string[]
}

export interface OpcaoMicroex {
  id: string
  texto: string
}

export interface Microexercicio {
  id: string
  enunciado: string
  tipo: 'multipla_escolha'
  opcoes: OpcaoMicroex[]
  resposta_correta: string
  dica: string
  explicacao: string
  // Estado-alvo da simulação (usado em L3+)
  estado_alvo?: Record<string, unknown>
}

export interface ConexaoUAI {
  uai_id: string
  titulo: string
  tipo: TipoConexao
}

export interface ConteudoUAI {
  pergunta_ancora: string
  secao2_instrucao: string
  secao3_titulo: string
  secao3_teoria: SecaoTeoria[]
  secao4_microexercicios: Microexercicio[]
  secao5_questoes_ids: string[]
  secao6_resumo: string
  secao6_conexoes: ConexaoUAI[]
}

export interface UAI {
  id: string
  topico_id: string
  titulo: string
  area: string
  tem_simulacao: boolean
  tipo_simulacao: TipoSimulacao
  config_simulacao: Record<string, unknown>
  conteudo: ConteudoUAI
  versao_conteudo: number
  status: StatusUAI
}

// Progresso local (em memória / localStorage no modo demo)
export interface ProgressoUAI {
  uai_id: string
  secao_atual: number
  concluida: boolean
  iniciada_em: string
  concluida_em?: string
}

// Tentativa de microexercício (formativo — não alimenta mastery)
export interface TentativaUAI {
  uai_id: string
  secao: 1 | 2 | 3 | 4
  microex_id: string
  resposta: string
  correto: boolean
  dica_usada: boolean
  tempo_s: number
}
