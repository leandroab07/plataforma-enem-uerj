import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
    if (error) {
      setErro('E-mail ou senha incorretos.')
    } else {
      navigate('/dashboard')
    }
    setCarregando(false)
  }

  async function registrar() {
    if (!isSupabaseConfigured || !email || !senha) return
    setCarregando(true)
    setErro('')
    const { error } = await supabase.auth.signUp({ email, password: senha })
    if (error) {
      setErro(error.message)
    } else {
      navigate('/dashboard')
    }
    setCarregando(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Plataforma ENEM · UERJ</h1>
          <p className="text-slate-500 mt-1 text-sm">Estudo adaptativo para Medicina</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          {isSupabaseConfigured ? (
            <form onSubmit={entrar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="seu@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              {erro && <p className="text-sm text-red-600">{erro}</p>}

              <button
                type="submit"
                disabled={carregando}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {carregando ? 'Entrando...' : 'Entrar'}
              </button>

              <button
                type="button"
                onClick={registrar}
                disabled={carregando}
                className="w-full py-2.5 bg-white hover:bg-slate-50 border border-slate-300 disabled:opacity-50 text-slate-700 text-sm font-medium rounded-lg transition-colors"
              >
                Criar conta
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
                Supabase não configurado. Usando modo demonstração com dados locais.
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Entrar em modo demonstração
              </button>
            </div>
          )}
        </div>

        {isSupabaseConfigured && (
          <p className="text-center mt-4 text-xs text-slate-400">
            Sem conta? Clique em "Criar conta" acima.
          </p>
        )}
      </div>
    </div>
  )
}
