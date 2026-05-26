import { Link, useLocation } from 'react-router-dom'
import { BookOpen, LayoutDashboard, LogOut, Flame } from 'lucide-react'
import clsx from 'clsx'

interface Props {
  children: React.ReactNode
  demoMode?: boolean
}

const NAV = [
  { to: '/dashboard', label: 'Painel', Icon: LayoutDashboard },
  { to: '/pratica',   label: 'Praticar',  Icon: BookOpen },
]

export default function Layout({ children, demoMode }: Props) {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-slate-950 flex flex-col border-r border-slate-800">
        {/* Logo */}
        <div className="px-5 py-6">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center">
              <Flame size={16} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                Plataforma
              </p>
              <p className="text-slate-500 text-xs">ENEM · UERJ</p>
            </div>
          </div>
        </div>

        {demoMode && (
          <div className="mx-3 mb-3 px-3 py-2 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-400 text-xs">
            Modo demonstração
          </div>
        )}

        <nav className="flex-1 px-3 space-y-0.5">
          {NAV.map(({ to, label, Icon }) => {
            const active = pathname === to || (to !== '/dashboard' && pathname.startsWith(to))
            return (
              <Link
                key={to}
                to={to}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  active
                    ? 'bg-gradient-to-r from-orange-500/20 to-violet-500/20 text-white border border-orange-500/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white',
                )}
              >
                <Icon size={16} className={active ? 'text-orange-400' : ''} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 pb-5 border-t border-slate-800 pt-3 mt-3">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:bg-slate-800 hover:text-white transition-all"
          >
            <LogOut size={16} />
            Sair
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto min-h-screen">
        {children}
      </main>
    </div>
  )
}
