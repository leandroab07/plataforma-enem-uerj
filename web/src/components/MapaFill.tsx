import { useState, useRef, useEffect, useCallback } from 'react'
import clsx from 'clsx'
import type { FillNo, FillAresta } from '../lib/mapa-data'

interface Props {
  nos: FillNo[]
  arestas: FillAresta[]
  opcoes: string[]
  instrucao: string
  onConcluido?: (acertos: number, total: number) => void
}

interface Linha { x1: number; y1: number; x2: number; y2: number }

export default function MapaFill({ nos, arestas, opcoes, instrucao, onConcluido }: Props) {
  const brancos = nos.filter((n) => !n.fixo)
  const [respostas, setRespostas] = useState<Record<string, string>>({})
  const [verificado, setVerificado] = useState(false)
  const [linhas, setLinhas] = useState<Linha[]>([])
  const [aberto, setAberto] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const noRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const calcularLinhas = useCallback(() => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const novas: Linha[] = []
    arestas.forEach(({ de, para }) => {
      const deEl = noRefs.current.get(de)
      const paraEl = noRefs.current.get(para)
      if (!deEl || !paraEl) return
      const dr = deEl.getBoundingClientRect()
      const pr = paraEl.getBoundingClientRect()
      novas.push({
        x1: dr.left + dr.width / 2 - rect.left,
        y1: dr.bottom - rect.top,
        x2: pr.left + pr.width / 2 - rect.left,
        y2: pr.top - rect.top,
      })
    })
    setLinhas(novas)
  }, [arestas])

  useEffect(() => {
    const timer = setTimeout(calcularLinhas, 50)
    window.addEventListener('resize', calcularLinhas)
    return () => { clearTimeout(timer); window.removeEventListener('resize', calcularLinhas) }
  }, [calcularLinhas, respostas])

  function selecionar(noId: string, opcao: string) {
    setRespostas((prev) => ({ ...prev, [noId]: opcao }))
    setAberto(null)
  }

  function verificar() {
    setVerificado(true)
    const acertos = brancos.filter((n) => {
      const resp = respostas[n.id] ?? ''
      return resp.replace(/\n/g, ' ').trim() === n.rotulo.replace(/\n/g, ' ').trim()
    }).length
    onConcluido?.(acertos, brancos.length)
  }

  function reiniciar() {
    setRespostas({})
    setVerificado(false)
    setAberto(null)
  }

  function isCorreta(no: FillNo) {
    const resp = respostas[no.id] ?? ''
    return resp.replace(/\n/g, ' ').trim() === no.rotulo.replace(/\n/g, ' ').trim()
  }

  const totalPreenchidos = brancos.filter((n) => respostas[n.id]).length

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5">
        {instrucao}
      </p>

      {/* Mapa */}
      <div
        ref={containerRef}
        className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 overflow-hidden"
        style={{ height: 380 }}
      >
        {/* SVG arestas */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          <defs>
            <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#cbd5e1" />
            </marker>
          </defs>
          {linhas.map((l, i) => (
            <line
              key={i}
              x1={l.x1} y1={l.y1 + 2}
              x2={l.x2} y2={l.y2 - 2}
              stroke="#cbd5e1"
              strokeWidth="1.5"
              markerEnd="url(#arrow)"
            />
          ))}
        </svg>

        {/* Nós */}
        {nos.map((no) => {
          const resposta = respostas[no.id]
          const preenchido = no.fixo || Boolean(resposta)
          const aberto_ = aberto === no.id

          return (
            <div
              key={no.id}
              ref={(el) => { if (el) noRefs.current.set(no.id, el) }}
              className="absolute"
              style={{
                left: `${no.x}%`,
                top: `${no.y}%`,
                transform: 'translate(-50%, 0)',
                zIndex: aberto_ ? 50 : 2,
                minWidth: 100,
              }}
            >
              {no.fixo ? (
                /* Nó fixo */
                <div className={clsx(
                  'px-3 py-1.5 rounded-xl text-center text-xs font-semibold shadow-sm border-2',
                  'bg-slate-800 border-slate-700 text-white whitespace-pre-line',
                )}>
                  {no.rotulo}
                </div>
              ) : (
                /* Nó em branco */
                <div className="relative">
                  <button
                    onClick={() => !verificado && setAberto(aberto_ ? null : no.id)}
                    disabled={verificado}
                    className={clsx(
                      'w-full px-3 py-1.5 rounded-xl text-center text-xs font-semibold border-2 transition-all shadow-sm whitespace-pre-line',
                      !preenchido && 'border-dashed border-slate-300 bg-white text-slate-400 hover:border-orange-400 hover:text-orange-500',
                      preenchido && !verificado && 'border-orange-400 bg-orange-50 text-orange-800',
                      verificado && isCorreta(no) && 'border-emerald-500 bg-emerald-50 text-emerald-800',
                      verificado && !isCorreta(no) && 'border-red-400 bg-red-50 text-red-700',
                    )}
                  >
                    {preenchido
                      ? (resposta ?? no.rotulo)
                      : '+ preencher'}
                  </button>

                  {/* Dropdown de opções */}
                  {aberto_ && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 min-w-36">
                      {opcoes.map((op) => (
                        <button
                          key={op}
                          onClick={() => selecionar(no.id, op)}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-orange-50 hover:text-orange-700 transition-colors whitespace-pre-line"
                        >
                          {op}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Botões */}
      <div className="flex items-center gap-3">
        {!verificado ? (
          <button
            onClick={verificar}
            disabled={totalPreenchidos < brancos.length}
            className="px-5 py-2.5 gradient-brand text-white text-sm font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          >
            Verificar ({totalPreenchidos}/{brancos.length} preenchidos)
          </button>
        ) : (
          <div className="flex items-center gap-3 w-full">
            <span className="text-sm font-semibold">
              {brancos.every(isCorreta) ? (
                <span className="text-emerald-600">Perfeito! Mapa completo!</span>
              ) : (
                <span className="text-orange-600">
                  {brancos.filter(isCorreta).length}/{brancos.length} corretos
                </span>
              )}
            </span>
            <button
              onClick={reiniciar}
              className="ml-auto px-4 py-2 border border-slate-300 rounded-xl text-sm text-slate-600 hover:bg-slate-50"
            >
              Tentar novamente
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
