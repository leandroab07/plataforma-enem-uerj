import clsx from 'clsx'
import type { Status } from '../lib/types'
import { statusBg } from '../lib/mastery'

interface Props {
  score: number
  status: Status
  showLabel?: boolean
}

export default function MasteryBar({ score, status, showLabel }: Props) {
  const pct = Math.round(score * 100)

  return (
    <div className="w-full">
      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all duration-500', statusBg(status))}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-slate-500 mt-1">{pct}% domínio</p>
      )}
    </div>
  )
}
