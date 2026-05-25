import { Link, useLocation } from 'react-router-dom'
import { BookOpen, LayoutDashboard, LogOut } from 'lucide-react'
import clsx from 'clsx'

interface Props {
  children: React.ReactNode
  demoMode?: boolean
}

const NAV = [
  { to: '/dashboard', label: 'Painel', Icon: LayoutDashboard },
  { to: '/pratica', label: 'Praticar', Icon: BookOpen },
]

export default function Layout({ children, demoMode }: Props) {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-slate-900 flex flex-col">
        <div className="px-5 py-6 border-b border-slate-700">
          <p className="font-bold text-white text-lg leading-tight">Plataforma</p>
          <p className="text-slate-400 text-xs mt-0.5">ENEM · UERJ</p>
        </div>

        {demoMode && (
          <div className="mx-3 mt-3 px-2 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded text-amber-400 text-xs">
            Modo demonstração
          </div>
        )}

        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV.map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              className={clsx(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname.startsWith(to)
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white',
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-3 pb-5">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut size={16} />
            Sair
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
