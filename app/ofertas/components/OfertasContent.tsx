'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { OfertaEmpleo } from '@/types/api'
import { apiClient } from '@/lib/api'

export default function OfertasContent() {
  const [ofertas, setOfertas] = useState<OfertaEmpleo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOferta, setSelectedOferta] = useState<OfertaEmpleo | null>(null);
  const [filterLocation, setFilterLocation] = useState('');
  const [filterModality, setFilterModality] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getOfertas();
        setOfertas(response.results || []);      } catch (err: unknown) {
        console.error('Error fetching ofertas:', err);
        setError('Error al cargar las ofertas de empleo. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchOfertas();
  }, []);
  // Filtros temporalmente deshabilitados hasta actualizar el modelo
  const ubicaciones: string[] = [];
  const modalidades: string[] = [];

  // Filtrar ofertas
  const filteredOfertas = ofertas.filter(oferta => {
    const matchesLocation = true; // Temporalmente deshabilitado
    const matchesModality = true; // Temporalmente deshabilitado
    const matchesSearch = searchTerm === '' || 
      oferta.titulo_empleo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      oferta.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      oferta.descripcion_empleo.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesLocation && matchesModality && matchesSearch;
  });

  const openModal = (oferta: OfertaEmpleo) => {
    setSelectedOferta(oferta);
  };

  const closeModal = () => {
    setSelectedOferta(null);
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Formatear salario (campo no disponible en el esquema actual)
  const formatSalario = () => {
    // Los campos salario_min y salario_max no están en el esquema actual
    return 'Salario a convenir';
  };

  // Formatear modalidad para mostrar (campo no disponible en el esquema actual)
  const formatModalidad = () => {
    // El campo modalidad no está en el esquema actual
    return 'Por definir';
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilterLocation('');
    setFilterModality('');
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-background to-background-light relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent">
              Ofertas de Empleo
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-highlight to-accent mx-auto mb-6 rounded-full"></div>
          </div>
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-highlight"></div>
            <span className="ml-4 text-lg">Cargando ofertas...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-background to-background-light relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent">
              Ofertas de Empleo
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-highlight to-accent mx-auto mb-6 rounded-full"></div>
          </div>
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-card rounded-xl shadow-md">
            <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl text-center mb-2 text-red-500">Error al cargar ofertas</p>
            <p className="text-foreground/60 text-center mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-highlight text-white rounded-lg hover:bg-highlight-dark transition-colors duration-300"
            >
              Intentar nuevamente
            </button>
          </div>
        </div>
      </div>
    );
  }  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-background to-background-light relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute -right-32 top-60 w-96 h-96 bg-highlight/5 rounded-full blur-3xl"></div>
      <div className="absolute left-0 -bottom-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
      
      {/* Animaciones laterales con temática de ciberseguridad */}
      <div className="fixed left-4 top-1/4 hidden xl:flex flex-col items-center opacity-20 hover:opacity-40 transition-opacity duration-500">
        <div className="w-px h-20 bg-highlight"></div>
        <div className="w-8 h-8 rounded-full border border-highlight flex items-center justify-center mb-3 animate-pulse">
          <svg className="w-4 h-4 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="rotate-90 text-xs tracking-widest text-highlight/70 font-mono">JOBS</div>
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
        <div className="w-px h-20 bg-accent"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent">
            Ofertas de Empleo
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-highlight to-accent mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Explora oportunidades laborales en el ámbito de la ciberseguridad y el desarrollo seguro
          </p>
        </div>
        
        {/* Buscador y Filtros */}
        <div className="mb-10 bg-card rounded-xl p-5 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar ofertas por título, empresa o descripción..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-card-hover border border-border focus:outline-none focus:ring-2 focus:ring-highlight transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <select
                className="w-full px-4 py-2 rounded-lg bg-blue-800 text-white border border-blue-700 focus:outline-none focus:ring-2 focus:ring-highlight appearance-none transition-all duration-300"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"24\" height=\"24\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"white\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M19 9l-7 7-7-7\" /></svg>')", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
              >
                <option value="">Todas las ubicaciones</option>
                {ubicaciones.map((ubicacion) => (
                  <option key={ubicacion} value={ubicacion}>{ubicacion}</option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-1/2">
              <select
                className="w-full px-4 py-2 rounded-lg bg-blue-800 text-white border border-blue-700 focus:outline-none focus:ring-2 focus:ring-highlight appearance-none transition-all duration-300"
                value={filterModality}
                onChange={(e) => setFilterModality(e.target.value)}
                style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"24\" height=\"24\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"white\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M19 9l-7 7-7-7\" /></svg>')", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
              >
                <option value="">Todas las modalidades</option>
                {modalidades.map((modalidad) => (
                  <option key={modalidad} value={modalidad}>{formatModalidad()}</option>
                ))}
              </select>
            </div>
          </div>
          
          {(filterLocation || filterModality || searchTerm) && (
            <div className="mt-4 flex justify-end">
              <button 
                onClick={clearFilters}
                className="px-4 py-2 bg-card-hover hover:bg-card-dark text-foreground rounded-lg transition-colors duration-300 flex items-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Limpiar filtros</span>
              </button>
            </div>
          )}
        </div>
        
        {/* Listado de ofertas */}
        <div className="space-y-6">
          {filteredOfertas.length > 0 ? (
            filteredOfertas.map((oferta) => (
              <div 
                key={oferta.idoferta} 
                className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
                onClick={() => openModal(oferta)}
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                      <Image 
                        src={oferta.imagen || '/placeholder-company.png'} 
                        alt={oferta.empresa}
                        fill={true}
                        sizes="64px"
                        className="object-cover"
                        onError={(e) => {
                          // Usar una imagen por defecto si falla la carga
                          (e.target as HTMLImageElement).src = '/placeholder-company.png';
                        }}
                      />
                    </div>
                    <div className="flex-grow">
                      <h2 className="text-xl font-bold mb-1 group-hover:text-highlight transition-colors duration-300">{oferta.titulo_empleo}</h2>
                      <div className="flex flex-wrap items-center gap-3 text-sm mb-3">
                        <span className="font-medium text-foreground/90">{oferta.empresa}</span>
                        <div className="flex items-center text-foreground/70">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {/* {oferta.ubicacion} */} N/A
                        </div>
                        <span className="bg-background px-3 py-1 rounded-full text-xs font-medium text-highlight">
                          {formatModalidad()}
                        </span>
                      </div>
                      <p className="line-clamp-2 text-sm text-foreground/80 mb-3">{oferta.descripcion_empleo}</p>
                      <div className="flex items-center text-xs text-foreground/60">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Publicado: {formatDate(oferta.fecha_publicacion)}
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-end mt-4 md:mt-0">
                      <div className="bg-highlight/10 text-highlight font-bold py-1 px-4 rounded-full mb-2">
                        {formatSalario()}
                      </div>
                      <button className="flex items-center gap-1 text-sm font-medium text-highlight/80 hover:text-highlight transition-colors">
                        <span>Ver detalles</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-card rounded-xl shadow-md">
              <svg className="w-16 h-16 text-foreground/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xl text-center mb-2">No se encontraron ofertas</p>
              <p className="text-foreground/60 text-center">Prueba con otros criterios de búsqueda o cambia los filtros</p>
              <button 
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-highlight text-white rounded-lg hover:bg-highlight-dark transition-colors duration-300"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* Modal de oferta detallada */}
        {selectedOferta && (
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 px-4 overflow-y-auto transition-opacity duration-300"
            onClick={closeModal}
          >
            <div 
              className="bg-card rounded-xl w-full max-w-4xl my-8 shadow-2xl transform transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 md:p-8 relative">
                <button 
                  onClick={closeModal}
                  className="absolute top-4 right-4 bg-black/10 hover:bg-black/20 backdrop-blur-sm text-foreground p-2 rounded-full transition-colors duration-300"
                  aria-label="Cerrar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <div className="flex items-center gap-5 mb-8 pb-6 border-b border-border">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border flex-shrink-0">
                    <Image 
                      src={selectedOferta.imagen || '/placeholder-company.png'} 
                      alt={selectedOferta.empresa}
                      fill={true}
                      sizes="80px"
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-company.png';
                      }}
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-1">{selectedOferta.titulo_empleo}</h2>
                    <p className="text-lg">{selectedOferta.empresa}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-background/50 rounded-lg p-4 flex items-center">
                    <div className="p-2 mr-3 bg-highlight/10 rounded-full text-highlight">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm text-foreground/60 mb-1">Ubicación</h3>
                      <p className="font-medium">Por definir</p>
                    </div>
                  </div>
                  
                  <div className="bg-background/50 rounded-lg p-4 flex items-center">
                    <div className="p-2 mr-3 bg-highlight/10 rounded-full text-highlight">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm text-foreground/60 mb-1">Modalidad</h3>
                      <p className="font-medium">{formatModalidad()}</p>
                    </div>
                  </div>
                  
                  <div className="bg-background/50 rounded-lg p-4 flex items-center">
                    <div className="p-2 mr-3 bg-highlight/10 rounded-full text-highlight">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm text-foreground/60 mb-1">Salario</h3>
                      <p className="font-medium">{formatSalario()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Descripción</h3>
                  <p className="text-foreground/80 whitespace-pre-line">{selectedOferta.descripcion_empleo}</p>
                </div>
                
                {selectedOferta.fecha_expiracion && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4">Fecha de Expiración</h3>
                    <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-600 rounded-lg p-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-yellow-800 dark:text-yellow-200">
                          Esta oferta expira el {formatDate(selectedOferta.fecha_expiracion)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-border">
                  <div className="text-sm text-foreground/60">
                    Publicado el {formatDate(selectedOferta.fecha_publicacion)}
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={closeModal}
                      className="px-5 py-2 bg-card-hover hover:bg-card-dark text-foreground rounded-lg transition-colors duration-300"
                    >
                      Cerrar
                    </button>
                    <button 
                      className="px-5 py-2 bg-highlight hover:bg-highlight-dark text-white rounded-lg shadow-lg hover:shadow-highlight/30 transition-all duration-300 transform hover:-translate-y-0.5"
                      onClick={() => {
                        // Aquí podrías agregar funcionalidad para aplicar a la oferta
                        // Por ejemplo, abrir un modal de aplicación o redirigir a un formulario
                        alert('Funcionalidad de aplicación en desarrollo');
                      }}
                    >
                      Aplicar ahora
                    </button>
                  </div>                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
