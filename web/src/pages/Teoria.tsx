import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronRight, Lightbulb, BookMarked, Calculator, List } from 'lucide-react'
import clsx from 'clsx'
import Layout from '../components/Layout'
import { TOPICOS_MOCK } from '../lib/mock-data'
import { TEORIA } from '../lib/teoria-content'
import type { SecaoTeoria } from '../lib/teoria-content'

const SECAO_CONFIG = {
  texto: {
    Icon: BookMarked,
    cor: 'text-violet-600',
    bg: 'bg-white',
    borda: 'border-slate-100',
  },
  formula: {
    Icon: Calculator,
    cor: 'text-orange-600',
    bg: 'bg-orange-50',
    borda: 'border-orange-100',
  },
  exemplo: {
    Icon: ChevronRight,
    cor: 'text-sky-600',
    bg: 'bg-sky-50',
    borda: 'border-sky-100',
  },
  destaque: {
    Icon: Lightbulb,
    cor: 'text-amber-600',
    bg: 'bg-amber-50',
    borda: 'border-amber-200',
  },
  lista: {
    Icon: List,
    cor: 'text-emerald-600',
    bg: 'bg-emerald-50',
    borda: 'border-emerald-100',
  },
}

function Secao({ s }: { s: SecaoTeoria }) {
  const cfg = SECAO_CONFIG[s.tipo]

  return (
    <div className={clsx('rounded-2xl border p-5 shadow-sm', cfg.bg, cfg.borda)}>
      {s.titulo && (
        <div className="flex items-center gap-2 mb-3">
          <cfg.Icon size={16} className={cfg.cor} />
          <h3 className="font-bold text-slate-800 text-sm" style={{ fontFamily: 'var(--font-display)' }}>
            {s.titulo}
          </h3>
        </div>
      )}

      {s.tipo === 'lista' && Array.isArray(s.conteudo) ? (
        <ul className="space-y-2">
          {s.conteudo.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
              <span className={clsx('mt-1.5 w-1.5 h-1.5 rounded-full shrink-0', cfg.cor.replace('text-', 'bg-'))} />
              {item}
            </li>
          ))}
        </ul>
      ) : s.tipo === 'formula' ? (
        <pre className="font-mono text-sm text-slate-800 whitespace-pre-wrap leading-relaxed bg-white/60 rounded-xl p-4 border border-orange-100">
          {s.conteudo as string}
        </pre>
      ) : s.tipo === 'exemplo' ? (
        <pre className="font-mono text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
          {s.conteudo as string}
        </pre>
      ) : (
        <p className="text-sm text-slate-700 leading-relaxed">{s.conteudo as string}</p>
      )}
    </div>
  )
}

export default function Teoria() {
  const { topicoId } = useParams<{ topicoId: string }>()
  const navigate = useNavigate()

  const topico = TOPICOS_MOCK.find((t) => t.id === topicoId)
  const teoria = TEORIA[topicoId ?? '']

  if (!topico || !teoria) {
    return (
      <Layout>
        <div className="p-8 text-slate-500">Teoria não disponível para este tópico.</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate(`/topico/${topicoId}`)}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> {topico.titulo}
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-violet-600 bg-violet-100 px-2.5 py-1 rounded-full">
              Teoria
            </span>
            <span className="text-xs text-slate-400">N{topico.nivel}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
            {topico.titulo}
          </h1>
          <p className="text-slate-500 text-sm mt-1">{topico.descricao}</p>
        </div>

        {/* Seções */}
        <div className="space-y-4">
          {teoria.secoes.map((s, i) => (
            <Secao key={i} s={s} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 gradient-brand rounded-2xl p-6 text-center">
          <p className="text-white font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            Entendeu a teoria?
          </p>
          <p className="text-white/80 text-sm mb-4">Teste seu conhecimento com questões do ENEM.</p>
          <button
            onClick={() => navigate(`/pratica/${topicoId}`)}
            className="px-6 py-2.5 bg-white text-orange-600 font-semibold text-sm rounded-xl hover:bg-orange-50 transition-colors shadow-md"
          >
            Ir para a prática →
          </button>
        </div>
      </div>
    </Layout>
  )
}
