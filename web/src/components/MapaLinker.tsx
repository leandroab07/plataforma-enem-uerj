import { useState, useRef, useEffect, useCallback } from 'react'
import clsx from 'clsx'
import type { LinkerPar } from '../lib/mapa-data'

interface Props {
  pares: LinkerPar[]
  instrucao: string
  onConcluido?: (acertos: number, total: number) => void
}

const CORES = [
  { linha: '#f97316', bg: 'bg-orange-100', borda: 'border-orange-400', texto: 'text-orange-700' },
  { linha: '#7c3aed', bg: 'bg-violet-100', borda: 'border-violet-400', texto: 'text-violet-700' },
  { linha: '#0ea5e9', bg: 'bg-sky-100',    borda: 'border-sky-400',    texto: 'text-sky-700'    },
  { linha: '#10b981', bg: 'bg-emerald-100',borda: 'border-emerald-400',texto: 'text-emerald-700'},
  { linha: '#f43f5e', bg: 'bg-rose-100',   borda: 'border-rose-400',   texto: 'text-rose-700'   },
]

type Conexao = { esq: string; dir: string; corIdx: number; correta: boolean | null }

interface Linha {
  x1: number; y1: number; x2: number; y2: number; cor: string; opacity: number
}

export default function MapaLinker({ pares, instrucao, onConcluido }: Props) {
  const paresEmbaralhados = useState(() => [...pares].sort(() => Math.random() - 0.5))[0]

  const [selecionado, setSelecionado] = useState<string | null>(null)
  const [conexoes, setConexoes] = useState<Conexao[]>([])
  const [verificado, setVerificado] = useState(false)
  const [linhas, setLinhas] = useState<Linha[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const esqRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const dirRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  const calcularLinhas = useCallback(() => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const novas: Linha[] = []
    conexoes.forEach((c) => {
      const eEl = esqRefs.current.get(c.esq)
      const dEl = dirRefs.current.get(c.dir)
      if (!eEl || !dEl) return
      const eRect = eEl.getBoundingClientRect()
      const dRect = dEl.getBoundingClientRect()
      novas.push({
        x1: eRect.right - rect.left,
        y1: eRect.top + eRect.height / 2 - rect.top,
        x2: dRect.left - rect.left,
        y2: dRect.top + dRect.height / 2 - rect.top,
        cor: CORES[c.corIdx % CORES.length].linha,
        opacity: verificado ? (c.correta ? 1 : 0.4) : 1,
      })
    })
    setLinhas(novas)
  }, [conexoes, verificado])

  useEffect(() => {
    calcularLinhas()
    window.addEventListener('resize', calcularLinhas)
    return () => window.removeEventListener('resize', calcularLinhas)
  }, [calcularLinhas])

  function conectarDir(dirId: string) {
    if (!selecionado || verificado) return
    const jaConectadoEsq = conexoes.find((c) => c.esq === selecionado)
    const jaConectadoDir = conexoes.find((c) => c.dir === dirId)
    const filtrado = conexoes.filter((c) => c.esq !== selecionado && c.dir !== dirId)
    const corIdx = jaConectadoEsq?.corIdx ?? jaConectadoDir?.corIdx ?? filtrado.length
    setConexoes([...filtrado, { esq: selecionado, dir: dirId, corIdx, correta: null }])
    setSelecionado(null)
  }

  function verificar() {
    const novas = conexoes.map((c) => {
      const par = pares.find((p) => p.id === c.esq)
      return { ...c, correta: par ? c.dir === par.id : false }
    })
    setConexoes(novas)
    setVerificado(true)
    const acertos = novas.filter((c) => c.correta).length
    onConcluido?.(acertos, pares.length)
  }

  function reiniciar() {
    setConexoes([])
    setSelecionado(null)
    setVerificado(false)
    setLinhas([])
  }

  const conIdx = (id: string) => conexoes.find((c) => c.esq === id || c.dir === id)

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5">
        {instrucao}
      </p>

      <div ref={containerRef} className="relative select-none">
        {/* SVG linhas */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 10 }}
        >
          {linhas.map((l, i) => {
            const mx = (l.x1 + l.x2) / 2
            return (
              <g key={i}>
                <path
                  d={`M${l.x1},${l.y1} C${mx},${l.y1} ${mx},${l.y2} ${l.x2},${l.y2}`}
                  fill="none"
                  stroke={l.cor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity={l.opacity}
                />
              </g>
            )
          })}
        </svg>

        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
          {/* Coluna Esquerda — Conceitos */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Conceitos
            </p>
            {pares.map((par) => {
              const c = conIdx(par.id)
              const isSel = selecionado === par.id
              const cor = c ? CORES[c.corIdx % CORES.length] : null
              return (
                <button
                  key={par.id}
                  ref={(el) => { if (el) esqRefs.current.set(par.id, el) }}
                  onClick={() => !verificado && setSelecionado(isSel ? null : par.id)}
                  disabled={verificado}
                  className={clsx(
                    'w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all',
                    isSel
                      ? 'border-orange-500 bg-orange-50 text-orange-800 shadow-md shadow-orange-100'
                      : cor
                      ? `${cor.bg} ${cor.borda} ${cor.texto}`
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:shadow-sm',
                    verificado && c?.correta === false && 'border-red-400 bg-red-50 text-red-700',
                    verificado && c?.correta === true && `${cor!.bg} ${cor!.borda} ${cor!.texto}`,
                  )}
                >
                  {par.conceito}
                  {verificado && c?.correta === true && ' ✓'}
                  {verificado && c?.correta === false && ' ✗'}
                </button>
              )
            })}
          </div>

          {/* Coluna Direita — Definições (embaralhadas) */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Definições
            </p>
            {paresEmbaralhados.map((par) => {
              const c = conexoes.find((cc) => cc.dir === par.id)
              const cor = c ? CORES[c.corIdx % CORES.length] : null
              return (
                <button
                  key={par.id}
                  ref={(el) => { if (el) dirRefs.current.set(par.id, el) }}
                  onClick={() => conectarDir(par.id)}
                  disabled={verificado || !selecionado}
                  className={clsx(
                    'w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all',
                    cor
                      ? `${cor.bg} ${cor.borda} ${cor.texto} font-medium`
                      : 'border-slate-200 bg-white text-slate-600 hover:border-violet-400 hover:bg-violet-50',
                    selecionado && !c && !verificado && 'border-violet-300 cursor-pointer',
                    verificado && c?.correta === false && 'border-red-400 bg-red-50 text-red-700',
                  )}
                >
                  {par.definicao}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Botões */}
      <div className="flex items-center gap-3 pt-2">
        {!verificado ? (
          <button
            onClick={verificar}
            disabled={conexoes.length < pares.length}
            className="px-5 py-2.5 gradient-brand text-white text-sm font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-opacity shadow-md"
          >
            Verificar ({conexoes.length}/{pares.length} conectados)
          </button>
        ) : (
          <div className="flex items-center gap-3 w-full">
            <span className="text-sm font-semibold">
              {conexoes.filter((c) => c.correta).length === pares.length ? (
                <span className="text-emerald-600">Parabéns! Tudo certo!</span>
              ) : (
                <span className="text-orange-600">
                  {conexoes.filter((c) => c.correta).length}/{pares.length} corretos
                </span>
              )}
            </span>
            <button
              onClick={reiniciar}
              className="ml-auto px-4 py-2 border border-slate-300 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
