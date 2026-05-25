import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, RefreshCw } from 'lucide-react'
import clsx from 'clsx'
import Layout from '../components/Layout'
import MasteryBar from '../components/MasteryBar'
import { TOPICOS_MOCK, QUESTOES_MOCK } from '../lib/mock-data'
import { carregarEstado, resetarProgresso } from '../lib/store'
import { statusLabel } from '../lib/mastery'
import type { EstadoTopico, Topico } from '../lib/types'

function questoesPorTopico(topicoId: string): number {
  return QUESTOES_MOCK.filter((q) => q.topico_id === topicoId).length
}

function TopicCard({
  topico,
  estado,
  onPraticar,
}: {
  topico: Topico
  estado: EstadoTopico
  onPraticar: () => void
}) {
  const totalQuestoes = questoesPorTopico(topico.id)

  return (
    <div
      className={clsx(
        'bg-white border rounded-xl p-4 flex flex-col gap-3',
        'hover:shadow-md transition-shadow',
        estado.status === 'dominado' ? 'border-emerald-200' : 'border-slate-200',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-900 text-sm leading-snug">{topico.titulo}</p>
          <p className="text-xs text-slate-500 mt-0.5">{topico.descricao}</p>
        </div>
        <span
          className={clsx(
            'shrink-0 text-xs font-medium px-2 py-0.5 rounded-full',
            estado.status === 'dominado' && 'bg-emerald-100 text-emerald-700',
            estado.status === 'em_progresso' && 'bg-blue-100 text-blue-700',
            estado.status === 'enfraquecido' && 'bg-amber-100 text-amber-700',
            estado.status === 'nao_iniciado' && 'bg-slate-100 text-slate-500',
          )}
        >
          {statusLabel(estado.status)}
        </span>
      </div>

      <MasteryBar score={estado.mastery_score} status={estado.status} />

      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500">
          {estado.questoes_unicas_tentadas} / {totalQuestoes} questões · N{topico.nivel}
        </div>
        {totalQuestoes > 0 ? (
          <button
            onClick={onPraticar}
            className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Praticar <ChevronRight size={14} />
          </button>
        ) : (
          <span className="text-xs text-slate-400">Em breve</span>
        )}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [estado, setEstado] = useState<EstadoTopico[]>([])

  useEffect(() => {
    setEstado(carregarEstado())
  }, [])

  const estadoMap = Object.fromEntries(estado.map((e) => [e.topico_id, e]))

  const totalIniciados = estado.filter((e) => e.status !== 'nao_iniciado').length
  const totalDominados = estado.filter((e) => e.status === 'dominado').length
  const totalTentativas = estado.reduce((acc, e) => acc + e.total_tentativas, 0)

  function handleResetar() {
    if (confirm('Resetar todo o progresso? Essa ação não pode ser desfeita.')) {
      resetarProgresso()
      setEstado(carregarEstado())
    }
  }

  return (
    <Layout demoMode>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Painel de Estudos</h1>
            <p className="text-slate-500 text-sm mt-1">
              {totalIniciados} tópicos iniciados · {totalDominados} dominados · {totalTentativas} tentativas
            </p>
          </div>
          <button
            onClick={handleResetar}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors"
          >
            <RefreshCw size={13} />
            Resetar progresso
          </button>
        </div>

        {/* Resumo geral */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Tópicos iniciados', value: totalIniciados, total: TOPICOS_MOCK.length },
            { label: 'Dominados', value: totalDominados, total: TOPICOS_MOCK.length },
            { label: 'Tentativas totais', value: totalTentativas, total: null },
          ].map(({ label, value, total }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-2xl font-bold text-slate-900">
                {value}
                {total !== null && <span className="text-slate-400 text-base font-normal">/{total}</span>}
              </p>
              <p className="text-xs text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Tópicos */}
        <div>
          <h2 className="text-base font-semibold text-slate-700 mb-4">Matemática</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TOPICOS_MOCK.map((t) => {
              const e = estadoMap[t.id] ?? {
                topico_id: t.id,
                status: 'nao_iniciado',
                mastery_score: 0,
                decay_score: 0,
                total_tentativas: 0,
                questoes_unicas_tentadas: 0,
                questoes_unicas_acertadas: 0,
                ultima_tentativa_em: null,
              }
              return (
                <TopicCard
                  key={t.id}
                  topico={t}
                  estado={e as EstadoTopico}
                  onPraticar={() => navigate(`/pratica/${t.id}`)}
                />
              )
            })}
          </div>
        </div>
      </div>
    </Layout>
  )
}
