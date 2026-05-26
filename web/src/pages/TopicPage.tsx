import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, BarChart3, BookOpen, Gamepad2, Target,
  Zap, CheckCircle2, XCircle, RefreshCw, ChevronRight, Lightbulb, List,
} from 'lucide-react'
import clsx from 'clsx'
import Layout from '../components/Layout'
import GraphExplorer from '../components/GraphExplorer'
import MapaLinker from '../components/MapaLinker'
import MapaFill from '../components/MapaFill'
import VerdadeiroFalso from '../components/VerdadeiroFalso'
import QuizRelampago from '../components/QuizRelampago'
import { TOPICOS_MOCK, QUESTOES_MOCK } from '../lib/mock-data'
import { TEORIA } from '../lib/teoria-content'
import { MAPAS } from '../lib/mapa-data'
import { GAMES } from '../lib/game-data'
import { GRAPHS } from '../lib/graph-data'
import { carregarEstado, salvarEstado, salvarTentativa, jaRespondida } from '../lib/store'
import { calcularMastery, statusLabel } from '../lib/mastery'
import type { SecaoTeoria } from '../lib/teoria-content'
import type { EstadoTopico } from '../lib/types'

// ─── Inline teoria section renderer ─────────────────────────────────────────

function SecaoCard({ secao }: { secao: SecaoTeoria }) {
  if (secao.tipo === 'formula') {
    return (
      <div className="bg-slate-900 border border-orange-500/30 rounded-2xl p-5">
        {secao.titulo && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-orange-400 font-mono text-xs font-bold">f(x)</span>
            <h3 className="font-semibold text-orange-300 text-sm">{secao.titulo}</h3>
          </div>
        )}
        <pre className="text-emerald-300 font-mono text-sm leading-relaxed whitespace-pre-wrap overflow-x-auto bg-slate-950/80 rounded-xl p-4">
          {typeof secao.conteudo === 'string' ? secao.conteudo : (secao.conteudo as string[]).join('\n')}
        </pre>
      </div>
    )
  }

  if (secao.tipo === 'destaque') {
    return (
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-5">
        {secao.titulo && (
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={15} className="text-amber-400" />
            <h3 className="font-semibold text-amber-300 text-sm">{secao.titulo}</h3>
          </div>
        )}
        <p className="text-slate-200 text-sm leading-relaxed">
          {typeof secao.conteudo === 'string' ? secao.conteudo : (secao.conteudo as string[]).join(' ')}
        </p>
      </div>
    )
  }

  if (secao.tipo === 'lista') {
    const items = Array.isArray(secao.conteudo) ? secao.conteudo : [secao.conteudo]
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5">
        {secao.titulo && (
          <div className="flex items-center gap-2 mb-3">
            <List size={15} className="text-sky-400" />
            <h3 className="font-semibold text-sky-300 text-sm">{secao.titulo}</h3>
          </div>
        )}
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="text-orange-400 mt-0.5 shrink-0">→</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (secao.tipo === 'exemplo') {
    return (
      <div className="bg-emerald-950/40 border border-emerald-700/40 rounded-2xl p-5">
        {secao.titulo && (
          <div className="flex items-center gap-2 mb-2">
            <ChevronRight size={15} className="text-emerald-400" />
            <h3 className="font-semibold text-emerald-300 text-sm">{secao.titulo}</h3>
          </div>
        )}
        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
          {typeof secao.conteudo === 'string' ? secao.conteudo : (secao.conteudo as string[]).join('\n')}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5">
      {secao.titulo && (
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={15} className="text-violet-400" />
          <h3 className="font-semibold text-violet-300 text-sm">{secao.titulo}</h3>
        </div>
      )}
      <p className="text-slate-300 text-sm leading-relaxed">
        {typeof secao.conteudo === 'string' ? secao.conteudo : (secao.conteudo as string[]).join(' ')}
      </p>
    </div>
  )
}

// ─── Inline practice (mini Pratica scoped to this topic) ────────────────────

const LETRAS = ['A', 'B', 'C', 'D', 'E'] as const

function PraticaInline({ topicoId, onEstadoAtualizado }: { topicoId: string; onEstadoAtualizado: () => void }) {
  const questoes = QUESTOES_MOCK.filter((q) => q.topico_id === topicoId)

  const [indice, setIndice] = useState(0)
  const [selecionada, setSelecionada] = useState<string | null>(null)
  const [acertos, setAcertos] = useState(0)
  const [encerrado, setEncerrado] = useState(false)

  function reiniciar() {
    setIndice(0); setSelecionada(null); setAcertos(0); setEncerrado(false)
  }

  if (questoes.length === 0) {
    return (
      <div className="text-center py-12 space-y-3">
        <div className="text-4xl">🚧</div>
        <p className="text-slate-400 text-sm">Questões para este tópico chegam em breve!</p>
        <Link to="/pratica" className="inline-block text-xs text-orange-400 hover:text-orange-300">
          Ver outros tópicos →
        </Link>
      </div>
    )
  }

  if (encerrado) {
    const pct = Math.round((acertos / questoes.length) * 100)
    return (
      <div className="text-center py-8 space-y-4">
        <div className="text-5xl">{pct >= 80 ? '🏆' : pct >= 60 ? '🥈' : '📚'}</div>
        <h3 className="text-xl font-bold text-white">{acertos}/{questoes.length} corretos ({pct}%)</h3>
        <p className="text-slate-400 text-sm">
          {pct === 100
            ? 'Perfeito! Domínio total!'
            : pct >= 80
            ? 'Ótimo! Continue assim.'
            : pct >= 60
            ? 'Bom progresso. Revise os erros.'
            : 'Estude a teoria e tente novamente.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reiniciar}
            className="flex items-center gap-2 px-5 py-2.5 gradient-brand text-white font-semibold rounded-xl shadow-md text-sm"
          >
            <RefreshCw size={14} /> Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  const q = questoes[indice]
  const gabarito = q._gabarito
  const letras = LETRAS.filter((l) => l in q.alternativas)
  const respondida = selecionada !== null
  const acertou = selecionada === gabarito

  function responder(letra: string) {
    if (respondida) return
    setSelecionada(letra)
    const acertouAgora = letra === gabarito
    if (acertouAgora) setAcertos((a) => a + 1)

    const estados = carregarEstado()
    const idx = estados.findIndex((e) => e.topico_id === topicoId)
    if (idx >= 0) {
      const novoEstado = calcularMastery(estados[idx], q.id, acertouAgora, jaRespondida(q.id))
      const novos = [...estados]
      novos[idx] = novoEstado
      salvarEstado(novos)
    }
    salvarTentativa({ questao_id: q.id, resposta_marcada: letra, acertou: acertouAgora, confianca: null })
    onEstadoAtualizado()
  }

  function avancar() {
    if (indice + 1 >= questoes.length) {
      setEncerrado(true)
    } else {
      setSelecionada(null)
      setIndice((i) => i + 1)
    }
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Questão {indice + 1} de {questoes.length}</span>
        <span className="text-emerald-400 font-semibold">{acertos} acerto{acertos !== 1 ? 's' : ''}</span>
      </div>
      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full gradient-brand rounded-full transition-all duration-500"
          style={{ width: `${((indice) / questoes.length) * 100}%` }}
        />
      </div>

      {/* Meta badges */}
      <div className="flex gap-2 flex-wrap">
        <span className="text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded-full px-3 py-0.5">
          {q.prova} {q.ano}
        </span>
        {jaRespondida(q.id) && (
          <span className="text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded-full px-3 py-0.5">
            já respondida
          </span>
        )}
      </div>

      {/* Enunciado */}
      <div className="bg-white/95 rounded-2xl p-5 shadow-sm border border-slate-200">
        {q.enunciado.split('\n\n').map((par, i) => (
          <p key={i} className="mb-3 last:mb-0 leading-relaxed text-slate-800 text-sm">
            {par.replace(/\n/g, ' ')}
          </p>
        ))}
      </div>

      {/* Alternativas */}
      <div className="space-y-2">
        {letras.map((l) => {
          const isSelected = selecionada === l
          const isGab = l === gabarito
          let cls = 'border-slate-700 bg-slate-800/50 text-slate-200 hover:border-orange-500/50'
          let letraClass = 'bg-slate-700 text-slate-400'

          if (respondida) {
            if (isGab) { cls = 'border-emerald-500 bg-emerald-900/40 text-emerald-100'; letraClass = 'bg-emerald-600 text-white' }
            else if (isSelected) { cls = 'border-red-500 bg-red-900/40 text-red-100'; letraClass = 'bg-red-600 text-white' }
          } else if (isSelected) {
            cls = 'border-orange-500 bg-orange-900/40 text-orange-100'; letraClass = 'bg-orange-500 text-white'
          }

          return (
            <button
              key={l}
              onClick={() => responder(l)}
              disabled={respondida}
              className={clsx('w-full flex items-start gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all text-sm', cls)}
            >
              <span className={clsx('shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold mt-0.5', letraClass)}>
                {l}
              </span>
              <span className="leading-relaxed">{q.alternativas[l]}</span>
              {respondida && isGab && <CheckCircle2 size={16} className="ml-auto shrink-0 text-emerald-400 mt-0.5" />}
              {respondida && isSelected && !isGab && <XCircle size={16} className="ml-auto shrink-0 text-red-400 mt-0.5" />}
            </button>
          )
        })}
      </div>

      {/* After answer */}
      {respondida && (
        <div className="space-y-3">
          <div className={clsx(
            'px-4 py-3 rounded-xl text-sm border flex items-start gap-2',
            acertou ? 'bg-emerald-900/40 text-emerald-300 border-emerald-700' : 'bg-red-900/40 text-red-300 border-red-700',
          )}>
            {acertou ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> : <XCircle size={16} className="shrink-0 mt-0.5" />}
            <span>
              <span className="font-semibold">{acertou ? 'Correto! ' : `Incorreto. Gabarito: ${gabarito}. `}</span>
              Confira o raciocínio comparando com a alternativa correta.
            </span>
          </div>
          <button
            onClick={avancar}
            className="w-full py-3 gradient-brand text-white font-semibold rounded-xl shadow-md text-sm"
          >
            {indice + 1 >= questoes.length ? 'Ver resultado' : 'Próxima →'}
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Activity sub-section header ────────────────────────────────────────────

function AtividadeHeader({ icon, titulo, subtitulo, cor }: {
  icon: React.ReactNode; titulo: string; subtitulo: string; cor: string
}) {
  return (
    <div className={clsx('rounded-2xl p-4 border mb-4 flex items-center gap-3', cor)}>
      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="font-bold text-white text-sm">{titulo}</p>
        <p className="text-xs text-white/70">{subtitulo}</p>
      </div>
    </div>
  )
}

// ─── Tab definition ──────────────────────────────────────────────────────────

type TabId = 'explorar' | 'teoria' | 'atividades' | 'praticar'

interface Tab {
  id: TabId
  label: string
  icon: React.ReactNode
  activeClass: string
  available: boolean
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function TopicPage() {
  const { topicoId } = useParams<{ topicoId: string }>()

  const topico = TOPICOS_MOCK.find((t) => t.id === topicoId)
  const teoria = topicoId ? TEORIA[topicoId] : undefined
  const mapa = topicoId ? MAPAS[topicoId] : undefined
  const game = topicoId ? GAMES[topicoId] : undefined
  const graph = topicoId ? GRAPHS[topicoId] : undefined
  const questoesTopico = QUESTOES_MOCK.filter((q) => q.topico_id === topicoId)

  const [estado, setEstado] = useState<EstadoTopico | null>(null)
  const [mapaFeito, setMapaFeito] = useState(false)
  const [vfAcertos, setVfAcertos] = useState<{ acertos: number; total: number } | null>(null)
  const [quizAcertos, setQuizAcertos] = useState<{ acertos: number; total: number } | null>(null)

  function recarregarEstado() {
    if (!topicoId) return
    const estados = carregarEstado()
    const e = estados.find((e) => e.topico_id === topicoId)
    setEstado(e ?? null)
  }

  useEffect(() => { recarregarEstado() }, [topicoId])

  const tabs: Tab[] = [
    {
      id: 'explorar',
      label: 'Explorar',
      icon: <BarChart3 size={14} />,
      activeClass: 'bg-orange-500 text-white shadow-lg shadow-orange-900/40',
      available: !!graph,
    },
    {
      id: 'teoria',
      label: 'Teoria',
      icon: <BookOpen size={14} />,
      activeClass: 'bg-violet-600 text-white shadow-lg shadow-violet-900/40',
      available: !!teoria,
    },
    {
      id: 'atividades',
      label: 'Atividades',
      icon: <Gamepad2 size={14} />,
      activeClass: 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40',
      available: !!(mapa || game),
    },
    {
      id: 'praticar',
      label: 'Praticar',
      icon: <Target size={14} />,
      activeClass: 'bg-sky-600 text-white shadow-lg shadow-sky-900/40',
      available: true,
    },
  ]

  const firstAvailable = tabs.find((t) => t.available)?.id ?? 'praticar'
  const [activeTab, setActiveTab] = useState<TabId>(firstAvailable)

  if (!topico) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Tópico não encontrado.</p>
        </div>
      </Layout>
    )
  }

  const mastery = estado?.mastery_score ?? 0
  const label = statusLabel(estado?.status ?? 'nao_iniciado')

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-5 pb-10">

        {/* ── Header card ── */}
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 gradient-brand opacity-90" />
          <div className="relative px-6 pt-5 pb-6 space-y-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-medium transition-colors"
            >
              <ArrowLeft size={13} /> Painel
            </Link>

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-widest mb-0.5">{topico.disciplina}</p>
                <h1 className="text-2xl font-bold text-white leading-tight font-display">{topico.titulo}</h1>
                <p className="text-white/70 text-sm mt-1">{topico.descricao}</p>
              </div>
              <div className="shrink-0 text-right">
                <span className={clsx('text-xs font-bold px-3 py-1 rounded-full bg-white/20 text-white')}>
                  {label}
                </span>
                <p className="text-white/60 text-xs mt-2">{Math.round(mastery * 100)}% domínio</p>
              </div>
            </div>

            {/* Mastery bar */}
            <div className="space-y-1">
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-700"
                  style={{ width: `${mastery * 100}%` }}
                />
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex gap-4 pt-1">
              <div className="text-center">
                <p className="text-white text-sm font-bold">{estado?.total_tentativas ?? 0}</p>
                <p className="text-white/60 text-xs">tentativas</p>
              </div>
              <div className="text-center">
                <p className="text-white text-sm font-bold">{estado?.questoes_unicas_acertadas ?? 0}</p>
                <p className="text-white/60 text-xs">acertos únicos</p>
              </div>
              <div className="text-center">
                <p className="text-white text-sm font-bold">{questoesTopico.length}</p>
                <p className="text-white/60 text-xs">questões</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tab pills ── */}
        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
          {tabs.filter((t) => t.available).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all',
                activeTab === tab.id
                  ? tab.activeClass
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700',
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}

        {/* EXPLORAR */}
        {activeTab === 'explorar' && graph && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <BarChart3 size={16} className="text-orange-400" />
              <h2 className="text-sm font-bold text-white">{graph.titulo}</h2>
            </div>
            <GraphExplorer config={graph} />
          </div>
        )}

        {/* TEORIA */}
        {activeTab === 'teoria' && teoria && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <BookOpen size={16} className="text-violet-400" />
              <h2 className="text-sm font-bold text-white">Fundamentos teóricos</h2>
            </div>
            {teoria.secoes.map((s, i) => (
              <SecaoCard key={i} secao={s} />
            ))}

            {/* CTA to next tab */}
            <div className="pt-2">
              {(mapa || game) && (
                <button
                  onClick={() => setActiveTab('atividades')}
                  className="w-full py-3 border-2 border-emerald-600/50 text-emerald-300 font-semibold rounded-xl hover:border-emerald-500 hover:text-emerald-200 transition-all text-sm"
                >
                  Praticar atividades →
                </button>
              )}
            </div>
          </div>
        )}

        {/* ATIVIDADES */}
        {activeTab === 'atividades' && (
          <div className="space-y-6">

            {/* Mapa conceitual */}
            {mapa && (
              <div>
                <AtividadeHeader
                  icon={<Target size={18} className="text-white" />}
                  titulo="Mapa Conceitual"
                  subtitulo={mapa.tipo === 'linker' ? 'Conecte os conceitos com suas definições' : 'Complete o mapa escolhendo os termos corretos'}
                  cor="bg-gradient-to-r from-violet-600/30 to-violet-900/30 border border-violet-500/30"
                />
                {mapaFeito ? (
                  <div className="text-center py-6 space-y-2">
                    <div className="text-4xl">🗺️</div>
                    <p className="text-emerald-300 font-semibold text-sm">Mapa concluído!</p>
                    <button
                      onClick={() => setMapaFeito(false)}
                      className="text-xs text-slate-400 hover:text-slate-300 underline"
                    >
                      Refazer
                    </button>
                  </div>
                ) : mapa.tipo === 'linker' ? (
                  <MapaLinker pares={mapa.pares} instrucao={mapa.instrucao} onConcluido={() => setMapaFeito(true)} />
                ) : (
                  <MapaFill nos={mapa.nos} arestas={mapa.arestas} opcoes={mapa.opcoes} instrucao={mapa.instrucao} onConcluido={() => setMapaFeito(true)} />
                )}
              </div>
            )}

            {/* Verdadeiro ou Falso */}
            {game && game.vf.length > 0 && (
              <div>
                <AtividadeHeader
                  icon={<CheckCircle2 size={18} className="text-white" />}
                  titulo="Verdadeiro ou Falso"
                  subtitulo={`${game.vf.length} afirmações · 12 segundos por item`}
                  cor="bg-gradient-to-r from-emerald-600/30 to-teal-900/30 border border-emerald-500/30"
                />
                <VerdadeiroFalso
                  itens={game.vf}
                  onConcluido={(a, t) => setVfAcertos({ acertos: a, total: t })}
                />
              </div>
            )}

            {/* Quiz Relâmpago */}
            {game && game.quiz.length > 0 && (
              <div>
                <AtividadeHeader
                  icon={<Zap size={18} className="text-white fill-white" />}
                  titulo="Quiz Relâmpago"
                  subtitulo={`${game.quiz.length} questões conceituais · 15 segundos por item`}
                  cor="bg-gradient-to-r from-orange-600/30 to-amber-900/30 border border-orange-500/30"
                />
                <QuizRelampago
                  itens={game.quiz}
                  onConcluido={(a, t) => setQuizAcertos({ acertos: a, total: t })}
                />
              </div>
            )}

            {/* Session summary if both games done */}
            {vfAcertos && quizAcertos && (
              <div className="bg-gradient-to-r from-orange-500/10 to-violet-500/10 border border-orange-500/20 rounded-2xl p-4 text-center space-y-1">
                <p className="text-sm font-bold text-white">Sessão de atividades concluída!</p>
                <p className="text-xs text-slate-400">
                  V/F: {vfAcertos.acertos}/{vfAcertos.total} · Quiz: {quizAcertos.acertos}/{quizAcertos.total}
                </p>
                <button
                  onClick={() => setActiveTab('praticar')}
                  className="mt-2 text-xs font-semibold text-orange-400 hover:text-orange-300"
                >
                  Ir para questões ENEM →
                </button>
              </div>
            )}

            {!mapa && !game && (
              <div className="text-center py-12 space-y-2">
                <div className="text-4xl">🚧</div>
                <p className="text-slate-400 text-sm">Atividades em desenvolvimento para este tópico.</p>
              </div>
            )}
          </div>
        )}

        {/* PRATICAR */}
        {activeTab === 'praticar' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-sky-400" />
                <h2 className="text-sm font-bold text-white">Questões ENEM/UERJ</h2>
              </div>
              {questoesTopico.length > 0 && (
                <span className="text-xs text-slate-500">{questoesTopico.length} questão{questoesTopico.length !== 1 ? 'ões' : ''}</span>
              )}
            </div>
            <PraticaInline topicoId={topicoId!} onEstadoAtualizado={recarregarEstado} />
          </div>
        )}

      </div>
    </Layout>
  )
}
