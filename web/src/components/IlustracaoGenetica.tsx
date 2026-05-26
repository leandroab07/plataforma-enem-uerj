import { useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type GenotypeKey = 'AA' | 'Aa' | 'aa'

interface ParentOption {
  label: string
  gametes: [string, string]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ALLELE_OPTIONS = ['A', 'B', 'C', 'E', 'T'] as const
type AlleleChar = (typeof ALLELE_OPTIONS)[number]

// Build parent options for a given allele letter
function buildParents(a: AlleleChar): Record<GenotypeKey, ParentOption> {
  const lo = a.toLowerCase()
  return {
    AA: { label: `Dominante puro (${a}${a})`, gametes: [a, a] },
    Aa: { label: `Heterozigoto (${a}${lo})`,  gametes: [a, lo] },
    aa: { label: `Recessivo puro (${lo}${lo})`, gametes: [lo, lo] },
  }
}

// ─── Genetics Logic ───────────────────────────────────────────────────────────

function cross(g1: string, g2: string): string {
  // Put uppercase allele first
  if (g1 === g1.toUpperCase() && g2 === g2.toLowerCase()) return `${g1}${g2}`
  if (g2 === g2.toUpperCase() && g1 === g1.toLowerCase()) return `${g2}${g1}`
  return `${g1}${g2}`
}

function getPunnett(gametes1: [string, string], gametes2: [string, string]): string[][] {
  return gametes1.map(g1 => gametes2.map(g2 => cross(g1, g2)))
}

function isRecessive(cell: string): boolean {
  // recessive only if both chars are lowercase
  return cell[0] === cell[0].toLowerCase() && cell[1] === cell[1].toLowerCase()
}

interface Counts {
  homoDom: number  // e.g. AA
  hetero: number   // e.g. Aa
  homoRec: number  // e.g. aa
}

function countGenotypes(grid: string[][]): Counts {
  const flat = grid.flat()
  let homoDom = 0, hetero = 0, homoRec = 0
  for (const c of flat) {
    if (isRecessive(c)) homoRec++
    else if (c[0].toUpperCase() === c[0] && c[1].toUpperCase() === c[1]) homoDom++
    else hetero++
  }
  return { homoDom, hetero, homoRec }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ParentCircle({ genotype, allele, label }: { genotype: GenotypeKey; allele: AlleleChar; label: string }) {
  const lo = allele.toLowerCase()
  const display =
    genotype === 'AA' ? `${allele}${allele}` :
    genotype === 'Aa' ? `${allele}${lo}` :
    `${lo}${lo}`

  const isDom = genotype !== 'aa'
  const bg = isDom
    ? 'radial-gradient(circle at 35% 35%, #f97316, #c2410c)'
    : 'radial-gradient(circle at 35% 35%, #38bdf8, #0369a1)'
  const border = isDom ? '#fb923c' : '#7dd3fc'

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-slate-400 font-medium">{label}</span>
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg select-none"
        style={{ background: bg, border: `2px solid ${border}`, boxShadow: `0 0 12px ${border}55` }}
      >
        {display}
      </div>
    </div>
  )
}

interface PunnettGridProps {
  grid: string[][]
  gametes1: [string, string]
  gametes2: [string, string]
}

function PunnettGrid({ grid, gametes1, gametes2 }: PunnettGridProps) {
  return (
    <div className="inline-block">
      {/* Header row */}
      <div className="grid" style={{ gridTemplateColumns: '36px 1fr 1fr' }}>
        {/* Empty top-left corner */}
        <div />
        {gametes2.map((g, i) => (
          <div
            key={i}
            className="flex items-center justify-center text-sm font-bold font-mono text-slate-300 pb-1"
          >
            {g}
          </div>
        ))}
      </div>

      {/* Data rows */}
      {grid.map((row, ri) => (
        <div key={ri} className="grid" style={{ gridTemplateColumns: '36px 1fr 1fr' }}>
          {/* Row header: gamete from parent 1 */}
          <div className="flex items-center justify-center text-sm font-bold font-mono text-slate-300 pr-1">
            {gametes1[ri]}
          </div>
          {row.map((cell, ci) => {
            const rec = isRecessive(cell)
            return (
              <div
                key={ci}
                className="w-16 h-14 m-0.5 rounded-xl flex items-center justify-center text-base font-bold font-mono transition-all duration-300 shadow-sm"
                style={{
                  background: rec
                    ? 'linear-gradient(135deg, #0c4a6e, #075985)'
                    : 'linear-gradient(135deg, #7c2d12, #9a3412)',
                  color: rec ? '#7dd3fc' : '#fdba74',
                  border: `1.5px solid ${rec ? '#0369a1' : '#c2410c'}`,
                  boxShadow: rec
                    ? '0 2px 8px rgba(3,105,161,0.3)'
                    : '0 2px 8px rgba(194,65,12,0.3)',
                }}
              >
                {cell}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function IlustracaoGenetica() {
  const [p1Key, setP1Key] = useState<GenotypeKey>('Aa')
  const [p2Key, setP2Key] = useState<GenotypeKey>('Aa')
  const [allele, setAllele] = useState<AlleleChar>('A')

  const PARENTS = buildParents(allele)
  const lo = allele.toLowerCase()

  const gametes1 = PARENTS[p1Key].gametes as [string, string]
  const gametes2 = PARENTS[p2Key].gametes as [string, string]

  const grid = getPunnett(gametes1, gametes2)
  const { homoDom, hetero, homoRec } = countGenotypes(grid)

  const total = 4
  const domCount = homoDom + hetero
  const recCount = homoRec

  // Ratio string
  function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b) }
  const g = gcd(domCount, recCount)
  const ratioStr =
    domCount === 0
      ? `0 Dominantes : ${recCount} Recessivos`
      : recCount === 0
      ? `${domCount} Dominantes : 0 Recessivos`
      : `${domCount / g} Dominante${domCount / g !== 1 ? 's' : ''} : ${recCount / g} Recessivo${recCount / g !== 1 ? 's' : ''}`

  const pctDom = ((domCount / total) * 100).toFixed(0)
  const pctRec = ((recCount / total) * 100).toFixed(0)

  // Genotype ratio string
  const genoRatioStr = [
    homoDom > 0 ? `${homoDom} ${allele}${allele}` : null,
    hetero  > 0 ? `${hetero} ${allele}${lo}` : null,
    homoRec > 0 ? `${homoRec} ${lo}${lo}` : null,
  ].filter(Boolean).join(' : ')

  const parentKeys: GenotypeKey[] = ['AA', 'Aa', 'aa']

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="font-bold text-white text-base">Genética Mendeliana — Quadrado de Punnett</h3>
          <p className="text-slate-400 text-xs mt-0.5">
            Escolha os genótipos dos pais e veja os cruzamentos possíveis
          </p>
        </div>
        {/* Allele selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Alelo:</span>
          <div className="flex gap-1">
            {ALLELE_OPTIONS.map(a => (
              <button
                key={a}
                onClick={() => setAllele(a)}
                className="w-8 h-8 rounded-lg text-sm font-bold font-mono transition-all duration-150"
                style={{
                  background: allele === a ? '#7c2d12' : '#1e293b',
                  color: allele === a ? '#fdba74' : '#64748b',
                  border: `1.5px solid ${allele === a ? '#c2410c' : '#334155'}`,
                }}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Parent selectors + organism visualization */}
      <div className="bg-slate-900/80 rounded-3xl border border-slate-700/60 p-5">
        <div className="flex items-center justify-center gap-4 flex-wrap">

          {/* Parent 1 */}
          <div className="flex flex-col items-center gap-2">
            <ParentCircle genotype={p1Key} allele={allele} label="Pai 1" />
            <select
              value={p1Key}
              onChange={e => setP1Key(e.target.value as GenotypeKey)}
              className="text-xs rounded-lg px-2 py-1 bg-slate-800 border border-slate-700 text-slate-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              {parentKeys.map(k => (
                <option key={k} value={k}>{PARENTS[k].label}</option>
              ))}
            </select>
          </div>

          {/* Connector */}
          <div className="flex flex-col items-center gap-1 pb-8">
            <div className="w-10 h-0.5 bg-slate-600" />
            <span className="text-slate-600 text-xs">×</span>
          </div>

          {/* Parent 2 */}
          <div className="flex flex-col items-center gap-2">
            <ParentCircle genotype={p2Key} allele={allele} label="Pai 2" />
            <select
              value={p2Key}
              onChange={e => setP2Key(e.target.value as GenotypeKey)}
              className="text-xs rounded-lg px-2 py-1 bg-slate-800 border border-slate-700 text-slate-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              {parentKeys.map(k => (
                <option key={k} value={k}>{PARENTS[k].label}</option>
              ))}
            </select>
          </div>

          {/* Arrow */}
          <div className="text-slate-600 text-2xl pb-8 select-none">→</div>

          {/* Punnett grid */}
          <div>
            <p className="text-xs text-slate-500 text-center mb-2 font-medium tracking-wide uppercase">
              Descendentes
            </p>
            <PunnettGrid grid={grid} gametes1={gametes1} gametes2={gametes2} />
          </div>
        </div>
      </div>

      {/* Results panel */}
      <div className="bg-slate-950 rounded-2xl p-4 border border-white/5 space-y-4">

        {/* Phenotype ratio */}
        <div className="text-center">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            Razão Fenotípica
          </p>
          <div className="text-xl font-bold text-slate-200">{ratioStr}</div>
        </div>

        {/* Probability bars */}
        <div className="space-y-2">
          {domCount > 0 && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-orange-400 font-medium">Fenótipo Dominante</span>
                <span className="text-slate-300 font-mono">{domCount}/4 = {pctDom}%</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pctDom}%`,
                    background: 'linear-gradient(90deg, #c2410c, #f97316)',
                  }}
                />
              </div>
            </div>
          )}
          {recCount > 0 && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-sky-400 font-medium">Fenótipo Recessivo</span>
                <span className="text-slate-300 font-mono">{recCount}/4 = {pctRec}%</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pctRec}%`,
                    background: 'linear-gradient(90deg, #0369a1, #38bdf8)',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Genotype counts */}
        <div className="pt-1 border-t border-white/5">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            Razão Genotípica
          </p>
          <p className="font-mono text-sm text-slate-300 text-center">{genoRatioStr}</p>
          <div className="flex justify-center gap-5 mt-2 flex-wrap">
            {homoDom > 0 && (
              <div className="text-center">
                <div className="text-lg font-bold text-orange-400 font-mono">{homoDom}/4</div>
                <div className="text-xs text-slate-500">{allele}{allele} (hom. dom.)</div>
              </div>
            )}
            {hetero > 0 && (
              <div className="text-center">
                <div className="text-lg font-bold text-amber-400 font-mono">{hetero}/4</div>
                <div className="text-xs text-slate-500">{allele}{lo} (hetero.)</div>
              </div>
            )}
            {homoRec > 0 && (
              <div className="text-center">
                <div className="text-lg font-bold text-sky-400 font-mono">{homoRec}/4</div>
                <div className="text-xs text-slate-500">{lo}{lo} (hom. rec.)</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Insight card */}
      <div className="rounded-2xl p-4 border border-slate-700/50 bg-slate-900/50">
        <p className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">
          Como ler o quadrado
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          Cada célula do quadrado representa um descendente possível com igual probabilidade (25%).
          Células <span className="font-bold text-orange-400">alaranjadas</span> expressam o fenótipo
          dominante (ao menos um alelo {allele} maiúsculo).{' '}
          Células <span className="font-bold text-sky-400">azuis</span> expressam o fenótipo recessivo
          (dois alelos {lo} minúsculos). A lei de Mendel pressupõe alelos sem dominância incompleta.
        </p>
      </div>
    </div>
  )
}
