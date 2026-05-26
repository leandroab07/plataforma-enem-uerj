import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flame, ArrowRight, Zap, Target, Brain } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function entrar(e: React.FormEvent) {
    e.preventDefault()
    if (!isSupabaseConfigured) return
    setCarregando(true)
    setErro('')
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) setErro('E-mail ou senha incorretos.')
    else navigate('/dashboard')
    setCarregando(false)
  }

  async function registrar() {
    if (!isSupabaseConfigured || !email || !senha) return
    setCarregando(true)
    setErro('')
    const { error } = await supabase.auth.signUp({ email, password: senha })
    if (error) setErro(error.message)
    else navigate('/dashboard')
    setCarregando(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — hero */}
      <div className="hidden lg:flex lg:w-1/2 gradient-brand flex-col justify-between p-12 relative overflow-hidden">
        {/* Círculos decorativos */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white/5" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Flame size={20} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>
              Plataforma ENEM · UERJ
            </span>
          </div>

          <h1 className="text-5xl font-bold text-white leading-tight mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Estude de forma<br />
            <span className="text-orange-200">inteligente</span>
          </h1>
          <p className="text-white/80 text-lg leading-relaxed">
            Adaptativo, personalizado e baseado em ciência. O sistema aprende com você e sabe exatamente onde focar.
          </p>
        </div>

        <div className="relative space-y-4">
          {[
            { Icon: Target, title: 'Mastery adaptativo', desc: 'Seu domínio é calculado a cada resposta' },
            { Icon: Brain,  title: 'Teoria + Prática', desc: 'Aprenda o conceito antes de resolver questões' },
            { Icon: Zap,    title: 'Mapas conceituais', desc: 'Consolide o conhecimento de forma visual' },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={16} className="text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{title}</p>
                <p className="text-white/70 text-xs">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center">
              <Flame size={15} className="text-white" />
            </div>
            <span className="font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
              Plataforma ENEM · UERJ
            </span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            Bem-vindo de volta
          </h2>
          <p className="text-slate-500 text-sm mb-8">Entre na sua conta para continuar estudando.</p>

          {isSupabaseConfigured ? (
            <form onSubmit={entrar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                  placeholder="seu@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Senha</label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
              {erro && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{erro}</p>}
              <button
                type="submit"
                disabled={carregando}
                className="w-full py-3 gradient-brand text-white text-sm font-semibold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-shadow"
              >
                {carregando ? 'Entrando...' : <><span>Entrar</span><ArrowRight size={16} /></>}
              </button>
              <button
                type="button"
                onClick={registrar}
                disabled={carregando}
                className="w-full py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors"
              >
                Criar conta
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-sm text-orange-800">
                <strong>Modo demonstração</strong> — Supabase não configurado. O progresso é salvo localmente.
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-3 gradient-brand text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-shadow"
              >
                Entrar e explorar <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
