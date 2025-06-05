'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { apiClient } from '@/lib/api'
import { Curso } from '@/types/api'

export default function CursosContent() {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
  const [activeCategory, setActiveCategory] = useState('Todos');

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        setLoading(true)
        const data = await apiClient.getCursos()
        setCursos(data.results)
      } catch (error) {
        console.error('Error fetching cursos:', error)
        setError('Error al cargar los cursos')
      } finally {
        setLoading(false)
      }
    }

    fetchCursos()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-primary to-gray-800 py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Cursos de <span className="bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent">Formación</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Cargando cursos...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-highlight"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-primary to-gray-800 py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Cursos de <span className="bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent">Formación</span>
            </h1>
            <p className="text-lg text-red-400 max-w-3xl mx-auto">
              {error}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const openModal = (curso: Curso) => {
    setSelectedCurso(curso);
  };

  const closeModal = () => {
    setSelectedCurso(null);
  };

  const categories = ['Todos', 'Ciberseguridad', 'Desarrollo', 'Análisis'];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-background to-background-light relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute -left-20 top-40 w-60 h-60 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute right-0 bottom-0 w-80 h-80 bg-highlight/10 rounded-full blur-3xl"></div>
      
      {/* Animaciones laterales con temática de ciberseguridad */}
      <div className="fixed left-4 top-1/4 hidden xl:flex flex-col items-center opacity-20 hover:opacity-40 transition-opacity duration-500">
        <div className="w-px h-20 bg-highlight"></div>
        <div className="w-8 h-8 rounded-full border border-highlight flex items-center justify-center mb-3 animate-pulse">
          <svg className="w-4 h-4 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div className="rotate-90 text-xs tracking-widest text-highlight/70 font-mono">SECURE</div>
        <div className="w-px h-16 bg-highlight"></div>
        <div className="w-6 h-6 rounded-full border border-highlight flex items-center justify-center my-3">
          <div className="w-2 h-2 bg-highlight rounded-full animate-ping"></div>
        </div>
        <div className="w-px h-32 bg-highlight"></div>
        <div className="w-8 h-8 rounded-full border border-highlight flex items-center justify-center my-3 animate-spin-slow">
          <svg className="w-4 h-4 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div className="w-px h-20 bg-highlight"></div>
      </div>
      
      <div className="fixed right-4 top-1/3 hidden xl:flex flex-col items-center opacity-20 hover:opacity-40 transition-opacity duration-500">
        <div className="w-px h-32 bg-accent"></div>
        <div className="w-8 h-8 rounded-full border border-accent flex items-center justify-center mb-3 animate-bounce" style={{ animationDuration: '3s' }}>
          <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009" />
          </svg>
        </div>
        <div className="rotate-90 text-xs tracking-widest text-accent/70 font-mono">LEARNING</div>
        <div className="w-px h-16 bg-accent"></div>
        <div className="w-6 h-6 rounded-full border border-accent flex items-center justify-center my-3">
          <div className="w-2 h-2 bg-accent rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="w-px h-20 bg-accent"></div>
        <div className="w-8 h-8 rounded-full border border-accent flex items-center justify-center my-3 animate-pulse">
          <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <div className="w-px h-16 bg-accent"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent">
            Cursos
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-highlight to-accent mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Explora nuestros cursos especializados en ciberseguridad y desarrollo seguro impartidos por expertos del sector.
          </p>
        </div>
        
        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-highlight text-white shadow-lg shadow-highlight/20'
                  : 'bg-blue-800 hover:bg-blue-700 text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cursos.map((curso) => (
            <div 
              key={curso.idcursos} 
              className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
            >
              <div className="relative h-48 overflow-hidden">
                <Image 
                  src="/placeholder-course.png"
                  alt={curso.nombre_curso}
                  fill={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-4 bg-highlight/90 text-white text-xs py-1 px-3 rounded-full backdrop-blur-sm">
                  {curso.fechainicial_curso ? new Date(curso.fechainicial_curso).toLocaleDateString('es-ES') : 'Próximamente'}
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2 group-hover:text-highlight transition-colors duration-300">{curso.nombre_curso}</h2>
                <p className="text-sm text-foreground/80 mb-4">{curso.descripcion_curso}</p>
                
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white mr-2">
                    <span className="text-sm font-bold">H</span>
                  </div>
                  <p className="text-sm font-medium">H4ck3r L4bs Team</p>
                </div>
                
                <button 
                  onClick={() => openModal(curso)}
                  className="w-full bg-gradient-to-r from-highlight to-highlight-dark text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-highlight/30 transform hover:-translate-y-0.5"
                >
                  Ver detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de detalles del curso */}
      {selectedCurso && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 px-4 transition-opacity duration-300">
          <div 
            className="bg-card rounded-xl w-full max-w-4xl overflow-hidden shadow-2xl transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-72">
              <Image 
                src="/placeholder-course.png"
                alt={selectedCurso.nombre_curso}
                fill={true}
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent opacity-70"></div>
              
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-highlight transition-colors duration-300 z-10"
                aria-label="Cerrar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="absolute bottom-0 left-0 w-full p-6 z-10">
                <h2 className="text-3xl font-bold mb-2 text-white">{selectedCurso.nombre_curso}</h2>
                <div className="flex items-center text-white/90">
                  <span className="bg-accent/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm mr-3">
                    {selectedCurso.fechainicial_curso ? new Date(selectedCurso.fechainicial_curso).toLocaleDateString('es-ES') : 'Próximamente'}
                  </span>
                  <span className="text-sm">Instructor: H4ck3r L4bs Team</span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <p className="mb-6 text-foreground/80">{selectedCurso.descripcion_curso}</p>
              
              <div className="bg-background/50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-3 text-lg">Lo que aprenderás:</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((_, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-5 h-5 mr-2 text-highlight flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      <span>Tema importante del curso {i + 1}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-6">
                <button 
                  onClick={closeModal}
                  className="bg-card-hover hover:bg-card-dark text-foreground font-medium py-2 px-6 rounded-lg transition-colors duration-300 order-2 sm:order-1"
                >
                  Cerrar
                </button>
                <a 
                  href={selectedCurso.link_curso} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-highlight hover:bg-highlight-dark text-white font-medium py-2 px-6 rounded-lg shadow-lg hover:shadow-highlight/30 transition-all duration-300 transform hover:-translate-y-0.5 text-center order-1 sm:order-2"
                >
                  Inscribirse ahora
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
