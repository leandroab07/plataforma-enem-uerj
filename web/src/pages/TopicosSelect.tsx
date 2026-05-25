import { useNavigate } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import Layout from '../components/Layout'
import { TOPICOS_MOCK, QUESTOES_MOCK } from '../lib/mock-data'

export default function TopicosSelect() {
  const navigate = useNavigate()

  const comQuestoes = TOPICOS_MOCK.filter(
    (t) => QUESTOES_MOCK.some((q) => q.topico_id === t.id),
  )

  return (
    <Layout demoMode>
      <div className="max-w-xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Escolha um tópico</h1>
          <p className="text-slate-500 text-sm mt-1">Selecione o tópico que deseja praticar agora.</p>
        </div>

        <div className="space-y-2">
          {comQuestoes.map((t) => {
            const nQs = QUESTOES_MOCK.filter((q) => q.topico_id === t.id).length
            return (
              <button
                key={t.id}
                onClick={() => navigate(`/pratica/${t.id}`)}
                className="w-full flex items-center gap-4 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-sm transition-all text-left"
              >
                <BookOpen size={18} className="text-blue-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{t.titulo}</p>
                  <p className="text-xs text-slate-500">{nQs} questão{nQs !== 1 ? 's' : ''} disponível{nQs !== 1 ? 'is' : ''}</p>
                </div>
                <span className="text-xs text-slate-400">N{t.nivel}</span>
              </button>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}
