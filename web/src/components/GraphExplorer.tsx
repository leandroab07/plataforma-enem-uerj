import { useEffect, useRef, useState, useCallback } from 'react'
import type { GraphConfig } from '../lib/graph-data'

interface Props { config: GraphConfig }

const W = 480
const H = 340
const PAD = 40

function lerp(v: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  return ((v - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin
}

export default function GraphExplorer({ config }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [params, setParams] = useState<Record<string, number>>(
    Object.fromEntries(config.params.map((p) => [p.key, p.default]))
  )
  const [mouseX, setMouseX] = useState<number | null>(null)

  const [xMin, xMax] = config.xRange ?? [-10, 10]
  const [yMin, yMax] = config.yRange ?? [-10, 10]

  const toCanvasX = useCallback((mx: number) => lerp(mx, xMin, xMax, PAD, W - PAD), [xMin, xMax])
  const toCanvasY = useCallback((my: number) => lerp(my, yMax, yMin, PAD, H - PAD), [yMin, yMax])
  const toMathX   = useCallback((cx: number) => lerp(cx, PAD, W - PAD, xMin, xMax), [xMin, xMax])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, W, H)

    // Background
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, W, H)

    // Grid
    ctx.strokeStyle = '#1e293b'
    ctx.lineWidth = 1
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
      const cx = toCanvasX(x)
      ctx.beginPath(); ctx.moveTo(cx, PAD); ctx.lineTo(cx, H - PAD); ctx.stroke()
    }
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
      const cy = toCanvasY(y)
      ctx.beginPath(); ctx.moveTo(PAD, cy); ctx.lineTo(W - PAD, cy); ctx.stroke()
    }

    // Axes
    ctx.strokeStyle = '#334155'
    ctx.lineWidth = 1.5
    const ox = toCanvasX(0), oy = toCanvasY(0)
    ctx.beginPath(); ctx.moveTo(PAD, oy); ctx.lineTo(W - PAD, oy); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(ox, PAD); ctx.lineTo(ox, H - PAD); ctx.stroke()

    // Axis labels
    ctx.fillStyle = '#475569'
    ctx.font = '10px monospace'
    ctx.textAlign = 'center'
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x += 2) {
      if (x === 0) continue
      ctx.fillText(String(x), toCanvasX(x), oy + 14)
    }
    ctx.textAlign = 'right'
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y += 2) {
      if (y === 0) continue
      ctx.fillText(String(y), ox - 5, toCanvasY(y) + 4)
    }
    ctx.textAlign = 'center'
    ctx.fillStyle = '#64748b'
    ctx.fillText('x', W - PAD + 10, oy + 4)
    ctx.textAlign = 'right'
    ctx.fillText('y', ox + 4, PAD - 8)

    // Function curve — gradient orange → violet
    const grad = ctx.createLinearGradient(PAD, 0, W - PAD, 0)
    grad.addColorStop(0, '#f97316')
    grad.addColorStop(1, '#7c3aed')
    ctx.strokeStyle = grad
    ctx.lineWidth = 2.5
    ctx.lineJoin = 'round'
    ctx.beginPath()
    let started = false
    const steps = 500
    for (let i = 0; i <= steps; i++) {
      const mx = xMin + (i / steps) * (xMax - xMin)
      const my = config.fn(mx, params)
      if (!isFinite(my) || my < yMin - 50 || my > yMax + 50) { started = false; continue }
      const cx = toCanvasX(mx), cy = toCanvasY(my)
      if (!started) { ctx.moveTo(cx, cy); started = true } else { ctx.lineTo(cx, cy) }
    }
    ctx.stroke()

    // Mouse crosshair
    if (mouseX !== null) {
      const mx = toMathX(mouseX)
      if (mx >= xMin && mx <= xMax) {
        const my = config.fn(mx, params)
        const cx = toCanvasX(mx), cy = toCanvasY(my)
        if (isFinite(my) && my >= yMin && my <= yMax) {
          ctx.strokeStyle = 'rgba(255,255,255,0.15)'
          ctx.lineWidth = 1
          ctx.setLineDash([4, 4])
          ctx.beginPath(); ctx.moveTo(cx, PAD); ctx.lineTo(cx, H - PAD); ctx.stroke()
          ctx.beginPath(); ctx.moveTo(PAD, cy); ctx.lineTo(W - PAD, cy); ctx.stroke()
          ctx.setLineDash([])

          // Tooltip bubble
          ctx.fillStyle = 'rgba(15,23,42,0.9)'
          const txt = `(${mx.toFixed(1)}, ${my.toFixed(2)})`
          const tw = ctx.measureText(txt).width + 16
          let tx = cx + 8, ty = cy - 28
          if (tx + tw > W - 4) tx = cx - tw - 8
          if (ty < 4) ty = cy + 12
          ctx.beginPath()
          ctx.roundRect(tx, ty, tw, 22, 6)
          ctx.fill()
          ctx.fillStyle = '#e2e8f0'
          ctx.font = '11px monospace'
          ctx.textAlign = 'left'
          ctx.fillText(txt, tx + 8, ty + 15)

          // Point dot
          ctx.fillStyle = '#fff'
          ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill()
        }
      }
    }

    // Key points
    config.keyPoints?.forEach((kp) => {
      const pt = kp.compute(params)
      if (!pt || !isFinite(pt.x) || !isFinite(pt.y)) return
      if (pt.y < yMin || pt.y > yMax) return
      const cx = toCanvasX(pt.x), cy = toCanvasY(pt.y)

      ctx.fillStyle = kp.cor
      ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#fff'
      ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill()

      const lbl = `${kp.label}: (${pt.x.toFixed(1)}, ${pt.y.toFixed(1)})`
      const tw2 = ctx.measureText(lbl).width + 12
      ctx.fillStyle = kp.cor + 'cc'
      let lx = cx + 10, ly = cy - 10
      if (lx + tw2 > W - 4) lx = cx - tw2 - 10
      ctx.beginPath(); ctx.roundRect(lx, ly - 14, tw2, 18, 4); ctx.fill()
      ctx.fillStyle = '#fff'
      ctx.font = '10px monospace'
      ctx.textAlign = 'left'
      ctx.fillText(lbl, lx + 6, ly)
    })
  }, [config, params, mouseX, toCanvasX, toCanvasY, toMathX, xMin, xMax, yMin, yMax])

  useEffect(() => { draw() }, [draw])

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current!.getBoundingClientRect()
    const scaleX = W / rect.width
    const cx = (e.clientX - rect.left) * scaleX
    setMouseX(cx)
  }

  return (
    <div className="space-y-5">
      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="w-full block cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setMouseX(null)}
        />
        {/* Formula overlay */}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-700">
          <span className="text-sm font-mono font-bold gradient-brand-text">
            {config.formula(params)}
          </span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {config.params.map((p) => (
          <div key={p.key} className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
            <div className="flex justify-between items-baseline mb-2">
              <div>
                <span className="font-mono font-bold text-orange-400 text-sm">{p.label}</span>
                <span className="text-slate-500 text-xs ml-2">{p.descricao}</span>
              </div>
              <span className="font-mono text-white font-bold text-lg">{params[p.key]}</span>
            </div>
            <input
              type="range"
              min={p.min}
              max={p.max}
              step={p.step}
              value={params[p.key]}
              onChange={(e) =>
                setParams((prev) => ({ ...prev, [p.key]: Number(e.target.value) }))
              }
              className="w-full accent-orange-500 cursor-pointer h-2"
            />
            <div className="flex justify-between text-xs text-slate-600 mt-1">
              <span>{p.min}</span>
              <span>{p.max}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Dicas */}
      <div className="bg-gradient-to-r from-orange-500/10 to-violet-500/10 border border-orange-500/20 rounded-2xl p-4">
        <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-2">💡 Experimente</p>
        <ul className="space-y-1">
          {config.dicas.map((d, i) => (
            <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
              <span className="text-orange-500 mt-0.5 shrink-0">→</span> {d}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
