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

// ─── Illustration registry ───────────────────────────────────────────────────

const ILUSTRACOES: Record<string, React.ComponentType> = {
  'qui.solucoes': IlustracaoSolucoes,
  'qui.estequiometria': IlustracaoSolucoes,
}

// ─── Theory section cards ─────────────────────────────────────────────────────

function SecaoCard({ secao }: { secao: SecaoTeoria }) {
  const texto = typeof secao.conteudo === 'string'
    ? secao.conteudo
    : (secao.conteudo as string[]).join('\n')
  const lista = Array.isArray(secao.conteudo) ? secao.conteudo as string[] : [texto]

  if (secao.tipo === 'formula') {
    return (
      <div className="rounded-2xl overflow-hidden border border-orange-500/40 shadow-lg shadow-orange-900/10">
        {secao.titulo && (
          <div className="flex items-center gap-2 px-5 py-3 bg-orange-950/60 border-b border-orange-500/30">
            <span className="text-orange-300 font-mono text-xs font-bold bg-orange-500/20 px-2 py-0.5 rounded">f(x)</span>
            <h3 className="font-bold text-orange-200 text-sm">{secao.titulo}</h3>
          </div>
        )}
        <div className="bg-slate-950 p-5">
          <pre className="text-emerald-300 font-mono text-sm leading-loose whitespace-pre-wrap overflow-x-auto">
            {texto}
          </pre>
        </div>
      </div>
    )
  }

  if (secao.tipo === 'destaque') {
    return (
      <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-400/15 to-orange-500/10 p-5 shadow-md shadow-amber-900/10">
        {secao.titulo && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-amber-400/25 flex items-center justify-center shrink-0">
              <Lightbulb size={14} className="text-amber-300" />
            </div>
            <h3 className="font-bold text-amber-200 text-sm">{secao.titulo}</h3>
          </div>
        )}
        <p className="text-slate-100 text-sm leading-relaxed">{texto}</p>
      </div>
    )
  }

  if (secao.tipo === 'lista') {
    return (
      <div className="rounded-2xl border border-sky-500/30 bg-sky-950/30 p-5">
        {secao.titulo && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-sky-500/20 flex items-center justify-center shrink-0">
              <List size={14} className="text-sky-300" />
            </div>
            <h3 className="font-bold text-sky-200 text-sm">{secao.titulo}</h3>
          </div>
        )}
        <ul className="space-y-2.5">
          {lista.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-100">
              <span className="shrink-0 w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 text-xs flex items-center justify-center font-bold mt-0.5">
                {i + 1}
              </span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (secao.tipo === 'exemplo') {
    return (
      <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-5">
        {secao.titulo && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
              <ChevronRight size={14} className="text-emerald-300" />
            </div>
            <h3 className="font-bold text-emerald-200 text-sm">{secao.titulo}</h3>
          </div>
        )}
        <p className="text-slate-100 text-sm leading-relaxed whitespace-pre-wrap">{texto}</p>
      </div>
    )
  }

  // tipo === 'texto'
  return (
    <div className="rounded-2xl border border-slate-600/50 bg-slate-800/50 p-5">
      {secao.titulo && (
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0">
            <BookOpen size={14} className="text-violet-300" />
          </div>
          <h3 className="font-bold text-violet-200 text-sm">{secao.titulo}</h3>
        </div>
      )}
      <p className="text-slate-100 text-sm leading-relaxed">{texto}</p>
    </div>
  )
}

// ─── Inline practice session ──────────────────────────────────────────────────

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
      <div className="text-center py-12 space-y-3">
        <div className="text-5xl">🚧</div>
        <p className="text-slate-400 text-sm">Questões para este tópico chegam em breve!</p>
        <Link to="/pratica" className="inline-block text-xs text-orange-400 hover:text-orange-300 underline">
          Ver outros tópicos →
        </Link>
      </div>
    )
  }

  if (encerrado) {
    const pct = Math.round((acertos / questoes.length) * 100)
    return (
      <div className="text-center py-8 space-y-4">
        <div className="text-6xl">{pct >= 80 ? '🏆' : pct >= 60 ? '🥈' : '📚'}</div>
        <h3 className="text-xl font-bold text-white">{acertos}/{questoes.length} corretos ({pct}%)</h3>
        <p className="text-slate-400 text-sm">
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
      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Questão {indice + 1} de {questoes.length}</span>
          <span className="text-emerald-400 font-semibold">{acertos} acerto{acertos !== 1 ? 's' : ''}</span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full gradient-brand rounded-full transition-all duration-500" style={{ width: `${(indice / questoes.length) * 100}%` }} />
        </div>
      </div>

      {/* Meta badges */}
      <div className="flex gap-2 flex-wrap">
        <span className="text-xs font-semibold bg-orange-500/20 text-orange-200 border border-orange-500/30 rounded-full px-3 py-1">
          {q.prova} {q.ano}
        </span>
        {jaRespondida(q.id) && (
          <span className="text-xs font-semibold bg-violet-500/20 text-violet-200 border border-violet-500/30 rounded-full px-3 py-1">
            já respondida antes
          </span>
        )}
      </div>

      {/* Enunciado */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
        {q.enunciado.split('\n\n').map((par, i) => (
          <p key={i} className="mb-3 last:mb-0 leading-relaxed text-slate-800 text-sm">{par.replace(/\n/g, ' ')}</p>
        ))}
      </div>

      {/* Alternativas */}
      <div className="space-y-2">
        {letras.map((l) => {
          const isSel = selecionada === l
          const isGab = l === gabarito
          let wrapClass = 'border-slate-700 bg-slate-800/60 text-slate-100 hover:border-orange-500/60 hover:bg-slate-800'
          let letterClass = 'bg-slate-700 text-slate-300'
          if (respondida) {
            if (isGab) { wrapClass = 'border-emerald-500 bg-emerald-900/50 text-white'; letterClass = 'bg-emerald-600 text-white' }
            else if (isSel) { wrapClass = 'border-red-500 bg-red-900/50 text-white'; letterClass = 'bg-red-600 text-white' }
            else { wrapClass = 'border-slate-800 bg-slate-900/50 text-slate-500 opacity-60' }
          }
          return (
            <button key={l} onClick={() => responder(l)} disabled={respondida}
              className={clsx('w-full flex items-start gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all text-sm', wrapClass)}>
              <span className={clsx('shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold mt-0.5 transition-colors', letterClass)}>
                {l}
              </span>
              <span className="leading-relaxed flex-1">{q.alternativas[l]}</span>
              {respondida && isGab && <CheckCircle2 size={16} className="ml-auto shrink-0 text-emerald-400 mt-0.5" />}
              {respondida && isSel && !isGab && <XCircle size={16} className="ml-auto shrink-0 text-red-400 mt-0.5" />}
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {respondida && (
        <div className="space-y-3">
          <div className={clsx(
            'px-4 py-3 rounded-xl text-sm border-2 flex items-start gap-3',
            acertou ? 'border-emerald-500/60 bg-emerald-900/40 text-emerald-50' : 'border-red-500/60 bg-red-900/40 text-red-50',
          )}>
            <div className={clsx('shrink-0 w-6 h-6 rounded-full flex items-center justify-center', acertou ? 'bg-emerald-500' : 'bg-red-500')}>
              {acertou ? <CheckCircle2 size={14} className="text-white" /> : <XCircle size={14} className="text-white" />}
            </div>
            <span>
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

// ─── Activity section header ──────────────────────────────────────────────────

function AtivHeader({ icon, titulo, sub, gradFrom, gradTo, border }: {
  icon: React.ReactNode; titulo: string; sub: string
  gradFrom: string; gradTo: string; border: string
}) {
  return (
    <div className={clsx('rounded-2xl p-4 mb-4 flex items-center gap-3 border', border)} style={{
      background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})`,
    }}>
      <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="font-bold text-white text-sm">{titulo}</p>
        <p className="text-white/65 text-xs mt-0.5">{sub}</p>
      </div>
    </div>
  )
}

// ─── Tab definition ───────────────────────────────────────────────────────────

type TabId = 'explorar' | 'teoria' | 'atividades' | 'praticar'

// ─── Main component ───────────────────────────────────────────────────────────

export default function TopicPage() {
  const { topicoId } = useParams<{ topicoId: string }>()

  const topico = TOPICOS_MOCK.find((t) => t.id === topicoId)
  const teoria = topicoId ? TEORIA[topicoId] : undefined
  const mapa = topicoId ? MAPAS[topicoId] : undefined
  const game = topicoId ? GAMES[topicoId] : undefined
  const graph = topicoId ? GRAPHS[topicoId] : undefined
  const Ilustracao = topicoId ? ILUSTRACOES[topicoId] : undefined
  const questoesTopico = QUESTOES_MOCK.filter((q) => q.topico_id === topicoId)

  const [estado, setEstado] = useState<EstadoTopico | null>(null)
  const [mapaFeito, setMapaFeito] = useState(false)
  const [vfAcertos, setVfAcertos] = useState<{ a: number; t: number } | null>(null)

  function recarregarEstado() {
    if (!topicoId) return
    const e = carregarEstado().find((e) => e.topico_id === topicoId)
    setEstado(e ?? null)
  }

  useEffect(() => { recarregarEstado() }, [topicoId])

  const hasExplorar = !!(graph || Ilustracao)

  const tabs = [
    { id: 'explorar' as TabId, label: 'Explorar', icon: graph ? <BarChart3 size={14} /> : <FlaskConical size={14} />, available: hasExplorar, activeGrad: 'from-orange-500 to-amber-500', activeShadow: 'shadow-orange-900/40' },
    { id: 'teoria'   as TabId, label: 'Teoria',   icon: <BookOpen size={14} />,  available: !!teoria,            activeGrad: 'from-violet-600 to-purple-600', activeShadow: 'shadow-violet-900/40' },
    { id: 'atividades' as TabId, label: 'Atividades', icon: <Gamepad2 size={14} />, available: !!(mapa || game?.vf?.length), activeGrad: 'from-emerald-600 to-teal-600', activeShadow: 'shadow-emerald-900/40' },
    { id: 'praticar' as TabId, label: 'Praticar', icon: <Target size={14} />,    available: true,                activeGrad: 'from-sky-600 to-blue-600', activeShadow: 'shadow-sky-900/40' },
  ]

  const defaultTab = tabs.find((t) => t.available)?.id ?? 'praticar'
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab)

  if (!topico) {
    return <Layout><div className="flex items-center justify-center h-64"><p className="text-slate-500">Tópico não encontrado.</p></div></Layout>
  }

  const mastery = estado?.mastery_score ?? 0
  const label = statusLabel(estado?.status ?? 'nao_iniciado')
  const isQuimica = topico.area === 'quimica'

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-5 pb-12">

        {/* ── Header gradient card ── */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          <div className={clsx(
            'absolute inset-0',
            isQuimica
              ? 'bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-700'
              : 'bg-gradient-to-br from-orange-500 via-rose-500 to-violet-600',
          )} />
          {/* Texture overlay */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '48px 48px' }}
          />
          <div className="relative px-6 pt-5 pb-6 space-y-4">
            <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-semibold transition-colors">
              <ArrowLeft size={13} /> Painel
            </Link>

            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {isQuimica ? <FlaskConical size={14} className="text-white/70" /> : <BarChart3 size={14} className="text-white/70" />}
                  <p className="text-white/60 text-xs uppercase tracking-widest font-semibold">{topico.disciplina}</p>
                </div>
                <h1 className="text-2xl font-bold text-white leading-tight font-display">{topico.titulo}</h1>
                <p className="text-white/70 text-sm mt-1 leading-relaxed">{topico.descricao}</p>
              </div>
              <div className="shrink-0 text-right">
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/20">
                  {label}
                </span>
                <p className="text-white/50 text-xs mt-2">{Math.round(mastery * 100)}% domínio</p>
              </div>
            </div>

            {/* Mastery bar */}
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${mastery * 100}%` }} />
            </div>

            {/* Quick stats */}
            <div className="flex gap-5 pt-0.5">
              {[
                { v: estado?.total_tentativas ?? 0, l: 'tentativas' },
                { v: estado?.questoes_unicas_acertadas ?? 0, l: 'acertos únicos' },
                { v: questoesTopico.length, l: 'questões' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-white text-sm font-bold">{s.v}</p>
                  <p className="text-white/50 text-xs">{s.l}</p>
                </div>
              ))}
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
                'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200',
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.activeGrad} text-white shadow-lg ${tab.activeShadow}`
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700/80 border border-slate-700',
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── EXPLORAR ── */}
        {activeTab === 'explorar' && (
          <div className="space-y-6">
            {/* Graph Explorer */}
            {graph && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <BarChart3 size={16} className="text-orange-400" />
                  <h2 className="text-sm font-bold text-white">{graph.titulo}</h2>
                </div>
                <GraphExplorer config={graph} />
              </div>
            )}

            {/* Illustration */}
            {Ilustracao && (
              <div className={graph ? 'border-t border-slate-700/50 pt-6' : ''}>
                <Ilustracao />
              </div>
            )}
          </div>
        )}

        {/* ── TEORIA ── */}
        {activeTab === 'teoria' && teoria && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1 mb-1">
              <BookOpen size={15} className="text-violet-400" />
              <h2 className="text-sm font-bold text-white">Fundamentos teóricos</h2>
            </div>

            {teoria.secoes.map((s, i) => (
              <SecaoCard key={i} secao={s} />
            ))}

            {(mapa || game?.vf?.length) && (
              <button onClick={() => setActiveTab('atividades')} className="w-full mt-2 py-3 border-2 border-emerald-600/50 text-emerald-300 font-semibold rounded-xl hover:border-emerald-400 hover:text-emerald-100 transition-all text-sm">
                Ir para atividades →
              </button>
            )}
          </div>
        )}

        {/* ── ATIVIDADES ── */}
        {activeTab === 'atividades' && (
          <div className="space-y-8">

            {/* Concept map */}
            {mapa && (
              <div>
                <AtivHeader
                  icon={<Target size={18} className="text-white" />}
                  titulo="Mapa Conceitual"
                  sub={mapa.tipo === 'linker' ? 'Conecte os conceitos com suas definições' : 'Complete o mapa escolhendo os termos corretos'}
                  gradFrom="rgba(109,40,217,0.35)" gradTo="rgba(79,70,229,0.15)"
                  border="border-violet-500/30"
                />
                {mapaFeito ? (
                  <div className="text-center py-6 space-y-2">
                    <div className="text-4xl">🗺️</div>
                    <p className="text-emerald-300 font-bold text-sm">Mapa concluído!</p>
                    <button onClick={() => setMapaFeito(false)} className="text-xs text-slate-400 hover:text-slate-200 underline">Refazer</button>
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
                <AtivHeader
                  icon={<CheckCircle2 size={18} className="text-white" />}
                  titulo="Verdadeiro ou Falso"
                  sub={`${game.vf.length} afirmações · 12 segundos por item`}
                  gradFrom="rgba(5,150,105,0.35)" gradTo="rgba(4,120,87,0.15)"
                  border="border-emerald-500/30"
                />
                <VerdadeiroFalso itens={game.vf} onConcluido={(a, t) => setVfAcertos({ a, t })} />

                {vfAcertos && (
                  <div className="mt-4 text-center text-xs text-slate-400">
                    Resultado VF: <span className="text-white font-bold">{vfAcertos.a}/{vfAcertos.t}</span>
                    {' · '}
                    <button onClick={() => setActiveTab('praticar')} className="text-orange-400 hover:text-orange-300 underline">
                      Ir para questões ENEM →
                    </button>
                  </div>
                )}
              </div>
            )}

            {!mapa && !game?.vf?.length && (
              <div className="text-center py-12 space-y-2">
                <div className="text-4xl">🚧</div>
                <p className="text-slate-400 text-sm">Atividades em desenvolvimento para este tópico.</p>
              </div>
            )}
          </div>
        )}

        {/* ── PRATICAR ── */}
        {activeTab === 'praticar' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Zap size={15} className="text-sky-400" />
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
