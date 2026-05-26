import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, BarChart3, BookOpen, Gamepad2, Target,
  Zap, CheckCircle2, XCircle, RefreshCw, ChevronRight, Lightbulb, List, FlaskConical,
} from 'lucide-react'
import clsx from 'clsx'
import Layout from '../components/Layout'
import GraphExplorer from '../components/GraphExplorer'
import IlustracaoSolucoes from '../components/IlustracaoSolucoes'
import IlustracaoOhm from '../components/IlustracaoOhm'
import IlustracaoGenetica from '../components/IlustracaoGenetica'
import MapaLinker from '../components/MapaLinker'
import MapaFill from '../components/MapaFill'
import VerdadeiroFalso from '../components/VerdadeiroFalso'
import { TOPICOS_MOCK, QUESTOES_MOCK } from '../lib/mock-data'
import { TEORIA } from '../lib/teoria-content'
import { MAPAS } from '../lib/mapa-data'
import { GAMES } from '../lib/game-data'
import { GRAPHS } from '../lib/graph-data'
import { carregarEstado, salvarEstado, salvarTentativa, jaRespondida } from '../lib/store'
import { calcularMastery, statusLabel } from '../lib/mastery'
import type { SecaoTeoria } from '../lib/teoria-content'
import type { EstadoTopico } from '../lib/types'

// ─── Illustration registry ────────────────────────────────────────────────────

const ILUSTRACOES: Record<string, React.ComponentType> = {
  'qui.solucoes':       IlustracaoSolucoes,
  'qui.estequiometria': IlustracaoSolucoes,
  'qui.termoquimica':   IlustracaoSolucoes,
  'fis.eletricidade.basico': IlustracaoOhm,
  'fis.eletricidade.circuitos': IlustracaoOhm,
  'bio.genetica.mendeliana': IlustracaoGenetica,
  'bio.genetica.heredograma': IlustracaoGenetica,
}

// ─── Theory section cards — light backgrounds for readability ─────────────────

function SecaoCard({ secao }: { secao: SecaoTeoria }) {
  const texto = typeof secao.conteudo === 'string'
    ? secao.conteudo
    : (secao.conteudo as string[]).join('\n')
  const lista = Array.isArray(secao.conteudo) ? secao.conteudo as string[] : [texto]

  if (secao.tipo === 'formula') {
    return (
      <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200">
        {secao.titulo && (
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 border-b border-slate-700">
            <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">f(x)</span>
            <h3 className="font-bold text-white text-sm">{secao.titulo}</h3>
          </div>
        )}
        <div className="bg-slate-950 p-5">
          <pre className="text-emerald-300 font-mono text-sm leading-loose whitespace-pre-wrap overflow-x-auto">{texto}</pre>
        </div>
      </div>
    )
  }

  if (secao.tipo === 'destaque') {
    return (
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 shadow-sm">
        {secao.titulo && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center shrink-0">
              <Lightbulb size={14} className="text-white" />
            </div>
            <h3 className="font-bold text-amber-900 text-sm">{secao.titulo}</h3>
          </div>
        )}
        <p className="text-amber-900 text-sm leading-relaxed">{texto}</p>
      </div>
    )
  }

  if (secao.tipo === 'lista') {
    return (
      <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5 shadow-sm">
        {secao.titulo && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-sky-500 flex items-center justify-center shrink-0">
              <List size={14} className="text-white" />
            </div>
            <h3 className="font-bold text-sky-900 text-sm">{secao.titulo}</h3>
          </div>
        )}
        <ul className="space-y-2.5">
          {lista.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
              <span className="shrink-0 w-5 h-5 rounded-full bg-sky-500 text-white text-xs flex items-center justify-center font-bold mt-0.5">{i + 1}</span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (secao.tipo === 'exemplo') {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
        {secao.titulo && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
              <ChevronRight size={14} className="text-white" />
            </div>
            <h3 className="font-bold text-emerald-900 text-sm">{secao.titulo}</h3>
          </div>
        )}
        <p className="text-emerald-900 text-sm leading-relaxed whitespace-pre-wrap">{texto}</p>
      </div>
    )
  }

  // tipo === 'texto'
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {secao.titulo && (
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center shrink-0">
            <BookOpen size={14} className="text-white" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">{secao.titulo}</h3>
        </div>
      )}
      <p className="text-slate-700 text-sm leading-relaxed">{texto}</p>
    </div>
  )
}

// ─── Inline practice ──────────────────────────────────────────────────────────

const LETRAS = ['A', 'B', 'C', 'D', 'E'] as const

function PraticaInline({ topicoId, onEstadoAtualizado }: { topicoId: string; onEstadoAtualizado: () => void }) {
  const questoes = QUESTOES_MOCK.filter((q) => q.topico_id === topicoId)
  const [indice, setIndice] = useState(0)
  const [selecionada, setSelecionada] = useState<string | null>(null)
  const [acertos, setAcertos] = useState(0)
  const [encerrado, setEncerrado] = useState(false)

  function reiniciar() { setIndice(0); setSelecionada(null); setAcertos(0); setEncerrado(false) }

  if (questoes.length === 0) {
    return (
      <div className="text-center py-12 space-y-3 bg-white rounded-2xl border border-slate-200 p-8">
        <div className="text-5xl">🚧</div>
        <p className="text-slate-500 text-sm font-medium">Questões para este tópico chegam em breve!</p>
        <Link to="/pratica" className="inline-block text-xs text-orange-600 hover:text-orange-700 font-semibold underline">
          Ver outros tópicos →
        </Link>
      </div>
    )
  }

  if (encerrado) {
    const pct = Math.round((acertos / questoes.length) * 100)
    return (
      <div className="text-center py-8 space-y-4 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="text-6xl">{pct >= 80 ? '🏆' : pct >= 60 ? '🥈' : '📚'}</div>
        <h3 className="text-xl font-bold text-slate-900">{acertos}/{questoes.length} corretos ({pct}%)</h3>
        <p className="text-slate-500 text-sm">
          {pct === 100 ? 'Perfeito! Domínio total!' : pct >= 80 ? 'Ótimo! Continue assim.' : pct >= 60 ? 'Bom progresso. Revise os erros.' : 'Estude a teoria e tente novamente.'}
        </p>
        <button onClick={reiniciar} className="inline-flex items-center gap-2 px-6 py-2.5 gradient-brand text-white font-semibold rounded-xl shadow-md text-sm">
          <RefreshCw size={14} /> Tentar novamente
        </button>
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
    const ok = letra === gabarito
    if (ok) setAcertos((a) => a + 1)
    const estados = carregarEstado()
    const idx = estados.findIndex((e) => e.topico_id === topicoId)
    if (idx >= 0) {
      const novo = calcularMastery(estados[idx], q.id, ok, jaRespondida(q.id))
      const novos = [...estados]; novos[idx] = novo; salvarEstado(novos)
    }
    salvarTentativa({ questao_id: q.id, resposta_marcada: letra, acertou: ok, confianca: null })
    onEstadoAtualizado()
  }

  function avancar() {
    if (indice + 1 >= questoes.length) setEncerrado(true)
    else { setSelecionada(null); setIndice((i) => i + 1) }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-500 font-medium">
          <span>Questão {indice + 1} de {questoes.length}</span>
          <span className="text-emerald-600 font-bold">{acertos} acerto{acertos !== 1 ? 's' : ''}</span>
        </div>
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full gradient-brand rounded-full transition-all duration-500" style={{ width: `${(indice / questoes.length) * 100}%` }} />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <span className="text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200 rounded-full px-3 py-1">{q.prova} {q.ano}</span>
        {jaRespondida(q.id) && <span className="text-xs font-bold bg-violet-100 text-violet-700 border border-violet-200 rounded-full px-3 py-1">já respondida</span>}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
        {q.enunciado.split('\n\n').map((par, i) => (
          <p key={i} className="mb-3 last:mb-0 leading-relaxed text-slate-800 text-sm">{par.replace(/\n/g, ' ')}</p>
        ))}
      </div>

      <div className="space-y-2">
        {letras.map((l) => {
          const isSel = selecionada === l, isGab = l === gabarito
          let wrapCls = 'border-slate-200 bg-white text-slate-800 hover:border-orange-400 hover:shadow-sm'
          let letCls = 'bg-slate-100 text-slate-500'
          if (respondida) {
            if (isGab) { wrapCls = 'border-emerald-400 bg-emerald-50 text-emerald-900'; letCls = 'bg-emerald-500 text-white' }
            else if (isSel) { wrapCls = 'border-red-400 bg-red-50 text-red-900'; letCls = 'bg-red-500 text-white' }
            else { wrapCls = 'border-slate-100 bg-slate-50 text-slate-400 opacity-60' }
          }
          return (
            <button key={l} onClick={() => responder(l)} disabled={respondida}
              className={clsx('w-full flex items-start gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all text-sm shadow-sm', wrapCls)}>
              <span className={clsx('shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold mt-0.5', letCls)}>{l}</span>
              <span className="leading-relaxed flex-1">{q.alternativas[l]}</span>
              {respondida && isGab && <CheckCircle2 size={16} className="ml-auto shrink-0 text-emerald-500 mt-0.5" />}
              {respondida && isSel && !isGab && <XCircle size={16} className="ml-auto shrink-0 text-red-500 mt-0.5" />}
            </button>
          )
        })}
      </div>

      {respondida && (
        <div className="space-y-3">
          <div className={clsx('px-4 py-3 rounded-xl text-sm border-2 flex items-start gap-3',
            acertou ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-red-300 bg-red-50 text-red-800')}>
            <div className={clsx('shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5', acertou ? 'bg-emerald-500' : 'bg-red-500')}>
              {acertou ? <CheckCircle2 size={14} className="text-white" /> : <XCircle size={14} className="text-white" />}
            </div>
            <span className="leading-relaxed">
              <span className="font-bold">{acertou ? 'Correto! ' : `Incorreto — gabarito: ${gabarito}. `}</span>
              Analise as alternativas para consolidar o raciocínio.
            </span>
          </div>
          <button onClick={avancar} className="w-full py-3 gradient-brand text-white font-bold rounded-xl shadow-md text-sm">
            {indice + 1 >= questoes.length ? 'Ver resultado final' : 'Próxima questão →'}
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Activity header ──────────────────────────────────────────────────────────

function AtivHeader({ icon, titulo, sub, color }: { icon: React.ReactNode; titulo: string; sub: string; color: string }) {
  return (
    <div className={clsx('rounded-2xl p-4 mb-4 flex items-center gap-3 border-2', color)}>
      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">{icon}</div>
      <div>
        <p className="font-bold text-white text-sm">{titulo}</p>
        <p className="text-white/70 text-xs mt-0.5">{sub}</p>
      </div>
    </div>
  )
}

// ─── Tab types ────────────────────────────────────────────────────────────────
type TabId = 'explorar' | 'teoria' | 'atividades' | 'praticar'

// ─── Main page ────────────────────────────────────────────────────────────────

export default function TopicPage() {
  const { topicoId } = useParams<{ topicoId: string }>()

  const topico    = TOPICOS_MOCK.find((t) => t.id === topicoId)
  const teoria    = topicoId ? TEORIA[topicoId]      : undefined
  const mapa      = topicoId ? MAPAS[topicoId]       : undefined
  const game      = topicoId ? GAMES[topicoId]       : undefined
  const graph     = topicoId ? GRAPHS[topicoId]      : undefined
  const Ilustracao = topicoId ? ILUSTRACOES[topicoId] : undefined
  const questoes  = QUESTOES_MOCK.filter((q) => q.topico_id === topicoId)

  const [estado, setEstado] = useState<EstadoTopico | null>(null)
  const [mapaFeito, setMapaFeito] = useState(false)
  const [vfAcertos, setVfAcertos] = useState<{ a: number; t: number } | null>(null)

  function recarregarEstado() {
    if (!topicoId) return
    const e = carregarEstado().find((e) => e.topico_id === topicoId)
    setEstado(e ?? null)
  }
  useEffect(() => { recarregarEstado() }, [topicoId])

  const hasExplorar  = !!(graph || Ilustracao)
  const hasAtividades = !!(mapa || game?.vf?.length)

  const AREA_COLORS: Record<string, string> = {
    matematica: 'from-orange-500 via-amber-500 to-yellow-500',
    fisica:     'from-blue-600 via-indigo-600 to-violet-600',
    quimica:    'from-teal-500 via-emerald-500 to-green-600',
    biologia:   'from-emerald-600 via-green-500 to-teal-500',
    historia:   'from-rose-600 via-red-500 to-orange-500',
    geografia:  'from-sky-500 via-cyan-500 to-teal-500',
    linguagens: 'from-violet-600 via-purple-500 to-fuchsia-500',
    filosofia:  'from-slate-600 via-zinc-500 to-stone-500',
    sociologia: 'from-pink-600 via-rose-500 to-red-500',
    default:    'from-orange-500 via-rose-500 to-violet-600',
  }

  const gradClass = AREA_COLORS[topico?.area ?? 'default'] ?? AREA_COLORS.default

  const tabs = [
    { id: 'explorar'   as TabId, label: 'Explorar',    icon: graph ? <BarChart3 size={14}/> : <FlaskConical size={14}/>, available: hasExplorar,    activeClass: 'bg-orange-500 text-white shadow-lg shadow-orange-200' },
    { id: 'teoria'     as TabId, label: 'Teoria',      icon: <BookOpen size={14}/>,  available: !!teoria,       activeClass: 'bg-violet-600 text-white shadow-lg shadow-violet-200' },
    { id: 'atividades' as TabId, label: 'Atividades',  icon: <Gamepad2 size={14}/>,  available: hasAtividades,  activeClass: 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' },
    { id: 'praticar'   as TabId, label: 'Praticar',    icon: <Target size={14}/>,    available: true,           activeClass: 'bg-sky-600 text-white shadow-lg shadow-sky-200' },
  ]

  const defaultTab = tabs.find((t) => t.available)?.id ?? 'praticar'
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab)

  if (!topico) {
    return <Layout><div className="flex items-center justify-center h-64"><p className="text-slate-500">Tópico não encontrado.</p></div></Layout>
  }

  const mastery = estado?.mastery_score ?? 0
  const label = statusLabel(estado?.status ?? 'nao_iniciado')

  return (
    <Layout>
      {/* Page gets its own background so cards render correctly */}
      <div className="min-h-screen bg-slate-50 px-4 sm:px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-5 pb-12">

          {/* ── Header ── */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl">
            <div className={clsx('absolute inset-0 bg-gradient-to-br', gradClass)} />
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 15% 50%, white 1px, transparent 1px), radial-gradient(circle at 75% 25%, white 1px, transparent 1px)', backgroundSize: '52px 52px' }} />
            <div className="relative px-6 pt-5 pb-6 space-y-4">
              <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-white/75 hover:text-white text-xs font-semibold transition-colors">
                <ArrowLeft size={13} /> Painel
              </Link>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-0.5">{topico.disciplina}</p>
                  <h1 className="text-2xl font-bold text-white leading-tight" style={{ fontFamily: 'var(--font-display)' }}>{topico.titulo}</h1>
                  <p className="text-white/70 text-sm mt-1 leading-relaxed">{topico.descricao}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/20 text-white border border-white/20">{label}</span>
                  <p className="text-white/50 text-xs mt-2">{Math.round(mastery * 100)}% domínio</p>
                </div>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${mastery * 100}%` }} />
              </div>
              <div className="flex gap-5 pt-0.5">
                {[
                  [estado?.total_tentativas ?? 0, 'tentativas'],
                  [estado?.questoes_unicas_acertadas ?? 0, 'acertos únicos'],
                  [questoes.length, 'questões'],
                ].map(([v, l], i) => (
                  <div key={i} className="text-center">
                    <p className="text-white text-sm font-bold">{v}</p>
                    <p className="text-white/50 text-xs">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
            {tabs.filter((t) => t.available).map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={clsx('flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200',
                  activeTab === tab.id ? tab.activeClass : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm hover:shadow')}>
                {tab.icon}{tab.label}
              </button>
            ))}
          </div>

          {/* ── EXPLORAR ── */}
          {activeTab === 'explorar' && (
            <div className="space-y-6">
              {graph && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={15} className="text-orange-500" />
                    <h2 className="text-sm font-bold text-slate-900">{graph.titulo}</h2>
                  </div>
                  <GraphExplorer config={graph} />
                </div>
              )}
              {Ilustracao && (
                <div className={clsx('bg-white rounded-2xl border border-slate-200 shadow-sm p-5', graph && 'border-t-4 border-t-orange-400')}>
                  <Ilustracao />
                </div>
              )}
            </div>
          )}

          {/* ── TEORIA ── */}
          {activeTab === 'teoria' && teoria && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen size={14} className="text-violet-600" />
                <h2 className="text-sm font-bold text-slate-700">Fundamentos teóricos</h2>
              </div>
              {teoria.secoes.map((s, i) => <SecaoCard key={i} secao={s} />)}
              {hasAtividades && (
                <button onClick={() => setActiveTab('atividades')} className="w-full mt-1 py-3 border-2 border-emerald-500 text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-all text-sm">
                  Ir para atividades →
                </button>
              )}
            </div>
          )}

          {/* ── ATIVIDADES ── */}
          {activeTab === 'atividades' && (
            <div className="space-y-8">
              {mapa && (
                <div>
                  <AtivHeader icon={<Target size={18} className="text-white" />}
                    titulo="Mapa Conceitual"
                    sub={mapa.tipo === 'linker' ? 'Conecte os conceitos com suas definições' : 'Complete o mapa escolhendo os termos corretos'}
                    color="bg-gradient-to-r from-violet-600 to-purple-700 border-violet-500" />
                  {mapaFeito ? (
                    <div className="text-center py-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                      <div className="text-4xl mb-2">🗺️</div>
                      <p className="text-emerald-700 font-bold text-sm">Mapa concluído!</p>
                      <button onClick={() => setMapaFeito(false)} className="text-xs text-slate-400 hover:text-slate-600 underline mt-1">Refazer</button>
                    </div>
                  ) : mapa.tipo === 'linker' ? (
                    <MapaLinker pares={mapa.pares} instrucao={mapa.instrucao} onConcluido={() => setMapaFeito(true)} />
                  ) : (
                    <MapaFill nos={mapa.nos} arestas={mapa.arestas} opcoes={mapa.opcoes} instrucao={mapa.instrucao} onConcluido={() => setMapaFeito(true)} />
                  )}
                </div>
              )}

              {game && game.vf.length > 0 && (
                <div>
                  <AtivHeader icon={<CheckCircle2 size={18} className="text-white" />}
                    titulo="Verdadeiro ou Falso"
                    sub={`${game.vf.length} afirmações · 12 segundos por item`}
                    color="bg-gradient-to-r from-emerald-600 to-teal-700 border-emerald-500" />
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <VerdadeiroFalso itens={game.vf} onConcluido={(a, t) => setVfAcertos({ a, t })} />
                  </div>
                  {vfAcertos && (
                    <div className="text-center text-xs text-slate-500 mt-2">
                      Resultado: <span className="text-slate-800 font-bold">{vfAcertos.a}/{vfAcertos.t}</span>
                      {' · '}
                      <button onClick={() => setActiveTab('praticar')} className="text-orange-600 hover:text-orange-700 font-semibold underline">
                        Ir para questões ENEM →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {!mapa && !game?.vf?.length && (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                  <div className="text-4xl mb-3">🚧</div>
                  <p className="text-slate-500 text-sm">Atividades em desenvolvimento para este tópico.</p>
                </div>
              )}
            </div>
          )}

          {/* ── PRATICAR ── */}
          {activeTab === 'praticar' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-sky-600" />
                  <h2 className="text-sm font-bold text-slate-700">Questões ENEM / UERJ</h2>
                </div>
                {questoes.length > 0 && <span className="text-xs text-slate-400 font-medium">{questoes.length} questão{questoes.length !== 1 ? 'ões' : ''}</span>}
              </div>
              <PraticaInline topicoId={topicoId!} onEstadoAtualizado={recarregarEstado} />
            </div>
          )}

        </div>
      </div>
    </Layout>
  )
}
