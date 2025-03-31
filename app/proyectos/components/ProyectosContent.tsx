'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Proyecto {
  id: number;
  nombre: string;
  descripcion: string;
  enlace: string;
  imagen: string;
  fecha: string;
  tecnologias: string[];
  integrantes: string[];
}

// Datos simulados - en una aplicación real se obtendrían de API
const proyectos: Proyecto[] = [
  {
    id: 1,
    nombre: 'ScanNet: Escáner de Vulnerabilidades en Red',
    descripcion: 'Una herramienta de código abierto para la identificación y evaluación de vulnerabilidades en redes corporativas. Utiliza técnicas de análisis pasivo y activo para detectar posibles puntos de entrada sin interferir con la operación normal.',
    enlace: 'https://github.com/hackers-lab/scannet',
    imagen: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2574&q=80',
    fecha: '2023-10-15',
    tecnologias: ['Python', 'Docker', 'Elasticsearch', 'Linux'],
    integrantes: ['Juan Pérez', 'María Rodríguez', 'Carlos Gómez']
  },
  {
    id: 2,
    nombre: 'SecureAuth: Sistema de Autenticación Multifactor',
    descripcion: 'Implementación de un sistema de autenticación de múltiples factores con soporte para huella digital, reconocimiento facial y tokens temporales. Diseñado para ser fácilmente integrable en aplicaciones existentes.',
    enlace: 'https://github.com/hackers-lab/secureauth',
    imagen: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    fecha: '2023-08-22',
    tecnologias: ['JavaScript', 'Node.js', 'React', 'Biometrics API'],
    integrantes: ['Ana López', 'Roberto Sánchez']
  },
  {
    id: 3,
    nombre: 'CryptoFile: Cifrado de Archivos para la Nube',
    descripcion: 'Aplicación que permite cifrar archivos antes de subirlos a servicios de almacenamiento en la nube. Utiliza algoritmos de cifrado de grado militar y no almacena las claves en ningún servidor externo.',
    enlace: 'https://github.com/hackers-lab/cryptofile',
    imagen: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    fecha: '2023-06-10',
    tecnologias: ['C++', 'Qt', 'OpenSSL', 'Cross-platform'],
    integrantes: ['Pedro Martínez', 'Laura Torres', 'Diego Ramírez']
  },
  {
    id: 4,
    nombre: 'PhishDetector: Detección de Phishing con IA',
    descripcion: 'Extensión de navegador que utiliza modelos de aprendizaje automático para identificar sitios web fraudulentos y ataques de phishing. Analiza en tiempo real URLs, contenido y estructura de las páginas.',
    enlace: 'https://github.com/hackers-lab/phishdetector',
    imagen: 'https://images.unsplash.com/photo-1562813733-b31f71025d54?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2669&q=80',
    fecha: '2023-05-03',
    tecnologias: ['JavaScript', 'TensorFlow.js', 'Browser Extensions', 'Machine Learning'],
    integrantes: ['Sofía Álvarez', 'Javier Ruiz']
  }
];

export default function ProyectosContent() {
  const [selectedProyecto, setSelectedProyecto] = useState<Proyecto | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTecnologia, setSelectedTecnologia] = useState('');

  // Extraer todas las tecnologías únicas
  const tecnologiasObj: Record<string, boolean> = {};
  proyectos.forEach(proyecto => {
    proyecto.tecnologias.forEach(tecnologia => {
      tecnologiasObj[tecnologia] = true;
    });
  });
  const tecnologias = Object.keys(tecnologiasObj).sort();

  // Filtrar proyectos
  const filteredProyectos = proyectos.filter(proyecto => {
    const matchesTerm = 
      proyecto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
      proyecto.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTecnologia = 
      selectedTecnologia === '' || 
      proyecto.tecnologias.includes(selectedTecnologia);
    
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
      {/* Elementos decorativos */}
      <div className="absolute -left-40 bottom-20 w-80 h-80 bg-highlight/5 rounded-full blur-3xl"></div>
      <div className="absolute right-0 top-40 w-60 h-60 bg-accent/10 rounded-full blur-3xl"></div>
      
      {/* Animaciones laterales con temática de ciberseguridad */}
      <div className="fixed left-4 top-1/4 hidden xl:flex flex-col items-center opacity-20 hover:opacity-40 transition-opacity duration-500">
        <div className="w-px h-20 bg-highlight"></div>
        <div className="w-8 h-8 rounded-full border border-highlight flex items-center justify-center mb-3 animate-pulse">
          <svg className="w-4 h-4 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <div className="rotate-90 text-xs tracking-widest text-highlight/70 font-mono">CODE</div>
        <div className="w-px h-16 bg-highlight"></div>
        <div className="w-6 h-6 rounded-full border border-highlight flex items-center justify-center my-3">
          <div className="w-2 h-2 bg-highlight rounded-full animate-ping"></div>
        </div>
        <div className="w-px h-32 bg-highlight"></div>
        <div className="w-8 h-8 rounded-full border border-highlight flex items-center justify-center my-3 animate-spin-slow">
          <svg className="w-4 h-4 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="w-px h-20 bg-highlight"></div>
      </div>
      
      <div className="fixed right-4 top-1/3 hidden xl:flex flex-col items-center opacity-20 hover:opacity-40 transition-opacity duration-500">
        <div className="w-px h-32 bg-accent"></div>
        <div className="w-8 h-8 rounded-full border border-accent flex items-center justify-center mb-3 animate-bounce" style={{ animationDuration: '3s' }}>
          <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
          </svg>
        </div>
        <div className="rotate-90 text-xs tracking-widest text-accent/70 font-mono">PROJECTS</div>
        <div className="w-px h-16 bg-accent"></div>
        <div className="w-6 h-6 rounded-full border border-accent flex items-center justify-center my-3">
          <div className="w-2 h-2 bg-accent rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="w-px h-20 bg-accent"></div>
        <div className="w-8 h-8 rounded-full border border-accent flex items-center justify-center my-3 animate-pulse">
          <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="w-px h-16 bg-accent"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent">
            Proyectos
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-highlight to-accent mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Descubre los proyectos de código abierto desarrollados por nuestro equipo para mejorar la seguridad informática.
          </p>
        </div>
      
        {/* Filtros */}
        <div className="mb-8 flex flex-col md:flex-row justify-between gap-4 bg-card rounded-xl p-4 shadow-lg">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-foreground/40" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar proyectos..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-card-hover border border-border focus:outline-none focus:ring-2 focus:ring-highlight transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <select
              className="w-full px-4 py-2 rounded-lg bg-blue-800 text-white border border-blue-700 focus:outline-none focus:ring-2 focus:ring-highlight appearance-none transition-all duration-300"
              value={selectedTecnologia}
              onChange={(e) => setSelectedTecnologia(e.target.value)}
              style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"24\" height=\"24\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"white\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M19 9l-7 7-7-7\" /></svg>')", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
            >
              <option value="">Todas las tecnologías</option>
              {tecnologias.map((tecnologia) => (
                <option key={tecnologia} value={tecnologia}>{tecnologia}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Listado de proyectos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProyectos.length > 0 ? (
            filteredProyectos.map((proyecto) => (
              <div 
                key={proyecto.id} 
                className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="relative h-52">
                  <Image 
                    src={proyecto.imagen} 
                    alt={proyecto.nombre}
                    fill={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-primary/30 opacity-90 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-10 pointer-events-none">
                    <h2 className="text-xl font-bold text-white group-hover:text-highlight transition-colors duration-300">{proyecto.nombre}</h2>
                    <p className="text-white/70 text-sm">
                      {new Date(proyecto.fecha).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm mb-4 line-clamp-3 text-foreground/80">{proyecto.descripcion}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {proyecto.tecnologias.map((tecnologia) => (
                      <span 
                        key={tecnologia} 
                        className="bg-background px-3 py-1 rounded-full text-xs text-foreground/70 hover:text-highlight hover:bg-highlight/10 transition-colors duration-300"
                      >
                        {tecnologia}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={() => openModal(proyecto)}
                    className="w-full mt-2 py-2 px-4 rounded-lg bg-highlight text-white font-medium hover:bg-highlight-dark transition-all duration-300 hover:shadow-lg hover:shadow-highlight/20 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <span>Ver detalles</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 px-4 bg-card rounded-xl shadow-md">
              <svg className="w-16 h-16 text-foreground/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xl text-center mb-2">No se encontraron proyectos</p>
              <p className="text-foreground/60 text-center">Prueba con otros términos de búsqueda o cambia el filtro de tecnología</p>
              {searchTerm || selectedTecnologia ? (
                <button 
                  onClick={() => {setSearchTerm(''); setSelectedTecnologia('')}}
                  className="mt-4 px-4 py-2 bg-highlight text-white rounded-lg hover:bg-highlight-dark transition-colors duration-300"
                >
                  Limpiar filtros
                </button>
              ) : null}
            </div>
          )}
        </div>

        {/* Modal de proyecto */}
        {selectedProyecto && (
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 px-4 overflow-y-auto transition-opacity duration-300"
            onClick={closeModal}
          >
            <div 
              className="bg-card rounded-xl w-full max-w-4xl my-8 shadow-2xl transform transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-72">
                <Image 
                  src={selectedProyecto.imagen} 
                  alt={selectedProyecto.nombre}
                  fill={true}
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/70 to-transparent"></div>
                <button 
                  onClick={closeModal}
                  className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-highlight transition-colors duration-300 z-20"
                  aria-label="Cerrar"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{selectedProyecto.nombre}</h2>
                  <p className="text-white/80">
                    {new Date(selectedProyecto.fecha).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="p-6">
                <p className="mb-8 text-foreground/80">{selectedProyecto.descripcion}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-background/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-highlight" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                      </svg>
                      Tecnologías
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProyecto.tecnologias.map((tecnologia) => (
                        <span 
                          key={tecnologia} 
                          className="bg-card px-3 py-1 rounded-full text-sm flex items-center"
                        >
                          {tecnologia}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-background/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-highlight" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      Integrantes
                    </h3>
                    <ul className="space-y-2">
                      {selectedProyecto.integrantes.map((integrante, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white text-xs mr-2">
                            {integrante.charAt(0)}
                          </div>
                          <span>{integrante}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-end gap-3 border-t border-border pt-4">
                  <button 
                    onClick={closeModal}
                    className="order-2 sm:order-1 py-2 px-6 bg-card-hover hover:bg-card-dark text-foreground rounded-lg transition-colors duration-300"
                  >
                    Cerrar
                  </button>
                  <a 
                    href={selectedProyecto.enlace} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="order-1 sm:order-2 flex items-center justify-center gap-2 py-2 px-6 bg-highlight hover:bg-highlight-dark text-white rounded-lg shadow-lg hover:shadow-highlight/30 transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <span>Ver repositorio</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 