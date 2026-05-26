import { useState, useEffect, useRef } from 'react'
import { CheckCircle2, XCircle, Zap } from 'lucide-react'
import clsx from 'clsx'
import type { ItemVF } from '../lib/game-data'

interface Props {
  itens: ItemVF[]
  onConcluido?: (acertos: number, total: number) => void
}

const TEMPO = 12

export default function VerdadeiroFalso({ itens, onConcluido }: Props) {
  const [idx, setIdx] = useState(0)
  const [acertos, setAcertos] = useState(0)
  const [tempo, setTempo] = useState(TEMPO)
  const [resposta, setResposta] = useState<boolean | null>(null)
  const [concluido, setConcluido] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const item = itens[idx]
  const pct = (tempo / TEMPO) * 100

  useEffect(() => {
    if (resposta !== null || concluido) return
    intervalRef.current = setInterval(() => {
      setTempo((t) => {
        if (t <= 1) { responder(null); return TEMPO }
        return t - 1
      })
    }, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [idx, resposta, concluido])

  function responder(valor: boolean | null) {
    if (resposta !== null) return
    if (intervalRef.current) clearInterval(intervalRef.current)
    setResposta(valor)
    if (valor !== null && valor === item.correto) setAcertos((a) => a + 1)
  }

  function avancar() {
    if (idx + 1 >= itens.length) {
      setConcluido(true)
      onConcluido?.(acertos + (resposta === item.correto ? 0 : 0), itens.length)
      return
    }
    setResposta(null)
    setTempo(TEMPO)
    setIdx((i) => i + 1)
  }

  function reiniciar() {
    setIdx(0); setAcertos(0); setTempo(TEMPO)
    setResposta(null); setConcluido(false)
  }

  if (concluido) {
    const pctAcertos = Math.round((acertos / itens.length) * 100)
    const estrelas = pctAcertos >= 80 ? 3 : pctAcertos >= 60 ? 2 : 1
    return (
      <div className="text-center py-6 space-y-4">
        <div className="text-5xl">{'⭐'.repeat(estrelas)}{'☆'.repeat(3 - estrelas)}</div>
        <h3 className="text-xl font-bold text-white">{acertos}/{itens.length} corretos</h3>
        <p className="text-slate-400 text-sm">
          {pctAcertos >= 80 ? 'Excelente! Você domina o tema!' : pctAcertos >= 60 ? 'Bom! Revise os erros.' : 'Estude mais a teoria e tente novamente.'}
        </p>
        <button onClick={reiniciar} className="px-5 py-2.5 gradient-brand text-white font-semibold rounded-xl shadow-md">
          Jogar novamente
        </button>
      </div>
    )
  }

  const acertou = resposta !== null && resposta === item.correto
  const errou = resposta !== null && resposta !== item.correto

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-orange-400" />
          <span className="text-sm font-semibold text-slate-300">
            {idx + 1} / {itens.length}
          </span>
        </div>
        <div className="flex gap-1">
          {itens.map((_, i) => (
            <div key={i} className={clsx('w-2 h-2 rounded-full', i < idx ? 'bg-orange-500' : i === idx ? 'bg-white' : 'bg-slate-700')} />
          ))}
        </div>
        <span className={clsx('font-mono font-bold text-lg', tempo <= 4 ? 'text-red-400' : 'text-white')}>
          {tempo}s
        </span>
      </div>

      {/* Timer bar */}
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all duration-1000', tempo <= 4 ? 'bg-red-500' : 'bg-orange-500')}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Card */}
      <div className={clsx(
        'rounded-2xl border-2 p-6 text-center transition-all duration-300 min-h-32 flex items-center justify-center',
        resposta === null && 'border-slate-700 bg-slate-900',
        acertou && 'border-emerald-500 bg-emerald-900/30',
        errou && 'border-red-500 bg-red-900/30',
      )}>
        <p className="text-lg font-semibold text-white leading-relaxed">{item.enunciado}</p>
      </div>

      {/* Explicação */}
      {resposta !== null && (
        <div className={clsx(
          'px-4 py-3 rounded-xl text-sm flex items-start gap-2',
          acertou ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700' : 'bg-red-900/40 text-red-300 border border-red-700',
        )}>
          {acertou ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> : <XCircle size={16} className="shrink-0 mt-0.5" />}
          {item.explicacao}
        </div>
      )}

      {/* Botões V/F ou Próximo */}
      {resposta === null ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => responder(true)}
            className="py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg rounded-2xl transition-all active:scale-95 shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={22} /> Verdadeiro
          </button>
          <button
            onClick={() => responder(false)}
            className="py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-lg rounded-2xl transition-all active:scale-95 shadow-lg shadow-red-900/50 flex items-center justify-center gap-2"
          >
            <XCircle size={22} /> Falso
          </button>
        </div>
      ) : (
        <button
          onClick={avancar}
          className="w-full py-3 gradient-brand text-white font-semibold rounded-xl shadow-md"
        >
          {idx + 1 >= itens.length ? 'Ver resultado' : 'Próximo →'}
        </button>
      )}

      {/* Placar */}
      <p className="text-center text-xs text-slate-500">{acertos} corretos até agora</p>
    </div>
  )
}
