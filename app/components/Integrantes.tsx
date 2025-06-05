'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { apiClient } from '@/lib/api'
import { Integrante } from '@/types/api'

export default function Integrantes() {
  const [integrantes, setIntegrantes] = useState<Integrante[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hover, setHover] = useState<number | null>(null)

  useEffect(() => {
    const fetchIntegrantes = async () => {
      try {
        setLoading(true)
        const data = await apiClient.getIntegrantes()
        // Filtrar solo integrantes activos
        const integrantesActivos = data.results.filter(integrante => integrante.estado)
        setIntegrantes(integrantesActivos)
      } catch (error) {
        console.error('Error fetching integrantes:', error)
        setError('Error al cargar los integrantes')
      } finally {
        setLoading(false)
      }
    }

    fetchIntegrantes()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-background to-background-light relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent">
              Nuestro Equipo
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-highlight to-accent mx-auto mb-6 rounded-full"></div>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Cargando nuestro equipo...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-highlight"></div>
          </div>
        </div>
      </section>
    )
  }

  if (error || integrantes.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-b from-background to-background-light relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent">
              Nuestro Equipo
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-highlight to-accent mx-auto mb-6 rounded-full"></div>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              {error || 'Próximamente conocerás a nuestro increíble equipo de expertos en ciberseguridad.'}
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-b from-background to-background-light relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute -left-20 -top-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl"></div>
      <div className="absolute right-0 bottom-0 w-60 h-60 bg-highlight/10 rounded-full blur-3xl"></div>
      <div className="absolute left-1/4 top-1/2 w-20 h-20 bg-orange/10 rounded-full blur-2xl"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent">
            Nuestro Equipo
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-highlight to-accent mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Conoce a los expertos detrás de H4ck3r L4bs, profesionales apasionados por la ciberseguridad y la educación en tecnología.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {integrantes.map((integrante) => (
            <div 
              key={integrante.idintegrantes}
              onMouseEnter={() => setHover(integrante.idintegrantes)}
              onMouseLeave={() => setHover(null)}
              className="bg-card rounded-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 group hover:shadow-xl hover:shadow-highlight/10"
            >
              <div className="relative h-60 overflow-hidden">
                <Image 
                  src={integrante.imagen || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'} 
                  alt={integrante.nombre_integrante}
                  fill={true}
                  className="transition-transform duration-500 group-hover:scale-110 object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent opacity-70"></div>
                
                {/* Overlay de GitHub */}
                <div className={`absolute inset-0 bg-primary/80 flex items-center justify-center transition-opacity duration-300 ${hover === integrante.idintegrantes ? 'opacity-100' : 'opacity-0'}`}>
                  {integrante.link_git && (
                    <a 
                      href={integrante.link_git} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-card rounded-full flex items-center justify-center text-highlight transition-transform duration-300 hover:scale-110 hover:bg-card-hover"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1 group-hover:text-highlight transition-colors duration-300">
                  {integrante.nombre_integrante}
                </h3>
                <p className="text-sm text-foreground/60 font-medium mb-3 border-b border-border pb-3">
                  {integrante.semestre}
                </p>
                <p className="text-sm text-foreground/80 mb-3">
                  {integrante.reseña}
                </p>
                <div className="flex items-center text-xs text-foreground/60">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  {integrante.correo}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-highlight text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-highlight/30 transform hover:-translate-y-1 hover:bg-highlight-dark">
            Únete a Nuestro Equipo
          </button>
        </div>
      </div>
    </section>
  )
} 