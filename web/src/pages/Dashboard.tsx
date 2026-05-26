import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Map, FlaskConical, ChevronRight, RotateCcw, TrendingUp } from 'lucide-react'
import clsx from 'clsx'
import Layout from '../components/Layout'
import MasteryBar from '../components/MasteryBar'
import { TOPICOS_MOCK, QUESTOES_MOCK } from '../lib/mock-data'
import { carregarEstado, resetarProgresso } from '../lib/store'
import { statusLabel } from '../lib/mastery'
import { TEORIA } from '../lib/teoria-content'
import { MAPAS } from '../lib/mapa-data'
import type { EstadoTopico, Topico, Status } from '../lib/types'

const AREA_CONFIG: Record<string, { label: string; cor: string; gradiente: string }> = {
  matematica: {
    label: 'Matemática',
    cor: 'border-orange-400',
    gradiente: 'from-orange-500 to-amber-500',
  },
}

const STATUS_BADGE: Record<Status, string> = {
  dominado:    'bg-emerald-100 text-emerald-700',
  em_progresso:'bg-blue-100 text-blue-700',
  enfraquecido:'bg-amber-100 text-amber-700',
  nao_iniciado:'bg-slate-100 text-slate-500',
}

function questoesPorTopico(id: string) {
  return QUESTOES_MOCK.filter((q) => q.topico_id === id).length
}

function TopicCard({ topico, estado }: { topico: Topico; estado: EstadoTopico }) {
  const navigate = useNavigate()
  const nQuestoes = questoesPorTopico(topico.id)
  const temTeoria = Boolean(TEORIA[topico.id])
  const temMapa = Boolean(MAPAS[topico.id])

  return (
    <div
      className={clsx(
        'bg-white rounded-2xl border-l-4 border border-slate-100 p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all group cursor-pointer',
        AREA_CONFIG['matematica'].cor,
      )}
      onClick={() => navigate(`/topico/${topico.id}`)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-900 text-sm leading-snug" style={{ fontFamily: 'var(--font-display)' }}>
            {topico.titulo}
          </p>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{topico.descricao}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className={clsx('text-xs font-semibold px-2.5 py-1 rounded-full', STATUS_BADGE[estado.status])}>
            {statusLabel(estado.status)}
          </span>
          <span className="text-xs text-slate-400">N{topico.nivel}</span>
        </div>
      </div>

      {/* Mastery */}
      <div className="space-y-1">
        <MasteryBar score={estado.mastery_score} status={estado.status} />
        <div className="flex justify-between text-xs text-slate-400">
          <span>{Math.round(estado.mastery_score * 100)}% domínio</span>
          <span>{estado.questoes_unicas_tentadas}/{nQuestoes} questões</span>
        </div>
      </div>

      {/* Ações disponíveis */}
      <div className="flex items-center gap-2 pt-1">
        {temTeoria && (
          <div className="flex items-center gap-1 text-xs text-violet-600 bg-violet-50 px-2 py-1 rounded-full font-medium">
            <BookOpen size={11} /> Teoria
          </div>
        )}
        {temMapa && (
          <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full font-medium">
            <Map size={11} /> Mapa
          </div>
        )}
        {nQuestoes > 0 && (
          <div className="flex items-center gap-1 text-xs text-sky-600 bg-sky-50 px-2 py-1 rounded-full font-medium">
            <FlaskConical size={11} /> {nQuestoes} questões
          </div>
        )}
        <ChevronRight size={14} className="ml-auto text-slate-300 group-hover:text-slate-500 transition-colors" />
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [estado, setEstado] = useState<EstadoTopico[]>([])

  useEffect(() => { setEstado(carregarEstado()) }, [])

  const estadoMap = Object.fromEntries(estado.map((e) => [e.topico_id, e]))

  const totalIniciados = estado.filter((e) => e.status !== 'nao_iniciado').length
  const totalDominados = estado.filter((e) => e.status === 'dominado').length
  const totalTentativas = estado.reduce((acc, e) => acc + e.total_tentativas, 0)
  const totalUnicas = estado.reduce((acc, e) => acc + e.questoes_unicas_tentadas, 0)

  const estadoPadrao = (id: string): EstadoTopico => ({
    topico_id: id, status: 'nao_iniciado', mastery_score: 0, decay_score: 0,
    total_tentativas: 0, questoes_unicas_tentadas: 0, questoes_unicas_acertadas: 0,
    ultima_tentativa_em: null,
  })

  return (
    <Layout demoMode>
      {/* Hero banner */}
      <div className="gradient-brand px-8 py-8 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 right-32 w-32 h-32 rounded-full bg-white/5" />
        <div className="relative max-w-4xl mx-auto">
          <p className="text-white/80 text-sm mb-1">Olá, bom estudo! 👋</p>
          <h1 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Painel de Estudos
          </h1>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Tópicos iniciados', value: `${totalIniciados}/${TOPICOS_MOCK.length}` },
              { label: 'Dominados', value: totalDominados },
              { label: 'Questões únicas', value: totalUnicas },
              { label: 'Tentativas', value: totalTentativas },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/15 backdrop-blur rounded-xl px-4 py-3">
                <p className="text-white text-xl font-bold">{value}</p>
                <p className="text-white/70 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progresso geral */}
        {totalIniciados > 0 && (
          <div className="mb-8 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-orange-500" />
              <h2 className="font-semibold text-slate-800 text-sm" style={{ fontFamily: 'var(--font-display)' }}>
                Progresso Geral
              </h2>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full gradient-brand rounded-full transition-all duration-700"
                style={{ width: `${(totalDominados / TOPICOS_MOCK.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {totalDominados} de {TOPICOS_MOCK.length} tópicos dominados
            </p>
          </div>
        )}

        {/* Tópicos */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-800" style={{ fontFamily: 'var(--font-display)' }}>
            Matemática
          </h2>
          <button
            onClick={() => { resetarProgresso(); setEstado(carregarEstado()) }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            <RotateCcw size={12} /> Resetar
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TOPICOS_MOCK.map((t) => (
            <TopicCard
              key={t.id}
              topico={t}
              estado={estadoMap[t.id] ?? estadoPadrao(t.id)}
            />
          ))}
        </div>
      </div>
    </Layout>
  )
}
