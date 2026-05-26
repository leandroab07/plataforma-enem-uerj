import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Trophy } from 'lucide-react'
import Layout from '../components/Layout'
import MapaLinker from '../components/MapaLinker'
import MapaFill from '../components/MapaFill'
import { TOPICOS_MOCK } from '../lib/mock-data'
import { MAPAS } from '../lib/mapa-data'
import type { MapaLinkerData, MapaFillData } from '../lib/mapa-data'

export default function MapaConceitual() {
  const { topicoId } = useParams<{ topicoId: string }>()
  const navigate = useNavigate()
  const [resultado, setResultado] = useState<{ acertos: number; total: number } | null>(null)

  const topico = TOPICOS_MOCK.find((t) => t.id === topicoId)
  const mapa = MAPAS[topicoId ?? '']

  if (!topico || !mapa) {
    return (
      <Layout>
        <div className="p-8 text-slate-500">Mapa conceitual não disponível para este tópico.</div>
      </Layout>
    )
  }

  function handleConcluido(acertos: number, total: number) {
    setResultado({ acertos, total })
  }

  const perfeito = resultado && resultado.acertos === resultado.total

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate(`/topico/${topicoId}`)}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> {topico.titulo}
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full">
              Mapa Conceitual
            </span>
            <span className="text-xs text-slate-400">
              {mapa.tipo === 'linker' ? 'Ligar conceitos' : 'Completar nós'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
            {topico.titulo}
          </h1>
        </div>

        {/* Resultado banner */}
        {resultado && (
          <div className={`mb-6 rounded-2xl p-5 flex items-center gap-4 ${perfeito ? 'bg-emerald-50 border border-emerald-200' : 'bg-orange-50 border border-orange-200'}`}>
            <Trophy size={28} className={perfeito ? 'text-emerald-500' : 'text-orange-500'} />
            <div>
              <p className={`font-bold ${perfeito ? 'text-emerald-800' : 'text-orange-800'}`}>
                {perfeito ? 'Perfeito! Você dominou este mapa!' : `Quase lá! ${resultado.acertos}/${resultado.total} corretos.`}
              </p>
              <p className="text-sm text-slate-600">
                {perfeito
                  ? 'Agora pratique com questões do ENEM para fixar.'
                  : 'Revise a teoria e tente novamente.'}
              </p>
            </div>
            {!perfeito && (
              <button
                onClick={() => navigate(`/topico/${topicoId}/teoria`)}
                className="ml-auto px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors"
              >
                Rever teoria
              </button>
            )}
          </div>
        )}

        {/* Mapa */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          {mapa.tipo === 'linker' ? (
            <MapaLinker
              pares={(mapa as MapaLinkerData).pares}
              instrucao={mapa.instrucao}
              onConcluido={handleConcluido}
            />
          ) : (
            <MapaFill
              nos={(mapa as MapaFillData).nos}
              arestas={(mapa as MapaFillData).arestas}
              opcoes={(mapa as MapaFillData).opcoes}
              instrucao={mapa.instrucao}
              onConcluido={handleConcluido}
            />
          )}
        </div>

        {/* CTA para prática */}
        {perfeito && (
          <div className="mt-6 gradient-brand rounded-2xl p-6 text-center">
            <p className="text-white font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>
              Mapa dominado!
            </p>
            <p className="text-white/80 text-sm mb-4">Consolide com questões reais do ENEM.</p>
            <button
              onClick={() => navigate(`/pratica/${topicoId}`)}
              className="px-6 py-2.5 bg-white text-orange-600 font-semibold text-sm rounded-xl hover:bg-orange-50 transition-colors shadow-md"
            >
              Praticar questões →
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}
