import { useState, useRef, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence, type HTMLMotionProps } from 'framer-motion'
import {
  Sparkles, FlaskConical, BookOpen, Pencil, ClipboardList, Map,
  ArrowRight, CheckCircle2, XCircle, Lightbulb, ChevronRight,
  ArrowLeft,
} from 'lucide-react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import clsx from 'clsx'
import Layout from '../components/Layout'
import { UAI_MOCK } from '../lib/uai-data'
import type { UAI, SecaoTeoria, Microexercicio } from '../lib/uai-types'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type NumeroSecao = 1 | 2 | 3 | 4 | 5 | 6

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const SECOES: { label: string; Icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { label: 'Abertura',   Icon: Sparkles },
  { label: 'Intuição',   Icon: FlaskConical },
  { label: 'Teoria',     Icon: BookOpen },
  { label: 'Prática',    Icon: Pencil },
  { label: 'Aplicação',  Icon: ClipboardList },
  { label: 'Síntese',    Icon: Map },
]

type FadeProps = Pick<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'exit' | 'transition'>
const FADE: FadeProps = {
  initial:    { opacity: 0, y: 10 },
  animate:    { opacity: 1, y: 0 },
  exit:       { opacity: 0 },
  transition: { duration: 0.2, ease: 'easeOut' },
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function FormulaBlock({ latex }: { latex: string }) {
  const html = katex.renderToString(latex, { throwOnError: false, displayMode: true })
  return (
    <div
      className="my-4 py-4 px-4 bg-slate-950 border border-slate-700 rounded-xl text-center overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function SecaoTeoriaCard({ secao }: { secao: SecaoTeoria }) {
  if (secao.tipo === 'formula') {
    return <FormulaBlock latex={secao.conteudo ?? ''} />
  }
  if (secao.tipo === 'destaque') {
    return (
      <div className="px-4 py-3 bg-amber-50 border-l-4 border-amber-400 rounded-r-xl text-amber-900 text-sm leading-relaxed">
        {secao.conteudo}
      </div>
    )
  }
  if (secao.tipo === 'lista') {
    return (
      <ul className="space-y-1.5 pl-1">
        {(secao.itens ?? []).map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-slate-700 text-sm">
            <ChevronRight size={14} className="shrink-0 mt-0.5 text-blue-500" />
            {item}
          </li>
        ))}
      </ul>
    )
  }
  if (secao.tipo === 'exemplo') {
    return (
      <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-sm leading-relaxed whitespace-pre-line">
        <p className="font-semibold text-emerald-700 mb-1 text-xs uppercase tracking-wide">Exemplo</p>
        {secao.conteudo}
      </div>
    )
  }
  // tipo === 'texto'
  return <p className="text-slate-700 text-base leading-relaxed">{secao.conteudo}</p>
}

// ---------------------------------------------------------------------------
// Section nav
// ---------------------------------------------------------------------------

function SecaoNav({
  atual,
  completas,
  onClick,
}: {
  atual: NumeroSecao
  completas: Set<NumeroSecao>
  onClick: (n: NumeroSecao) => void
}) {
  return (
    <div className="flex items-center justify-center gap-0" aria-label="Navegação das seções">
      {SECOES.map((s, i) => {
        const n = (i + 1) as NumeroSecao
        const isCompleta = completas.has(n)
        const isAtual = n === atual
        const isAcessivel = n <= atual || isCompleta
        return (
          <div key={n} className="flex items-center">
            {/* Dot */}
            <button
              onClick={() => isAcessivel && onClick(n)}
              disabled={!isAcessivel}
              aria-label={`Seção ${n}: ${s.label}${isCompleta ? ' (concluída)' : isAtual ? ' (atual)' : ''}`}
              className={clsx(
                'flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all',
                isAtual && 'bg-blue-600 text-white ring-4 ring-blue-100',
                isCompleta && !isAtual && 'bg-blue-600 text-white cursor-pointer hover:ring-2 hover:ring-blue-200',
                !isAtual && !isCompleta && 'bg-slate-200 text-slate-400 cursor-default',
              )}
            >
              {isCompleta && !isAtual ? <CheckCircle2 size={14} /> : n}
            </button>
            {/* Connector */}
            {i < SECOES.length - 1 && (
              <div className={clsx('w-8 h-0.5', isCompleta ? 'bg-blue-400' : 'bg-slate-200')} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Microexercício (Section 4)
// ---------------------------------------------------------------------------

interface MicroState {
  idx: number
  respostaSelecionada: string | null
  tentouErrado: boolean
  dicaVisivel: boolean
  concluido: boolean
  acertos: number
}

function SecaoMicro({
  exercicios,
  onConcluido,
}: {
  exercicios: Microexercicio[]
  onConcluido: (acertos: number) => void
}) {
  const [state, setState] = useState<MicroState>({
    idx: 0,
    respostaSelecionada: null,
    tentouErrado: false,
    dicaVisivel: false,
    concluido: false,
    acertos: 0,
  })
  const inicioRef = useRef(Date.now())

  const ex = exercicios[state.idx]
  const respondido = state.respostaSelecionada !== null
  const acertou = respondido && state.respostaSelecionada === ex.resposta_correta

  function selecionar(opcaoId: string) {
    if (respondido) return
    const correto = opcaoId === ex.resposta_correta
    if (!correto && !state.tentouErrado) {
      // Primeira tentativa errada → mostrar dica
      setState(s => ({ ...s, tentouErrado: true, dicaVisivel: true }))
      return
    }
    // Segunda tentativa ou acerto
    setState(s => ({
      ...s,
      respostaSelecionada: opcaoId,
      acertos: s.acertos + (correto ? 1 : 0),
    }))
  }

  function avancar() {
    inicioRef.current = Date.now()
    if (state.idx + 1 >= exercicios.length) {
      setState(s => ({ ...s, concluido: true }))
      onConcluido(state.acertos + (acertou ? 1 : 0))
      return
    }
    setState(s => ({
      ...s,
      idx: s.idx + 1,
      respostaSelecionada: null,
      tentouErrado: false,
      dicaVisivel: false,
    }))
  }

  if (state.concluido) {
    const total = exercicios.length
    const acc = state.acertos
    const pct = Math.round((acc / total) * 100)
    return (
      <motion.div {...FADE} className="text-center space-y-4 py-6">
        <div className="text-4xl">{pct >= 80 ? '🎯' : pct >= 60 ? '👍' : '📚'}</div>
        <p className="text-xl font-bold text-slate-900">{acc}/{total} corretos</p>
        <p className="text-slate-500 text-sm">
          {pct >= 80
            ? 'Ótimo domínio! Siga para as questões reais.'
            : pct >= 60
            ? 'Bom. Revise a teoria onde errou antes de continuar.'
            : 'Volte à teoria e tente novamente antes de continuar.'}
        </p>
      </motion.div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div key={state.idx} {...FADE} className="space-y-4">
        {/* Progresso */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Exercício {state.idx + 1} de {exercicios.length}</span>
          <span>{state.acertos} correto{state.acertos !== 1 ? 's' : ''} até agora</span>
        </div>
        <div className="h-1 bg-slate-100 rounded-full">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${(state.idx / exercicios.length) * 100}%` }}
          />
        </div>

        {/* Enunciado */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <p className="text-slate-800 text-base leading-relaxed font-medium">{ex.enunciado}</p>
        </div>

        {/* Dica (aparece após 1º erro) */}
        {state.dicaVisivel && !respondido && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm"
          >
            <Lightbulb size={16} className="shrink-0 mt-0.5 text-amber-600" />
            <span><span className="font-semibold">Dica: </span>{ex.dica}</span>
          </motion.div>
        )}

        {/* Opções */}
        <div className="space-y-2">
          {ex.opcoes.map(op => {
            const isCorreta = op.id === ex.resposta_correta
            const isSelecionada = state.respostaSelecionada === op.id
            const mostrarCorreta = respondido && isCorreta
            const mostrarErro = respondido && isSelecionada && !isCorreta
            const tentouEssa = state.tentouErrado && !respondido && op.id !== ex.resposta_correta
            return (
              <button
                key={op.id}
                onClick={() => selecionar(op.id)}
                disabled={respondido || tentouEssa}
                aria-pressed={isSelecionada}
                className={clsx(
                  'w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all',
                  !respondido && !tentouEssa && 'border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 cursor-pointer',
                  tentouEssa && 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed',
                  mostrarCorreta && 'border-emerald-500 bg-emerald-50 text-emerald-800',
                  mostrarErro && 'border-red-400 bg-red-50 text-red-800',
                  respondido && !isSelecionada && !isCorreta && 'border-slate-100 text-slate-400',
                )}
              >
                <span className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold shrink-0">
                    {op.id.toUpperCase()}
                  </span>
                  {op.texto}
                  {mostrarCorreta && <CheckCircle2 size={16} className="ml-auto text-emerald-600" />}
                  {mostrarErro && <XCircle size={16} className="ml-auto text-red-500" />}
                </span>
              </button>
            )
          })}
        </div>

        {/* Feedback após resposta */}
        {respondido && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={clsx(
              'px-4 py-3 rounded-xl border text-sm leading-relaxed',
              acertou
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800',
            )}
          >
            <div className="flex items-start gap-2">
              {acertou
                ? <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600" />
                : <XCircle size={16} className="shrink-0 mt-0.5 text-red-500" />}
              <div>
                <p className="font-semibold mb-0.5">{acertou ? 'Correto!' : 'Resposta incorreta'}</p>
                <p>{ex.explicacao}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Botão avançar */}
        {respondido && (
          <button
            onClick={avancar}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {state.idx + 1 >= exercicios.length ? 'Ver resultado' : 'Próximo exercício'}
            <ArrowRight size={16} />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function UAIPage() {
  const { uaiId } = useParams<{ uaiId: string }>()
  const navigate = useNavigate()

  const uai: UAI | undefined = UAI_MOCK[uaiId ?? '']

  const [secaoAtual, setSecaoAtual] = useState<NumeroSecao>(1)
  const [completas, setCompletas] = useState<Set<NumeroSecao>>(new Set())
  const [microAcertos, setMicroAcertos] = useState<number | null>(null)

  const concluirSecao = useCallback((n: NumeroSecao) => {
    setCompletas(prev => {
      const next = new Set(prev)
      next.add(n)
      return next
    })
    setSecaoAtual(s => (s < 6 ? ((s + 1) as NumeroSecao) : s))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const irPara = useCallback((n: NumeroSecao) => {
    setSecaoAtual(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  if (!uai) {
    return (
      <Layout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center space-y-3">
            <p className="text-slate-500">Unidade de aprendizagem não encontrada.</p>
            <Link to="/dashboard" className="text-blue-600 hover:underline text-sm">
              Voltar ao painel
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  const { conteudo } = uai

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

          {/* Back + title */}
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors"
            >
              <ArrowLeft size={14} /> Voltar
            </button>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                Unidade de Aprendizagem
              </p>
              <h1 className="text-2xl font-bold text-slate-900">{uai.titulo}</h1>
            </div>
          </div>

          {/* Section nav */}
          <SecaoNav atual={secaoAtual} completas={completas} onClick={irPara} />

          {/* Section label */}
          <div className="flex items-center gap-2">
            {(() => {
              const { Icon, label } = SECOES[secaoAtual - 1]
              return (
                <>
                  <Icon size={18} className="text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-800">
                    {secaoAtual}. {label}
                  </h2>
                </>
              )
            })()}
          </div>

          {/* Section content */}
          <AnimatePresence mode="wait">
            <motion.div key={secaoAtual} {...FADE}>

              {/* ───────── Seção 1: Abertura ───────── */}
              {secaoAtual === 1 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto">
                    <Sparkles size={28} className="text-blue-600" />
                  </div>
                  <p className="text-xl font-semibold text-slate-800 leading-relaxed text-center">
                    {conteudo.pergunta_ancora}
                  </p>
                  <p className="text-slate-400 text-sm text-center">
                    Reflita por um momento. Você vai descobrir a resposta ao longo desta unidade.
                  </p>
                  <button
                    onClick={() => concluirSecao(1)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    Estou pronto para começar <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* ───────── Seção 2: Intuição ───────── */}
              {secaoAtual === 2 && (
                <div className="space-y-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <p className="text-slate-700 text-sm leading-relaxed">{conteudo.secao2_instrucao}</p>
                  </div>

                  {/* Simulation area */}
                  <div
                    className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-4 text-center p-10"
                    style={{ minHeight: 320 }}
                    aria-label="Área de simulação (em desenvolvimento)"
                  >
                    <FlaskConical size={48} className="text-slate-300" />
                    <div>
                      <p className="text-slate-500 font-medium">Simulação interativa</p>
                      <p className="text-slate-400 text-sm mt-1">Disponível na Fase L3</p>
                    </div>
                    <div className="px-4 py-2 bg-teal-50 border border-teal-200 rounded-lg text-teal-700 text-xs max-w-xs">
                      Aqui você poderá arrastar béqueres, transferir soluções e observar a concentração mudar em tempo real.
                    </div>
                  </div>

                  <button
                    onClick={() => concluirSecao(2)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    Já refleti, continuar <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* ───────── Seção 3: Teoria ───────── */}
              {secaoAtual === 3 && (
                <div className="space-y-5">
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                    <h3 className="text-lg font-semibold text-slate-800">{conteudo.secao3_titulo}</h3>
                    {conteudo.secao3_teoria.map((s, i) => (
                      <SecaoTeoriaCard key={i} secao={s} />
                    ))}
                  </div>
                  <button
                    onClick={() => concluirSecao(3)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    Entendido, ir para a prática <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* ───────── Seção 4: Prática guiada ───────── */}
              {secaoAtual === 4 && (
                <div className="space-y-4">
                  <SecaoMicro
                    exercicios={conteudo.secao4_microexercicios}
                    onConcluido={(acc) => {
                      setMicroAcertos(acc)
                    }}
                  />
                  {microAcertos !== null && (
                    <button
                      onClick={() => concluirSecao(4)}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      Ir para as questões reais <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              )}

              {/* ───────── Seção 5: Aplicação ───────── */}
              {secaoAtual === 5 && (
                <div className="space-y-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <p className="text-slate-700 text-sm leading-relaxed">
                      Agora você vai responder questões reais do banco ENEM/UERJ sobre este tópico.
                      Suas respostas <span className="font-semibold">contam para o seu progresso</span> — este é o único momento da UAI que afeta seu mastery oficial.
                    </p>
                    {conteudo.secao5_questoes_ids.length === 0 ? (
                      <div
                        className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-3 py-10 text-center"
                        aria-label="Questões em desenvolvimento"
                      >
                        <ClipboardList size={36} className="text-slate-300" />
                        <div>
                          <p className="text-slate-500 font-medium">Questões reais do banco</p>
                          <p className="text-slate-400 text-sm mt-1">
                            Vinculadas na Fase L3 ao submeter mapeamento de questões para este tópico.
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <button
                    onClick={() => concluirSecao(5)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    Concluir e ver síntese <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* ───────── Seção 6: Síntese ───────── */}
              {secaoAtual === 6 && (
                <div className="space-y-4">
                  {/* Summary card */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
                    <div className="flex items-center gap-2 text-blue-700 font-semibold">
                      <Map size={18} />
                      Resumo do que você aprendeu
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed">{conteudo.secao6_resumo}</p>
                  </div>

                  {/* Connections */}
                  {conteudo.secao6_conexoes.length > 0 && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
                      <p className="font-semibold text-slate-800 text-sm">O que você desbloqueou</p>
                      <div className="space-y-2">
                        {conteudo.secao6_conexoes
                          .filter(c => c.tipo === 'desbloqueia')
                          .map(c => (
                            <div
                              key={c.uai_id}
                              className="flex items-center gap-3 px-3 py-2.5 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-sm"
                            >
                              <ChevronRight size={14} className="text-teal-500" />
                              <span className="font-medium">{c.titulo}</span>
                              <span className="ml-auto text-xs text-teal-500">próxima UAI</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Completion state */}
                  {completas.size >= 5 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white text-center space-y-3"
                    >
                      <CheckCircle2 size={36} className="mx-auto" />
                      <p className="text-xl font-bold">Unidade concluída!</p>
                      <p className="text-blue-100 text-sm">
                        Você completou todas as seções de <span className="font-semibold">{uai.titulo}</span>.
                        Continue praticando com questões adicionais para consolidar o domínio.
                      </p>
                    </motion.div>
                  )}

                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    Voltar ao painel
                  </button>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Section label footer */}
          <p className="text-center text-xs text-slate-400">
            Seção {secaoAtual} de 6 — {SECOES[secaoAtual - 1].label}
          </p>

        </div>
      </div>
    </Layout>
  )
}
