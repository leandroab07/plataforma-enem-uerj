import { useState, useEffect, useRef } from 'react'
import { Zap, CheckCircle2, XCircle } from 'lucide-react'
import clsx from 'clsx'
import type { ItemQuiz } from '../lib/game-data'

interface Props {
  itens: ItemQuiz[]
  onConcluido?: (acertos: number, total: number) => void
}

const TEMPO = 15
const LETRAS = ['A', 'B', 'C', 'D'] as const

export default function QuizRelampago({ itens, onConcluido }: Props) {
  const [idx, setIdx] = useState(0)
  const [acertos, setAcertos] = useState(0)
  const [tempo, setTempo] = useState(TEMPO)
  const [selecionada, setSelecionada] = useState<string | null>(null)
  const [concluido, setConcluido] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const item = itens[idx]
  const pct = (tempo / TEMPO) * 100
  const letras = LETRAS.filter((l) => l in item.alternativas)

  useEffect(() => {
    if (selecionada !== null || concluido) return
    intervalRef.current = setInterval(() => {
      setTempo((t) => {
        if (t <= 1) { confirmar(null); return TEMPO }
        return t - 1
      })
    }, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [idx, selecionada, concluido])

  function confirmar(resp: string | null) {
    if (selecionada !== null) return
    if (intervalRef.current) clearInterval(intervalRef.current)
    setSelecionada(resp ?? '__timeout__')
    if (resp === item.gabarito) setAcertos((a) => a + 1)
  }

  function avancar() {
    if (idx + 1 >= itens.length) {
      setConcluido(true)
      onConcluido?.(acertos, itens.length)
    } else {
      setSelecionada(null); setTempo(TEMPO); setIdx((i) => i + 1)
    }
  }

  function reiniciar() {
    setIdx(0); setAcertos(0); setTempo(TEMPO); setSelecionada(null); setConcluido(false)
  }

  if (concluido) {
    const pctAcertos = Math.round((acertos / itens.length) * 100)
    return (
      <div className="text-center py-6 space-y-4">
        <div className="text-5xl mb-2">
          {pctAcertos >= 80 ? '🏆' : pctAcertos >= 60 ? '🥈' : '📚'}
        </div>
        <h3 className="text-xl font-bold text-white">{acertos}/{itens.length} corretos ({pctAcertos}%)</h3>
        <p className="text-slate-400 text-sm">
          {pctAcertos === 100 ? 'Perfeito! Você é imbatível!' : pctAcertos >= 80 ? 'Ótimo resultado!' : pctAcertos >= 60 ? 'Bom, continue praticando.' : 'Revise a teoria e tente novamente.'}
        </p>
        <div className="flex gap-2 justify-center pt-2">
          <button onClick={reiniciar} className="px-5 py-2.5 gradient-brand text-white font-semibold rounded-xl shadow-md">
            Jogar novamente
          </button>
        </div>
      </div>
    )
  }

  const respondido = selecionada !== null
  const acertou = selecionada === item.gabarito

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-orange-400 fill-orange-400" />
          <span className="text-sm font-semibold text-slate-300">Quiz Relâmpago · {idx + 1}/{itens.length}</span>
        </div>
        <div className={clsx(
          'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm font-mono border-2',
          tempo <= 5 ? 'border-red-500 text-red-400 animate-pulse' : 'border-orange-500 text-orange-400',
        )}>
          {tempo}
        </div>
      </div>

      {/* Timer arc (SVG) */}
      <div className="relative">
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={clsx('h-full rounded-full transition-all duration-1000', tempo <= 5 ? 'bg-red-500' : 'bg-orange-500')}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Enunciado */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 min-h-20 flex items-center">
        <p className="text-base font-semibold text-white leading-relaxed">{item.enunciado}</p>
      </div>

      {/* Alternativas */}
      <div className="grid grid-cols-1 gap-2.5">
        {letras.map((l) => {
          const isSelected = selecionada === l
          const isGabarito = l === item.gabarito
          let cls = 'border-slate-700 bg-slate-800/50 text-slate-200 hover:border-slate-500'
          let letraClass = 'bg-slate-700 text-slate-400'

          if (respondido) {
            if (isGabarito) {
              cls = 'border-emerald-500 bg-emerald-900/40 text-emerald-100'
              letraClass = 'bg-emerald-600 text-white'
            } else if (isSelected) {
              cls = 'border-red-500 bg-red-900/40 text-red-100'
              letraClass = 'bg-red-600 text-white'
            }
          } else if (isSelected) {
            cls = 'border-orange-500 bg-orange-900/40 text-orange-100'
            letraClass = 'bg-orange-500 text-white'
          }

          return (
            <button
              key={l}
              onClick={() => !respondido && confirmar(l)}
              disabled={respondido}
              className={clsx('flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all', cls, !respondido && 'active:scale-98')}
            >
              <span className={clsx('shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold', letraClass)}>
                {l}
              </span>
              <span className="text-sm">{item.alternativas[l]}</span>
              {respondido && isGabarito && <CheckCircle2 size={16} className="ml-auto shrink-0 text-emerald-400" />}
              {respondido && isSelected && !isGabarito && <XCircle size={16} className="ml-auto shrink-0 text-red-400" />}
            </button>
          )
        })}
      </div>

      {/* Explicação + botão avançar */}
      {respondido && (
        <div className="space-y-3">
          <div className={clsx(
            'px-4 py-3 rounded-xl text-sm border',
            acertou ? 'bg-emerald-900/40 text-emerald-300 border-emerald-700' : 'bg-red-900/40 text-red-300 border-red-700',
          )}>
            <span className="font-semibold">{acertou ? '✓ Correto! ' : '✗ Incorreto. '}</span>
            {item.explicacao}
          </div>
          <button
            onClick={avancar}
            className="w-full py-3 gradient-brand text-white font-semibold rounded-xl shadow-md"
          >
            {idx + 1 >= itens.length ? 'Ver resultado final' : 'Próxima →'}
          </button>
        </div>
      )}
    </div>
  )
}
