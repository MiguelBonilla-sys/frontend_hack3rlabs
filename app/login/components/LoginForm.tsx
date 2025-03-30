'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // En una aplicación real, aquí se haría la petición al backend
      // Simulamos una verificación simple
      if (email === 'admin@example.com' && password === 'password') {
        // Simulamos el delay de la petición
        await new Promise(resolve => setTimeout(resolve, 1000))
        // Redirigir a la página principal tras login exitoso
        router.push('/')
      } else {
        setError('Credenciales incorrectas. Por favor, verifica e intenta nuevamente.')
      }
    } catch {
      setError('Ocurrió un error al intentar ingresar. Por favor, intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4 pt-16">
      <div className="w-full max-w-md relative mt-12">
        {/* Elementos decorativos */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-highlight/20 rounded-full blur-3xl z-0"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-cyan-400/20 rounded-full blur-3xl z-0"></div>
        
        {/* Contenedor principal con efecto glassmorphism */}
        <div className="relative z-10 backdrop-blur-lg bg-primary/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {/* Línea decorativa superior */}
          <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600"></div>
          
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center mb-2 font-tech tracking-wide text-white">Iniciar Sesión</h2>
            <p className="text-center text-gray-300 text-sm mb-8">Accede a tu cuenta de H4ck3r L4bs</p>
            
            {error && (
              <div className="bg-red-900/30 border border-red-500/50 text-white px-4 py-3 rounded-lg mb-6 flex items-center text-sm animate-fade-in">
                <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-background border border-border/50 focus:border-highlight focus:ring-1 focus:ring-highlight transition-all duration-200 focus:outline-none"
                    required
                    placeholder="admin@ejemplo.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-background border border-border/50 focus:border-highlight focus:ring-1 focus:ring-highlight transition-all duration-200 focus:outline-none"
                    required
                    placeholder="••••••••••"
                  />
                </div>
                <div className="flex items-center justify-end">
                  <Link href="#" className="text-sm text-highlight hover:text-cyan-400 transition-colors">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 rounded-lg font-medium text-white relative overflow-hidden group ${
                    isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600'
                  }`}
                >
                  <span className="absolute top-0 left-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></span>
                  <span className="relative flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Iniciando sesión...
                      </>
                    ) : (
                      <>
                        Iniciar Sesión
                        <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-300 text-sm">
                ¿No tienes una cuenta?{' '}
                <Link href="#" className="text-highlight font-medium hover:text-cyan-400 transition-colors">
                  Contacta con el administrador
                </Link>
              </p>
            </div>
          </div>
          
          <div className="bg-background/80 p-4 border-t border-border/40">
            <p className="text-center text-xs text-gray-400">
              Este sistema es de uso exclusivo para miembros de H4ck3rs L4b.
              <br />
              El acceso no autorizado está prohibido.
            </p>
          </div>
        </div>
      </div>

      {/* Estilos para animaciones */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
} 