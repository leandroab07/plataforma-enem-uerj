import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Map, FlaskConical, CheckCircle2, Lock } from 'lucide-react'
import clsx from 'clsx'
import Layout from '../components/Layout'
import { TOPICOS_MOCK, QUESTOES_MOCK } from '../lib/mock-data'
import { carregarEstado } from '../lib/store'
import { statusLabel } from '../lib/mastery'
import { TEORIA } from '../lib/teoria-content'
import { MAPAS } from '../lib/mapa-data'
import type { EstadoTopico } from '../lib/types'

interface Acao {
  icon: React.ReactNode
  titulo: string
  descricao: string
  href: string
  disponivel: boolean
  cor: string
  corBg: string
}

export default function TopicHub() {
  const { topicoId } = useParams<{ topicoId: string }>()
  const navigate = useNavigate()
  const [estado, setEstado] = useState<EstadoTopico | null>(null)

  const topico = TOPICOS_MOCK.find((t) => t.id === topicoId)

  useEffect(() => {
    const estados = carregarEstado()
    const e = estados.find((e) => e.topico_id === topicoId)
    setEstado(e ?? null)
  }, [topicoId])

  if (!topico) {
    return (
      <Layout>
        <div className="p-8 text-slate-500">Tópico não encontrado.</div>
      </Layout>
    )
  }

  const nQuestoes = QUESTOES_MOCK.filter((q) => q.topico_id === topicoId).length
  const temTeoria = Boolean(TEORIA[topicoId!])
  const temMapa = Boolean(MAPAS[topicoId!])

  const acoes: Acao[] = [
    {
      icon: <BookOpen size={22} />,
      titulo: 'Teoria',
      descricao: 'Leia a explicação completa com fórmulas e exemplos resolvidos.',
      href: `/topico/${topicoId}/teoria`,
      disponivel: temTeoria,
      cor: 'text-violet-600',
      corBg: 'bg-violet-50 border-violet-200 hover:border-violet-400',
    },
    {
      icon: <Map size={22} />,
      titulo: 'Mapa Conceitual',
      descricao: 'Consolide o conhecimento conectando e preenchendo conceitos.',
      href: `/topico/${topicoId}/mapa`,
      disponivel: temMapa,
      cor: 'text-orange-600',
      corBg: 'bg-orange-50 border-orange-200 hover:border-orange-400',
    },
    {
      icon: <FlaskConical size={22} />,
      titulo: 'Praticar Questões',
      descricao: `${nQuestoes} questão${nQuestoes !== 1 ? 's' : ''} do ENEM e UERJ com feedback imediato.`,
      href: `/pratica/${topicoId}`,
      disponivel: nQuestoes > 0,
      cor: 'text-sky-600',
      corBg: 'bg-sky-50 border-sky-200 hover:border-sky-400',
    },
  ]

  const e = estado ?? {
    topico_id: topicoId!, status: 'nao_iniciado' as const, mastery_score: 0, decay_score: 0,
    total_tentativas: 0, questoes_unicas_tentadas: 0, questoes_unicas_acertadas: 0, ultima_tentativa_em: null,
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Painel
        </button>

        {/* Header do tópico */}
        <div className="gradient-brand rounded-2xl p-6 mb-8 relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5" />
          <p className="text-orange-200 text-xs font-semibold uppercase tracking-wider mb-2">
            Matemática · N{topico.nivel}
          </p>
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            {topico.titulo}
          </h1>
          <p className="text-white/80 text-sm mb-5">{topico.descricao}</p>

          <div className="bg-white/15 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-xs text-white/80">
              <span>{statusLabel(e.status)}</span>
              <span>{Math.round(e.mastery_score * 100)}% domínio</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-700"
                style={{ width: `${e.mastery_score * 100}%` }}
              />
            </div>
            <div className="flex gap-4 text-xs text-white/70 pt-1">
              <span>{e.questoes_unicas_tentadas} questões únicas tentadas</span>
              <span>{e.total_tentativas} tentativas totais</span>
            </div>
          </div>
        </div>

        {/* Ações */}
        <h2 className="font-bold text-slate-800 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Como você quer estudar hoje?
        </h2>
        <div className="space-y-3">
          {acoes.map(({ icon, titulo, descricao, href, disponivel, cor, corBg }) => (
            disponivel ? (
              <Link
                key={titulo}
                to={href}
                className={clsx(
                  'flex items-center gap-4 p-5 rounded-2xl border-2 transition-all group',
                  corBg,
                )}
              >
                <div className={clsx('shrink-0', cor)}>{icon}</div>
                <div className="flex-1">
                  <p className={clsx('font-bold text-slate-900 text-sm', cor.replace('text-', 'group-hover:text-'))}>
                    {titulo}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{descricao}</p>
                </div>
                <ArrowLeft size={16} className="text-slate-300 rotate-180 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <div
                key={titulo}
                className="flex items-center gap-4 p-5 rounded-2xl border-2 border-dashed border-slate-200 opacity-50"
              >
                <div className="shrink-0 text-slate-400">{icon}</div>
                <div className="flex-1">
                  <p className="font-bold text-slate-600 text-sm">{titulo}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Em breve</p>
                </div>
                <Lock size={14} className="text-slate-300" />
              </div>
            )
          ))}
        </div>

        {/* Pré-requisitos */}
        {topico.pre_requisitos.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Pré-requisitos
            </h3>
            <div className="flex flex-wrap gap-2">
              {topico.pre_requisitos.map((prId) => {
                const pr = TOPICOS_MOCK.find((t) => t.id === prId)
                return pr ? (
                  <Link
                    key={prId}
                    to={`/topico/${prId}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-xs text-slate-600 transition-colors"
                  >
                    <CheckCircle2 size={12} className="text-slate-400" />
                    {pr.titulo}
                  </Link>
                ) : null
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
