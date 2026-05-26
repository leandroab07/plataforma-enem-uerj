import { useState } from 'react'

// Circuit layout constants
const CX = 30, CY = 30, CW = 260, CH = 160

// Rectangle corners (top-left clockwise)
const TL = { x: CX,       y: CY }
const TR = { x: CX + CW,  y: CY }
const BR = { x: CX + CW,  y: CY + CH }
const BL = { x: CX,       y: CY + CH }

// Perimeter as a closed SVG path used for animateMotion
const CIRCUIT_PATH =
  `M ${TL.x},${TL.y} L ${TR.x},${TR.y} L ${BR.x},${BR.y} L ${BL.x},${BL.y} Z`

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}

// Map current I (0–24 A) → wire stroke color blue → orange → red
function wireColor(I: number): string {
  const t = clamp(I / 10, 0, 1)
  if (t < 0.5) {
    // blue → orange
    const u = t / 0.5
    const r = Math.round(59  + u * (251 - 59))
    const g = Math.round(130 + u * (146 - 130))
    const b = Math.round(246 + u * (14  - 246))
    return `rgb(${r},${g},${b})`
  } else {
    // orange → red
    const u = (t - 0.5) / 0.5
    const r = Math.round(251 + u * (239 - 251))
    const g = Math.round(146 + u * (68  - 146))
    const b = Math.round(14  + u * (68  - 14))
    return `rgb(${r},${g},${b})`
  }
}

// Animated electron dots along the circuit path
function ElectronDots({ count, speed }: { count: number; speed: number }) {
  // Speed: duration in seconds (higher current = faster = lower duration)
  const dots = Array.from({ length: count }, (_, i) => {
    return (
      <circle key={i} r={3.5} fill="#a5f3fc" opacity={0.85}>
        <animateMotion
          dur={`${speed}s`}
          repeatCount="indefinite"
          begin={`${-(i / count) * speed}s`}
        >
          <mpath href="#ohm-circuit-path" />
        </animateMotion>
        <animate
          attributeName="opacity"
          values="0.5;1;0.5"
          dur={`${speed * 0.4}s`}
          begin={`${-(i / count) * speed * 0.4}s`}
          repeatCount="indefinite"
        />
      </circle>
    )
  })
  return <g>{dots}</g>
}

// Battery symbol on left wire
function Battery({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Long plate */}
      <line x1={-12} y1={-2} x2={12} y2={-2} stroke="#fbbf24" strokeWidth={3} strokeLinecap="round" />
      {/* Short plate */}
      <line x1={-7} y1={4} x2={7} y2={4} stroke="#fbbf24" strokeWidth={5} strokeLinecap="round" />
      {/* + and - */}
      <text x={-20} y={-4} fill="#fbbf24" fontSize={9} fontWeight="bold" textAnchor="middle">+</text>
      <text x={20} y={7} fill="#94a3b8" fontSize={9} fontWeight="bold" textAnchor="middle">−</text>
    </g>
  )
}

// Zigzag resistor on top wire
function Resistor({ cx, cy }: { cx: number; cy: number }) {
  // Horizontal zigzag
  const w = 44, h = 12
  const x0 = cx - w / 2
  const points = [
    `${x0},${cy}`,
    `${x0 + 4},${cy - h}`,
    `${x0 + 10},${cy + h}`,
    `${x0 + 16},${cy - h}`,
    `${x0 + 22},${cy + h}`,
    `${x0 + 28},${cy - h}`,
    `${x0 + 34},${cy + h}`,
    `${x0 + 40},${cy - h}`,
    `${x0 + 44},${cy}`,
  ].join(' ')
  return (
    <g>
      <polyline points={points} fill="none" stroke="#f97316" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
    </g>
  )
}

// Ammeter circle on right wire
function Ammeter({ x, y, I }: { x: number; y: number; I: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle r={14} fill="#1e293b" stroke="#38bdf8" strokeWidth={2} />
      <text x={0} y={-3} textAnchor="middle" fill="#38bdf8" fontSize={8} fontWeight="bold">A</text>
      <text x={0} y={8} textAnchor="middle" fill="#f1f5f9" fontSize={7} fontFamily="monospace">
        {I.toFixed(2)}A
      </text>
    </g>
  )
}

// Glowing light bulb
function LightBulb({ cx, cy, brightness }: { cx: number; cy: number; brightness: number }) {
  // brightness: 0-1
  const b = clamp(brightness, 0, 1)
  const glowR = 14 + b * 22
  const bulbColor = b < 0.1
    ? '#334155'
    : `rgb(${Math.round(251 - b * 10)},${Math.round(176 + b * 40)},${Math.round(12 + b * 20)})`
  const glowOpacity = b * 0.55

  return (
    <g transform={`translate(${cx},${cy})`}>
      {/* Outer glow */}
      {b > 0.05 && (
        <circle r={glowR} fill={bulbColor} opacity={glowOpacity} />
      )}
      {/* Bulb glass */}
      <circle r={12} fill={bulbColor} stroke="#475569" strokeWidth={1.5} />
      {/* Filament */}
      <path
        d="M -4,4 Q -4,-2 0,-2 Q 4,-2 4,4"
        fill="none"
        stroke={b > 0.1 ? '#fef3c7' : '#475569'}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      {/* Base */}
      <rect x={-5} y={10} width={10} height={5} rx={1} fill="#475569" />
      <rect x={-3} y={14} width={6} height={3} rx={1} fill="#334155" />
      {/* Label */}
      <text x={0} y={25} textAnchor="middle" fill="#94a3b8" fontSize={8} fontWeight="bold">
        lâmpada
      </text>
    </g>
  )
}

export default function IlustracaoOhm() {
  const [V, setV] = useState(12)
  const [R, setR] = useState(10)

  const I = V / R
  const P = V * V / R

  // Wire color based on current
  const wColor = wireColor(I)

  // Electron animation: more current = more dots, faster speed
  const dotCount = clamp(Math.round(I * 1.2), 2, 14)
  const dotSpeed = clamp(4.5 - I * 0.28, 0.9, 4.5)

  // Bulb brightness: P normalized (max ~576W at V=24,R=1)
  const maxP = 576
  const brightness = clamp(P / maxP, 0, 1)

  // Danger threshold
  const isDanger = I > 5

  // Battery position: midpoint of left wire
  const battX = BL.x
  const battY = (TL.y + BL.y) / 2

  // Resistor position: midpoint of top wire
  const resX = (TL.x + TR.x) / 2
  const resY = TL.y

  // Ammeter position: midpoint of right wire
  const ammX = TR.x
  const ammY = (TR.y + BR.y) / 2

  // Bulb position: below center of bottom wire
  const bulbX = (BL.x + BR.x) / 2
  const bulbY = BR.y + 38

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h3 className="font-bold text-white text-base">Circuito Elétrico — Lei de Ohm</h3>
        <p className="text-slate-400 text-xs mt-0.5">
          Ajuste tensão e resistência para ver a corrente e a luminosidade mudarem em tempo real
        </p>
      </div>

      {/* SVG Circuit */}
      <div className="bg-slate-900/80 rounded-3xl border border-slate-700/60 p-4 overflow-x-auto">
        <div className="flex justify-center">
          <svg
            viewBox={`0 0 ${CX * 2 + CW} ${CY * 2 + CH + 80}`}
            width="100%"
            style={{ maxWidth: 360 }}
            aria-label="Diagrama de circuito elétrico — Lei de Ohm"
          >
            <defs>
              {/* Hidden path for animateMotion */}
              <path id="ohm-circuit-path" d={CIRCUIT_PATH} fill="none" />
            </defs>

            {/* Wires — drawn as four segments so we can color them */}
            {/* Top wire (left half — before resistor) */}
            <line x1={TL.x} y1={TL.y} x2={resX - 26} y2={TL.y} stroke={wColor} strokeWidth={3} strokeLinecap="round" style={{ transition: 'stroke 0.4s' }} />
            {/* Top wire (right half — after resistor) */}
            <line x1={resX + 26} y1={TL.y} x2={TR.x} y2={TL.y} stroke={wColor} strokeWidth={3} strokeLinecap="round" style={{ transition: 'stroke 0.4s' }} />
            {/* Right wire (top half — before ammeter) */}
            <line x1={TR.x} y1={TR.y} x2={TR.x} y2={ammY - 16} stroke={wColor} strokeWidth={3} strokeLinecap="round" style={{ transition: 'stroke 0.4s' }} />
            {/* Right wire (bottom half — after ammeter) */}
            <line x1={TR.x} y1={ammY + 16} x2={BR.x} y2={BR.y} stroke={wColor} strokeWidth={3} strokeLinecap="round" style={{ transition: 'stroke 0.4s' }} />
            {/* Bottom wire */}
            <line x1={BL.x} y1={BL.y} x2={BR.x} y2={BR.y} stroke={wColor} strokeWidth={3} strokeLinecap="round" style={{ transition: 'stroke 0.4s' }} />
            {/* Left wire (top half — before battery) */}
            <line x1={TL.x} y1={TL.y} x2={BL.x} y2={battY - 12} stroke={wColor} strokeWidth={3} strokeLinecap="round" style={{ transition: 'stroke 0.4s' }} />
            {/* Left wire (bottom half — after battery) */}
            <line x1={BL.x} y1={battY + 12} x2={BL.x} y2={BL.y} stroke={wColor} strokeWidth={3} strokeLinecap="round" style={{ transition: 'stroke 0.4s' }} />

            {/* Electron dots */}
            <ElectronDots count={dotCount} speed={dotSpeed} />

            {/* Battery */}
            <Battery x={battX} y={battY} />
            {/* V label */}
            <text x={battX - 24} y={battY + 1} textAnchor="middle" fill="#fbbf24" fontSize={10} fontWeight="bold" dominantBaseline="middle">V</text>

            {/* Resistor */}
            <Resistor cx={resX} cy={resY} />
            {/* R label */}
            <text x={resX} y={resY - 18} textAnchor="middle" fill="#f97316" fontSize={10} fontWeight="bold">R</text>

            {/* Ammeter */}
            <Ammeter x={ammX} y={ammY} I={I} />

            {/* Wire to bulb (vertical from bottom wire midpoint) */}
            <line x1={bulbX} y1={BR.y} x2={bulbX} y2={bulbY - 14} stroke={wColor} strokeWidth={2} strokeDasharray="4 3" style={{ transition: 'stroke 0.4s' }} />

            {/* Light bulb */}
            <LightBulb cx={bulbX} cy={bulbY} brightness={brightness} />

            {/* Direction arrow hint */}
            <text x={resX + 60} y={TL.y - 8} fill="#64748b" fontSize={8} textAnchor="middle">→ corrente</text>
          </svg>
        </div>
      </div>

      {/* Live formula panel */}
      <div className="bg-slate-950 rounded-2xl p-4 border border-white/5">
        <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
          V = R × I
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <div className="text-center min-w-[56px]">
            <div className="text-2xl font-bold font-mono text-amber-400">{V}</div>
            <div className="text-xs text-slate-500">V (Tensão)</div>
          </div>
          <span className="text-slate-600 text-xl">=</span>
          <div className="text-center min-w-[56px]">
            <div className="text-2xl font-bold font-mono text-orange-400">{R}</div>
            <div className="text-xs text-slate-500">Ω (Resistência)</div>
          </div>
          <span className="text-slate-600 text-xl">×</span>
          <div className="text-center min-w-[56px]">
            <div className={`text-2xl font-bold font-mono ${isDanger ? 'text-red-400' : 'text-emerald-400'}`}>
              {I.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500">A (Corrente)</div>
          </div>
        </div>
        <div className="flex justify-center gap-6 mt-3 text-xs text-slate-500 font-mono">
          <span>P = <span className="text-sky-400 font-bold">{P.toFixed(1)} W</span></span>
          <span>I = V/R = <span className="text-slate-300">{V}/{R}</span></span>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-3">
        {/* Tensão */}
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="font-bold text-amber-400 font-mono text-sm">V</span>
              <span className="text-slate-400 text-xs ml-2">Tensão (Voltagem)</span>
            </div>
            <span className="font-mono font-bold text-white">{V} V</span>
          </div>
          <input
            type="range" min={1} max={24} step={1} value={V}
            onChange={e => setV(Number(e.target.value))}
            className="w-full h-2 cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-xs text-slate-600 mt-1">
            <span>1 V</span><span>24 V</span>
          </div>
        </div>

        {/* Resistência */}
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="font-bold text-orange-400 font-mono text-sm">R</span>
              <span className="text-slate-400 text-xs ml-2">Resistência</span>
            </div>
            <span className="font-mono font-bold text-white">{R} Ω</span>
          </div>
          <input
            type="range" min={1} max={50} step={1} value={R}
            onChange={e => setR(Number(e.target.value))}
            className="w-full h-2 cursor-pointer accent-orange-500"
          />
          <div className="flex justify-between text-xs text-slate-600 mt-1">
            <span>1 Ω (baixa resistência)</span><span>50 Ω</span>
          </div>
        </div>
      </div>

      {/* Danger / Insight card */}
      {isDanger ? (
        <div className="rounded-2xl p-4 border border-red-500/40 bg-red-950/30">
          <p className="text-xs font-bold uppercase tracking-wider mb-1 text-red-400">
            Atenção — Corrente Elevada
          </p>
          <p className="text-sm text-slate-200 leading-relaxed">
            A corrente está em{' '}
            <span className="font-bold text-red-300 font-mono">{I.toFixed(2)} A</span> — acima de 5 A.
            Circuitos domésticos tipicamente se protegem com disjuntores de 10–20 A.
            Uma corrente tão alta pode aquecer os fios e causar incêndios.
            Aumente a resistência ou reduza a tensão para operar com segurança.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl p-4 border border-sky-800/40 bg-sky-950/20">
          <p className="text-xs font-bold uppercase tracking-wider mb-1 text-sky-400">
            O que observar
          </p>
          <p className="text-sm text-slate-200 leading-relaxed">
            A corrente <span className="font-bold text-emerald-300 font-mono">I = {I.toFixed(2)} A</span> é
            diretamente proporcional à tensão e inversamente proporcional à resistência.
            A lâmpada consome <span className="font-bold text-sky-300 font-mono">P = {P.toFixed(1)} W</span>.
            Observe como os elétrons aceleram quando a resistência diminui ou a tensão aumenta.
          </p>
        </div>
      )}
    </div>
  )
}
