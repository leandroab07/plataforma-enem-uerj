import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, XCircle, Trophy, RefreshCw } from 'lucide-react'
import clsx from 'clsx'
import Layout from '../components/Layout'
import MasteryBar from '../components/MasteryBar'
import { TOPICOS_MOCK, QUESTOES_MOCK } from '../lib/mock-data'
import { carregarEstado, salvarEstado, salvarTentativa, jaRespondida } from '../lib/store'
import { calcularMastery } from '../lib/mastery'
import type { EstadoTopico, Questao } from '../lib/types'

type Fase = 'respondendo' | 'resultado'
const LETRAS = ['A', 'B', 'C', 'D', 'E'] as const

function renderEnunciado(texto: string) {
  return texto.split('\n\n').map((par, i) => (
    <p key={i} className="mb-3 last:mb-0 leading-relaxed text-slate-800">
      {par.replace(/\*\*/g, '').replace(/\n/g, ' ')}
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
  const [acertosTotal, setAcertosTotal] = useState(0)

  useEffect(() => {
    const estados = carregarEstado()
    const e = estados.find((e) => e.topico_id === topicoId)
    if (e) setEstado(e)
  }, [topicoId])

  if (!topico) {
    return (
      <Layout>
        <div className="p-8 text-slate-500">Tópico não encontrado.</div>
      </Layout>
    )
  }

  if (questoes.length === 0) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto px-6 py-16 text-center">
          <p className="text-slate-500">Nenhuma questão disponível para este tópico.</p>
          <button onClick={() => navigate(`/topico/${topicoId}`)} className="mt-4 text-orange-600 text-sm hover:underline">
            Voltar ao tópico
          </button>
        </div>
      </Layout>
    )
  }

  if (encerrado) {
    const pct = Math.round((acertosTotal / questoes.length) * 100)
    return (
      <Layout>
        <div className="max-w-xl mx-auto px-6 py-16 text-center">
          <div className="w-20 h-20 gradient-brand rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-200">
            <Trophy size={36} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Sessão concluída!
          </h2>
          <p className="text-slate-500 text-sm mb-2">
            {topico.titulo} · {questoes.length} questão{questoes.length !== 1 ? 's' : ''}
          </p>
          <p className="text-3xl font-bold gradient-brand-text mb-6">{acertosTotal}/{questoes.length} ({pct}%)</p>

          {estado && (
            <div className="bg-white border border-slate-100 rounded-2xl p-5 mb-8 text-left shadow-sm">
              <p className="text-xs text-slate-500 mb-2 font-medium">Progresso no tópico</p>
              <MasteryBar score={estado.mastery_score} status={estado.status} showLabel />
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(`/topico/${topicoId}`)}
              className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Voltar ao tópico
            </button>
            <button
              onClick={() => {
                setIndice(0); setSelecionada(null)
                setFase('respondendo'); setEncerrado(false); setAcertosTotal(0)
              }}
              className="px-5 py-2.5 gradient-brand text-white text-sm font-semibold rounded-xl shadow-md shadow-orange-200 flex items-center gap-2"
            >
              <RefreshCw size={14} /> Praticar novamente
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  const questao = questoes[indice] as Questao & { _gabarito: string }
  const letras = LETRAS.filter((l) => l in questao.alternativas)
  const gabarito = questao._gabarito
  const acertou = selecionada === gabarito
  const jaVista = jaRespondida(questao.id)

  function confirmar() {
    if (!selecionada || fase === 'resultado') return
    setFase('resultado')

    const estados = carregarEstado()
    const idx = estados.findIndex((e) => e.topico_id === topicoId)
    if (idx !== -1) {
      const novoEstado = calcularMastery(estados[idx], questao.id, acertou, jaVista)
      estados[idx] = novoEstado
      salvarEstado(estados)
      setEstado(novoEstado)
    }
    salvarTentativa({ questao_id: questao.id, resposta_marcada: selecionada, acertou, confianca: null })
    if (acertou) setAcertosTotal((n) => n + 1)
  }

  function avancar() {
    if (indice + 1 >= questoes.length) setEncerrado(true)
    else { setIndice(indice + 1); setSelecionada(null); setFase('respondendo') }
  }

  const progresso = ((indice + (fase === 'resultado' ? 1 : 0)) / questoes.length) * 100

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Breadcrumb + progresso */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => navigate(`/topico/${topicoId}`)}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors shrink-0"
          >
            <ArrowLeft size={14} /> {topico.titulo}
          </button>
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full gradient-brand rounded-full transition-all duration-500"
              style={{ width: `${progresso}%` }}
            />
          </div>
          <span className="text-xs text-slate-400 shrink-0">{indice + 1}/{questoes.length}</span>
        </div>

        {/* Card da questão */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-4">
          {/* Meta */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-5">
            <span className="px-2 py-0.5 bg-slate-100 rounded-full font-medium text-slate-600">
              {questao.prova}
            </span>
            <span>{questao.ano}</span>
            <span>·</span>
            <span>Q. {questao.numero_original}</span>
            {jaVista && (
              <span className="px-2 py-0.5 bg-amber-100 rounded-full text-amber-600 font-medium">
                já respondida
              </span>
            )}
          </div>

          {/* Enunciado */}
          <div className="text-sm mb-6 prose-sm">{renderEnunciado(questao.enunciado)}</div>

          {/* Alternativas */}
          <div className="space-y-2.5">
            {letras.map((letra) => {
              const isSelected = selecionada === letra
              const isGabarito = letra === gabarito
              const showResult = fase === 'resultado'

              let cls = 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'
              let letraBtn = 'border-slate-200 text-slate-500'

              if (showResult) {
                if (isGabarito) {
                  cls = 'border-emerald-400 bg-emerald-50'
                  letraBtn = 'bg-emerald-500 border-emerald-500 text-white'
                } else if (isSelected) {
                  cls = 'border-red-300 bg-red-50'
                  letraBtn = 'bg-red-400 border-red-400 text-white'
                }
              } else if (isSelected) {
                cls = 'border-orange-400 bg-orange-50 shadow-sm shadow-orange-100'
                letraBtn = 'bg-orange-500 border-orange-500 text-white'
              }

              return (
                <button
                  key={letra}
                  onClick={() => fase === 'respondendo' && setSelecionada(letra)}
                  disabled={fase === 'resultado'}
                  className={clsx(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all',
                    cls,
                    fase === 'respondendo' && 'cursor-pointer',
                    fase === 'resultado' && 'cursor-default',
                  )}
                >
                  <span className={clsx('shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all', letraBtn)}>
                    {letra}
                  </span>
                  <span className="text-sm text-slate-800 flex-1">{questao.alternativas[letra]}</span>
                  {showResult && isGabarito && <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />}
                  {showResult && isSelected && !isGabarito && <XCircle size={16} className="shrink-0 text-red-400" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Ações */}
        {fase === 'resultado' ? (
          <div className="space-y-3">
            <div className={clsx(
              'px-5 py-3.5 rounded-xl text-sm font-semibold flex items-center gap-2',
              acertou
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-red-50 border border-red-200 text-red-800',
            )}>
              {acertou ? (
                <><CheckCircle2 size={16} /> Correto! Muito bem!</>
              ) : (
                <><XCircle size={16} /> Incorreto. A resposta correta é a alternativa {gabarito}.</>
              )}
            </div>
            <button
              onClick={avancar}
              className="w-full py-3 gradient-brand text-white text-sm font-semibold rounded-xl shadow-md shadow-orange-200 transition-shadow hover:shadow-orange-300"
            >
              {indice + 1 >= questoes.length ? 'Ver resultado final' : 'Próxima questão →'}
            </button>
          </div>
        ) : (
          <button
            onClick={confirmar}
            disabled={!selecionada}
            className="w-full py-3 gradient-brand text-white text-sm font-semibold rounded-xl shadow-md shadow-orange-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all"
          >
            Confirmar resposta
          </button>
        )}
      </div>
    </Layout>
  )
}
