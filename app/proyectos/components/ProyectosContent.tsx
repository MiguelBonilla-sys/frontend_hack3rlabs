'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { apiClient } from '@/lib/api'
import { Proyecto } from '@/types/api'

export default function ProyectosContent() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProyecto, setSelectedProyecto] = useState<Proyecto | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTecnologia, setSelectedTecnologia] = useState('');

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        setLoading(true)
        const data = await apiClient.getProyectos()
        setProyectos(data.results)
      } catch (error) {
        console.error('Error fetching proyectos:', error)
        setError('Error al cargar los proyectos')
      } finally {
        setLoading(false)
      }
    }

    fetchProyectos()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-primary to-gray-800 py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Proyectos de <span className="bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent">Código Abierto</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Cargando proyectos...
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
              Proyectos de <span className="bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent">Código Abierto</span>
            </h1>
            <p className="text-lg text-red-400 max-w-3xl mx-auto">
              {error}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Lista fija de tecnologías para el filtro
  const tecnologias = ['React', 'Next.js', 'TypeScript', 'Python', 'Django', 'Node.js', 'JavaScript', 'CSS', 'HTML'].sort((a, b) => a.localeCompare(b));

  // Filtrar proyectos
  const filteredProyectos = proyectos.filter(proyecto => {
    const matchesTerm = 
      proyecto.nombre_proyecto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proyecto.description_proyecto.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Para esta versión, no filtramos por tecnología ya que la API no las proporciona
    const matchesTecnologia = selectedTecnologia === '' || true;
    
    return matchesTerm && matchesTecnologia;
  });

  const openModal = (proyecto: Proyecto) => {
    setSelectedProyecto(proyecto);
  };

  const closeModal = () => {
    setSelectedProyecto(null);
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-background to-background-light relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-highlight/30 to-accent/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-gradient-to-r from-accent/20 to-highlight/20 rounded-full blur-2xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Proyectos de <span className="bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent">Código Abierto</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
            Explora nuestra colección de proyectos innovadores desarrollados por la comunidad de hackers éticos.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12 bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar proyectos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-background/80 border border-border rounded-lg text-white placeholder-foreground/60 focus:outline-none focus:ring-2 focus:ring-highlight focus:border-transparent transition-all duration-300"
              />
            </div>
            <div className="md:w-64">
              <select
                value={selectedTecnologia}
                onChange={(e) => setSelectedTecnologia(e.target.value)}
                className="w-full px-4 py-3 bg-background/80 border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-highlight focus:border-transparent transition-all duration-300"
              >
                <option value="">Todas las tecnologías</option>
                {tecnologias.map((tecnologia) => (
                  <option key={tecnologia} value={tecnologia}>
                    {tecnologia}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProyectos.map((proyecto) => (
            <div
              key={proyecto.idproyectos}
              className="bg-card/60 backdrop-blur-sm border border-border rounded-xl overflow-hidden group hover:bg-card/80 hover:border-highlight/50 transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={() => openModal(proyecto)}
            >
              <div className="relative h-52">
                <Image
                  src="/placeholder-project.png"
                  alt={proyecto.nombre_proyecto}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-primary/30 opacity-90 pointer-events-none"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between text-white mb-2">
                    <h2 className="text-xl font-bold text-white group-hover:text-highlight transition-colors duration-300">{proyecto.nombre_proyecto}</h2>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">
                      {new Date(proyecto.fecha_proyecto).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm mb-4 line-clamp-3 text-foreground/80">{proyecto.description_proyecto}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {/* Para esta versión, mostramos tecnologías predeterminadas */}
                  {['React', 'TypeScript'].map((tecnologia) => (
                    <span
                      key={tecnologia}
                      className="px-2 py-1 bg-highlight/20 text-highlight text-xs rounded-full border border-highlight/30"
                    >
                      {tecnologia}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-highlight to-accent rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">H</span>
                    </div>
                    <span className="text-sm text-foreground/60">H4ck3r L4bs Team</span>
                  </div>
                  <button className="text-highlight hover:text-accent transition-colors duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No results */}
        {filteredProyectos.length === 0 && (
          <div className="text-center py-16">
            <div className="mb-6">
              <svg className="w-24 h-24 text-foreground/30 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No se encontraron proyectos</h3>
            <p className="text-foreground/60">Intenta ajustar tus filtros de búsqueda</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedProyecto && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-card border border-border rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Detalles del Proyecto</h2>
              <button
                onClick={closeModal}
                className="text-foreground/60 hover:text-white transition-colors duration-300"
                aria-label="Cerrar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="relative h-72">
                    <Image
                      src="/placeholder-project.png"
                      alt={selectedProyecto.nombre_proyecto}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{selectedProyecto.nombre_proyecto}</h2>
                  <p className="text-foreground/60 mb-4">
                    Publicado el {new Date(selectedProyecto.fecha_proyecto).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="mb-8 text-foreground/80">{selectedProyecto.description_proyecto}</p>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        Tecnologías
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {['React', 'TypeScript', 'Next.js'].map((tecnologia) => (
                          <span
                            key={tecnologia}
                            className="px-3 py-1 bg-highlight/20 text-highlight text-sm rounded-full border border-highlight/30"
                          >
                            {tecnologia}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        Colaboradores
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-highlight to-accent rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-white">H</span>
                          </div>
                          <span className="text-sm text-foreground/80">H4ck3r L4bs Team</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <a
                      href={selectedProyecto.link_proyecto}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-highlight to-accent text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-highlight/25 transition-all duration-300 group"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Ver Proyecto
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
