import { useState } from 'react'

const SOLUCOES = [
  { nome: 'CuSO₄', descricao: 'Sulfato de Cobre — azul', cor: [29, 78, 216] as [number,number,number], claro: [219, 234, 254] as [number,number,number] },
  { nome: 'KMnO₄', descricao: 'Permanganato de Potássio — roxo', cor: [109, 40, 217] as [number,number,number], claro: [237, 233, 254] as [number,number,number] },
  { nome: 'K₂Cr₂O₇', descricao: 'Dicromato de Potássio — laranja', cor: [194, 65, 12] as [number,number,number], claro: [254, 215, 170] as [number,number,number] },
  { nome: 'CrO₄²⁻', descricao: 'Cromato de Potássio — amarelo', cor: [133, 77, 14] as [number,number,number], claro: [254, 240, 138] as [number,number,number] },
]

function lerp(a: [number,number,number], b: [number,number,number], t: number): string {
  return `rgb(${Math.round(a[0]+(b[0]-a[0])*t)},${Math.round(a[1]+(b[1]-a[1])*t)},${Math.round(a[2]+(b[2]-a[2])*t)})`
}

interface BeakerProps {
  uid: string
  fillPct: number
  color: string
  conc: number
  volume: number
  label: string
  tilted?: boolean
}

function Beaker({ uid, fillPct, color, conc, volume, label, tilted = false }: BeakerProps) {
  const BW = 110, BH = 145, BX = 22, BY = 18
  const pct = Math.min(1, Math.max(0, fillPct))
  const liqH = BH * pct
  const liqY = BY + BH - liqH
  const clipId = `bc-${uid}`
  const gradId = `bg-${uid}`

  const nDots = Math.min(38, Math.round(conc * 8))
  const dots = Array.from({ length: nDots }, (_, i) => ({
    x: BX + 6 + ((i * 41 + 3) % (BW - 12)),
    y: liqY + 5 + ((i * 29 + 7) % Math.max(5, liqH - 10)),
  }))

  const marks = [50, 100, 150, 200, 250, 300, 350]

  return (
    <div
      style={{
        transform: tilted ? 'rotate(-30deg) translateY(-15px)' : 'rotate(0deg) translateY(0px)',
        transformOrigin: '50% 90%',
        transition: 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)',
        cursor: 'pointer',
      }}
    >
      <svg viewBox="0 0 160 240" width={130} height={205}>
        <defs>
          <clipPath id={clipId}>
            <path d={`M ${BX} ${BY + BH} Q ${BX} ${BY+BH+14} ${BX+13} ${BY+BH+14} L ${BX+BW-13} ${BY+BH+14} Q ${BX+BW} ${BY+BH+14} ${BX+BW} ${BY+BH} L ${BX+BW} ${BY} L ${BX} ${BY} Z`} />
          </clipPath>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
            <stop offset="35%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
          </linearGradient>
          <filter id={`shadow-${uid}`}>
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Beaker glass body */}
        <path
          d={`M ${BX} ${BY+BH} Q ${BX} ${BY+BH+14} ${BX+13} ${BY+BH+14} L ${BX+BW-13} ${BY+BH+14} Q ${BX+BW} ${BY+BH+14} ${BX+BW} ${BY+BH} L ${BX+BW} ${BY} L ${BX} ${BY} Z`}
          fill="rgba(148,163,184,0.06)"
          stroke="#475569"
          strokeWidth="2.5"
          strokeLinejoin="round"
          filter={`url(#shadow-${uid})`}
        />

        {/* Inner wall reflection (glass thickness) */}
        <path
          d={`M ${BX+5} ${BY+BH-5} Q ${BX+5} ${BY+BH+9} ${BX+17} ${BY+BH+9} L ${BX+BW-17} ${BY+BH+9} Q ${BX+BW-5} ${BY+BH+9} ${BX+BW-5} ${BY+BH-5} L ${BX+BW-5} ${BY+5} L ${BX+5} ${BY+5} Z`}
          fill="none"
          stroke="rgba(148,163,184,0.18)"
          strokeWidth="1"
        />

        {/* Top rim */}
        <rect x={BX-6} y={BY-7} width={BW+12} height={9} rx={3} fill="#334155" stroke="#475569" strokeWidth="1" />

        {/* Spout (pour lip) */}
        <path d={`M ${BX+BW+6} ${BY-7} Q ${BX+BW+12} ${BY-16} ${BX+BW+20} ${BY-20}`} stroke="#334155" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d={`M ${BX+BW+6} ${BY-7} Q ${BX+BW+12} ${BY-16} ${BX+BW+20} ${BY-20}`} stroke="#475569" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Graduation marks */}
        {marks.map((ml) => {
          const my = BY + BH - (ml / 400) * BH
          const isMain = ml % 100 === 0
          return (
            <g key={ml}>
              <line x1={BX+BW} y1={my} x2={BX+BW+(isMain?11:6)} y2={my} stroke={isMain ? '#475569' : '#334155'} strokeWidth={isMain ? 1.5 : 1} />
              {isMain && (
                <text x={BX+BW+14} y={my+3.5} fill="#475569" fontSize="7.5" fontFamily="monospace">{ml}</text>
              )}
            </g>
          )
        })}

        {/* Liquid fill */}
        {liqH > 1 && (
          <>
            <rect x={BX} y={liqY} width={BW} height={liqH+14} fill={color} opacity={0.9} clipPath={`url(#${clipId})`} />
            {/* Shading overlay */}
            <rect x={BX} y={liqY} width={BW} height={liqH+14} fill={`url(#${gradId})`} clipPath={`url(#${clipId})`} />
            {/* Surface wave */}
            <path
              d={`M ${BX},${liqY} Q ${BX+BW*0.28},${liqY-3.5} ${BX+BW*0.56},${liqY} Q ${BX+BW*0.78},${liqY+3.5} ${BX+BW},${liqY} L ${BX+BW},${liqY+5} Q ${BX+BW*0.78},${liqY+1.5} ${BX+BW*0.56},${liqY+5} Q ${BX+BW*0.28},${liqY+8.5} ${BX},${liqY+5} Z`}
              fill="rgba(255,255,255,0.28)"
              clipPath={`url(#${clipId})`}
            />
          </>
        )}

        {/* Glass glare */}
        <line x1={BX+7} y1={BY+8} x2={BX+7} y2={BY+BH-8} stroke="rgba(255,255,255,0.2)" strokeWidth="6" strokeLinecap="round" />
        <line x1={BX+16} y1={BY+10} x2={BX+16} y2={BY+40} stroke="rgba(255,255,255,0.1)" strokeWidth="3" strokeLinecap="round" />

        {/* Molecule dots */}
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={2.8} fill="white" opacity={0.65} clipPath={`url(#${clipId})`} />
        ))}

        {/* Label */}
        <text x={BX+BW/2} y={BY+BH+30} textAnchor="middle" fill="#cbd5e1" fontSize="10" fontWeight="bold" fontFamily="system-ui">{label}</text>
        <text x={BX+BW/2} y={BY+BH+44} textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">
          {volume.toFixed(0)} mL
        </text>
      </svg>
    </div>
  )
}

// Animated water drops streaming between beakers
function WaterStream({ active, color }: { active: boolean; color: string }) {
  if (!active) return null
  return (
    <div className="flex flex-col items-center gap-1 overflow-hidden h-16">
      {[0,1,2,3].map(i => (
        <div
          key={i}
          className="w-2 h-2 rounded-full opacity-80"
          style={{
            background: color,
            animation: `fall 0.6s linear ${i * 0.15}s infinite`,
          }}
        />
      ))}
      <style>{`@keyframes fall { 0%{transform:translateY(-8px);opacity:0} 50%{opacity:1} 100%{transform:translateY(20px);opacity:0} }`}</style>
    </div>
  )
}

export default function IlustracaoSolucoes() {
  const [c1, setC1] = useState(2.0)
  const [v1, setV1] = useState(100)
  const [v2, setV2] = useState(300)
  const [solIdx, setSolIdx] = useState(0)
  const [tilted, setTilted] = useState(false)

  const sol = SOLUCOES[solIdx]
  const c2 = v2 > 0 ? (c1 * v1) / v2 : 0
  const maxVol = 400
  const mols = (c1 * v1 / 1000)
  const fatorDiluicao = v2 / v1

  function getColor(conc: number): string {
    const t = Math.min(1, conc / 3.5)
    return lerp(sol.claro, sol.cor, t)
  }

  function handlePour() {
    if (tilted) return
    setTilted(true)
    setTimeout(() => setTilted(false), 1600)
  }

  return (
    <div className="space-y-5">

      {/* Header + solução selector */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="font-bold text-white text-base">🧪 Laboratório Virtual — Diluição de Soluções</h3>
          <p className="text-slate-400 text-xs mt-0.5">Mova os sliders ou clique no beaker para diluir</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Solução:</span>
          <div className="flex gap-2">
            {SOLUCOES.map((s, i) => (
              <button
                key={i}
                onClick={() => setSolIdx(i)}
                title={s.descricao}
                className="w-6 h-6 rounded-full border-2 transition-all duration-200 hover:scale-110"
                style={{
                  background: `rgb(${s.cor[0]},${s.cor[1]},${s.cor[2]})`,
                  borderColor: i === solIdx ? '#fff' : 'transparent',
                  transform: i === solIdx ? 'scale(1.25)' : 'scale(1)',
                  boxShadow: i === solIdx ? '0 0 8px rgba(255,255,255,0.4)' : 'none',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs font-medium px-2 py-1 rounded-lg inline-block" style={{
        background: `rgba(${sol.cor[0]},${sol.cor[1]},${sol.cor[2]},0.15)`,
        color: `rgb(${sol.cor[0]},${sol.cor[1]},${sol.cor[2]})`,
        border: `1px solid rgba(${sol.cor[0]},${sol.cor[1]},${sol.cor[2]},0.3)`,
      }}>
        {sol.descricao}
      </p>

      {/* Beaker scene */}
      <div className="bg-slate-900/80 rounded-3xl border border-slate-700/80 p-5 overflow-x-auto">
        <div className="flex items-end justify-center gap-4 min-w-[320px]">

          {/* Beaker A */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-slate-400 mb-1 tracking-wider">INICIAL</span>
            <div onClick={handlePour}>
              <Beaker uid="a" fillPct={v1/maxVol} color={getColor(c1)} conc={c1} volume={v1} label="Beaker A" tilted={tilted} />
            </div>
            <div className="mt-1 text-center">
              <div className="text-sm font-bold font-mono" style={{ color: getColor(Math.max(c1, 0.5)) }}>
                C₁ = {c1.toFixed(2)}
              </div>
              <div className="text-xs text-slate-500">mol/L</div>
            </div>
          </div>

          {/* Center: arrow + stream + button */}
          <div className="flex flex-col items-center gap-2 pb-14">
            <WaterStream active={tilted} color={getColor(c1)} />
            <button
              onClick={handlePour}
              disabled={tilted}
              className="flex flex-col items-center gap-1 group disabled:opacity-60"
            >
              <div className="text-xl transition-transform group-hover:scale-125 group-active:scale-95">
                {tilted ? '💧' : '⟶'}
              </div>
              <span className="text-xs text-slate-500 group-hover:text-orange-400 transition-colors font-medium">
                {tilted ? 'diluindo…' : 'Diluir'}
              </span>
            </button>
            {!tilted && (
              <div className="text-xs text-slate-600 text-center leading-tight">
                +{Math.max(0, v2 - v1)}<br/>mL H₂O
              </div>
            )}
          </div>

          {/* Beaker B */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-slate-400 mb-1 tracking-wider">DILUÍDA</span>
            <Beaker uid="b" fillPct={v2/maxVol} color={getColor(c2)} conc={c2} volume={v2} label="Beaker B" />
            <div className="mt-1 text-center">
              <div className="text-sm font-bold font-mono text-emerald-400">
                C₂ = {c2.toFixed(3)}
              </div>
              <div className="text-xs text-slate-500">mol/L</div>
            </div>
          </div>
        </div>

        {/* Formula live display */}
        <div className="mt-5 bg-slate-950 rounded-2xl p-4 border border-white/5">
          <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Lei de Diluição — C₁V₁ = C₂V₂</p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {[
              { label: 'C₁', val: c1.toFixed(2), unit: 'mol/L', highlight: true },
              { label: '×', val: '', unit: '' },
              { label: 'V₁', val: v1.toString(), unit: 'mL', highlight: true },
              { label: '=', val: '', unit: '' },
              { label: 'C₂', val: c2.toFixed(3), unit: 'mol/L', highlight: false },
              { label: '×', val: '', unit: '' },
              { label: 'V₂', val: v2.toString(), unit: 'mL', highlight: false },
            ].map((item, i) =>
              item.val === '' ? (
                <span key={i} className="text-slate-600 text-xl font-light">{item.label}</span>
              ) : (
                <div key={i} className="text-center min-w-[52px]">
                  <div className={`text-xl font-bold font-mono ${item.highlight ? 'text-orange-400' : 'text-emerald-400'}`}>
                    {item.val}
                  </div>
                  <div className="text-xs text-slate-500">{item.label} ({item.unit})</div>
                </div>
              )
            )}
          </div>
          <div className="text-center mt-3 font-mono text-xs text-slate-600">
            {(c1 * v1).toFixed(2)} mmol = {(c2 * v2).toFixed(2)} mmol ✓ · fator {fatorDiluicao.toFixed(1)}× · {mols.toFixed(4)} mol conservados
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-3">
        {/* C1 */}
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="font-bold text-orange-400 font-mono text-sm">C₁</span>
              <span className="text-slate-400 text-xs ml-2">concentração inicial</span>
            </div>
            <span className="font-mono font-bold text-white">{c1.toFixed(1)} mol/L</span>
          </div>
          <input type="range" min={0.1} max={4} step={0.1} value={c1}
            onChange={e => setC1(Number(e.target.value))}
            className="w-full h-2 cursor-pointer accent-orange-500" />
          <div className="flex justify-between text-xs text-slate-600 mt-1">
            <span>0.1 (diluído)</span><span>4.0 mol/L (concentrado)</span>
          </div>
        </div>

        {/* V1 */}
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="font-bold text-orange-400 font-mono text-sm">V₁</span>
              <span className="text-slate-400 text-xs ml-2">volume inicial</span>
            </div>
            <span className="font-mono font-bold text-white">{v1} mL</span>
          </div>
          <input type="range" min={20} max={350} step={10} value={v1}
            onChange={e => { const n = Number(e.target.value); setV1(n); if (v2 < n) setV2(n) }}
            className="w-full h-2 cursor-pointer accent-orange-500" />
        </div>

        {/* V2 */}
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="font-bold text-sky-400 font-mono text-sm">V₂</span>
              <span className="text-slate-400 text-xs ml-2">volume final (após diluição)</span>
            </div>
            <span className="font-mono font-bold text-white">{v2} mL</span>
          </div>
          <input type="range" min={v1} max={maxVol} step={10} value={v2}
            onChange={e => setV2(Number(e.target.value))}
            className="w-full h-2 cursor-pointer accent-sky-500" />
          <div className="flex justify-between text-xs text-slate-600 mt-1">
            <span>V₁ = {v1} mL (sem diluição)</span>
            <span>fator {fatorDiluicao.toFixed(1)}×</span>
          </div>
        </div>
      </div>

      {/* Insight */}
      <div className="rounded-2xl p-4 border" style={{
        background: `linear-gradient(135deg, rgba(${sol.cor[0]},${sol.cor[1]},${sol.cor[2]},0.08), rgba(${sol.cor[0]},${sol.cor[1]},${sol.cor[2]},0.04))`,
        borderColor: `rgba(${sol.cor[0]},${sol.cor[1]},${sol.cor[2]},0.25)`,
      }}>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: `rgb(${sol.cor[0]},${sol.cor[1]},${sol.cor[2]})` }}>
          💡 O que observar
        </p>
        <p className="text-sm text-slate-200 leading-relaxed">
          Foram adicionados <span className="font-bold text-white">{Math.max(0, v2 - v1)} mL</span> de solvente.
          A concentração caiu de <span className="font-bold text-orange-400">{c1.toFixed(2)}</span> para{' '}
          <span className="font-bold text-emerald-400">{c2.toFixed(3)}</span> mol/L.
          O número de moléculas de soluto <span className="font-bold text-white">não muda</span> —
          apenas ficam mais espalhadas no volume maior.
          Mols de soluto: <span className="font-mono font-bold text-amber-300">{mols.toFixed(4)} mol</span>.
        </p>
      </div>
    </div>
  )
}
