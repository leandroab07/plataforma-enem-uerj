import { useNavigate } from 'react-router-dom'
import { BookOpen, ChevronRight } from 'lucide-react'
import Layout from '../components/Layout'
import { TOPICOS_MOCK, QUESTOES_MOCK } from '../lib/mock-data'

export default function TopicosSelect() {
  const navigate = useNavigate()
  const comQuestoes = TOPICOS_MOCK.filter((t) => QUESTOES_MOCK.some((q) => q.topico_id === t.id))

  return (
    <Layout demoMode>
      <div className="max-w-xl mx-auto px-6 py-8">
        <h1 className="text-xl font-bold text-slate-900 mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Praticar
        </h1>
        <p className="text-slate-500 text-sm mb-6">Escolha um tópico para responder questões.</p>
        <div className="space-y-2">
          {comQuestoes.map((t) => {
            const nQs = QUESTOES_MOCK.filter((q) => q.topico_id === t.id).length
            return (
              <button
                key={t.id}
                onClick={() => navigate(`/pratica/${t.id}`)}
                className="w-full flex items-center gap-4 px-5 py-4 bg-white border border-slate-200 rounded-2xl hover:border-orange-400 hover:shadow-sm transition-all text-left group"
              >
                <div className="w-9 h-9 gradient-brand rounded-xl flex items-center justify-center shrink-0">
                  <BookOpen size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{t.titulo}</p>
                  <p className="text-xs text-slate-500">{nQs} questão{nQs !== 1 ? 's' : ''} · N{t.nivel}</p>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-orange-500 transition-colors" />
              </button>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}
