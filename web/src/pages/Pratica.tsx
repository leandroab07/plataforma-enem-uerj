import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react'
import clsx from 'clsx'
import Layout from '../components/Layout'
import MasteryBar from '../components/MasteryBar'
import { TOPICOS_MOCK, QUESTOES_MOCK } from '../lib/mock-data'
import { carregarEstado, salvarEstado, salvarTentativa, jaRespondida } from '../lib/store'
import { calcularMastery } from '../lib/mastery'
import type { EstadoTopico, Questao } from '../lib/types'

type Fase = 'respondendo' | 'resultado'

const LETRAS = ['A', 'B', 'C', 'D', 'E'] as const

function renderizarEnunciado(texto: string) {
  // Quebra em parágrafos
  return texto.split('\n\n').map((par, i) => (
    <p key={i} className="mb-3 last:mb-0 leading-relaxed">
      {par.replace(/\n/g, ' ')}
    </p>
  ))
}

export default function Pratica() {
  const { topicoId } = useParams<{ topicoId: string }>()
  const navigate = useNavigate()

  const topico = TOPICOS_MOCK.find((t) => t.id === topicoId)
  const questoes = QUESTOES_MOCK.filter((q) => q.topico_id === topicoId)

  const [indice, setIndice] = useState(0)
  const [selecionada, setSelecionada] = useState<string | null>(null)
  const [fase, setFase] = useState<Fase>('respondendo')
  const [estado, setEstado] = useState<EstadoTopico | null>(null)
  const [encerrado, setEncerrado] = useState(false)

  useEffect(() => {
    const estados = carregarEstado()
    const e = estados.find((e) => e.topico_id === topicoId)
    if (e) setEstado(e)
  }, [topicoId])

  if (!topico) {
    return (
      <Layout>
        <div className="p-8 text-slate-600">Tópico não encontrado.</div>
      </Layout>
    )
  }

  if (questoes.length === 0) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-6 py-12 text-center">
          <p className="text-slate-500">Nenhuma questão disponível para este tópico no modo demonstração.</p>
          <button onClick={() => navigate('/dashboard')} className="mt-4 text-blue-600 text-sm hover:underline">
            Voltar ao painel
          </button>
        </div>
      </Layout>
    )
  }

  if (encerrado) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto px-6 py-16 text-center">
          <CheckCircle2 className="mx-auto text-emerald-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Sessão concluída!</h2>
          <p className="text-slate-500 text-sm mb-6">
            Você respondeu {questoes.length} questão{questoes.length !== 1 ? 's' : ''} de {topico.titulo}.
          </p>
          {estado && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 text-left">
              <p className="text-xs text-slate-500 mb-2">Progresso no tópico</p>
              <MasteryBar score={estado.mastery_score} status={estado.status} showLabel />
            </div>
          )}
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Voltar ao painel
            </button>
            <button
              onClick={() => {
                setIndice(0)
                setSelecionada(null)
                setFase('respondendo')
                setEncerrado(false)
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
            >
              Praticar novamente
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  const questao = questoes[indice] as Questao & { _gabarito: string }
  const letrasDisponiveis = LETRAS.filter((l) => l in questao.alternativas)
  const gabarito = questao._gabarito
  const acertou = selecionada === gabarito
  const jaVista = jaRespondida(questao.id)

  function confirmar() {
    if (!selecionada || fase === 'resultado') return
    setFase('resultado')

    // Atualizar estado de mastery
    const estados = carregarEstado()
    const idx = estados.findIndex((e) => e.topico_id === topicoId)
    if (idx === -1) return

    const novoEstado = calcularMastery(estados[idx], questao.id, selecionada === gabarito, jaVista)
    estados[idx] = novoEstado
    salvarEstado(estados)
    setEstado(novoEstado)

    salvarTentativa({
      questao_id: questao.id,
      resposta_marcada: selecionada,
      acertou: selecionada === gabarito,
      confianca: null,
    })
  }

  function avancar() {
    if (indice + 1 >= questoes.length) {
      setEncerrado(true)
    } else {
      setIndice(indice + 1)
      setSelecionada(null)
      setFase('respondendo')
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors"
        >
          <ArrowLeft size={14} />
          Voltar
        </button>

        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-slate-900">{topico.titulo}</h1>
            <span className="text-xs text-slate-400">
              {indice + 1} / {questoes.length}
            </span>
          </div>
          {estado && (
            <div className="mt-2">
              <MasteryBar score={estado.mastery_score} status={estado.status} />
            </div>
          )}
        </div>

        {/* Questão */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-4">
          {/* Meta */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <span>{questao.prova}</span>
            <span>·</span>
            <span>{questao.ano}</span>
            <span>·</span>
            <span>Q. {questao.numero_original}</span>
            {jaVista && (
              <>
                <span>·</span>
                <span className="text-amber-500">já respondida</span>
              </>
            )}
          </div>

          {/* Enunciado */}
          <div className="text-slate-800 text-sm mb-5">{renderizarEnunciado(questao.enunciado)}</div>

          {/* Alternativas */}
          <div className="space-y-2">
            {letrasDisponiveis.map((letra) => {
              const texto = questao.alternativas[letra]
              const isSelected = selecionada === letra
              const isGabarito = letra === gabarito
              const mostrarResultado = fase === 'resultado'

              let estilo = 'border-slate-200 bg-slate-50 hover:border-slate-400 hover:bg-slate-100'
              if (mostrarResultado) {
                if (isGabarito) {
                  estilo = 'border-emerald-500 bg-emerald-50'
                } else if (isSelected && !isGabarito) {
                  estilo = 'border-red-400 bg-red-50'
                }
              } else if (isSelected) {
                estilo = 'border-blue-500 bg-blue-50'
              }

              return (
                <button
                  key={letra}
                  onClick={() => fase === 'respondendo' && setSelecionada(letra)}
                  disabled={fase === 'resultado'}
                  className={clsx(
                    'w-full flex items-start gap-3 px-4 py-3 rounded-lg border text-left transition-all',
                    estilo,
                    fase === 'respondendo' && 'cursor-pointer',
                    fase === 'resultado' && 'cursor-default',
                  )}
                >
                  <span
                    className={clsx(
                      'shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border',
                      mostrarResultado && isGabarito
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : mostrarResultado && isSelected && !isGabarito
                        ? 'bg-red-400 border-red-400 text-white'
                        : isSelected
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-300 text-slate-500',
                    )}
                  >
                    {letra}
                  </span>
                  <span className="text-sm text-slate-800 pt-0.5 flex-1">{texto}</span>
                  {mostrarResultado && isGabarito && (
                    <CheckCircle2 className="shrink-0 text-emerald-500 mt-0.5" size={16} />
                  )}
                  {mostrarResultado && isSelected && !isGabarito && (
                    <XCircle className="shrink-0 text-red-400 mt-0.5" size={16} />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Feedback e botões */}
        {fase === 'resultado' ? (
          <div className="flex flex-col gap-3">
            <div
              className={clsx(
                'px-4 py-3 rounded-lg text-sm font-medium',
                acertou
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border border-red-200 text-red-800',
              )}
            >
              {acertou ? 'Correto!' : `Incorreto. A resposta correta é ${gabarito}.`}
            </div>
            <button
              onClick={avancar}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {indice + 1 >= questoes.length ? 'Encerrar sessão' : 'Próxima questão'}
            </button>
          </div>
        ) : (
          <button
            onClick={confirmar}
            disabled={!selecionada}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
          >
            Confirmar resposta
          </button>
        )}
      </div>
    </Layout>
  )
}
