'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Noticia {
  id: number;
  titulo: string;
  resumen: string;
  contenido: string;
  imagen: string;
  fecha: string;
  autor: string;
  categoria: string;
}

// Datos simulados - en una aplicación real se obtendrían de API
const noticias: Noticia[] = [
  {
    id: 1,
    titulo: 'Descubierta nueva vulnerabilidad crítica en sistemas Linux',
    resumen: 'Investigadores han identificado una vulnerabilidad de día cero que afecta a todas las distribuciones Linux basadas en kernel 5.15 y posteriores.',
    contenido: `Un equipo de investigadores de seguridad ha descubierto una nueva vulnerabilidad crítica que afecta a los sistemas Linux con kernel 5.15 y versiones posteriores. La vulnerabilidad, denominada "StackRot" (CVE-2023-1234), permite a un atacante local escalar privilegios y obtener acceso root al sistema.

    El fallo se encuentra en el subsistema de gestión de memoria y puede ser explotado mediante una secuencia específica de llamadas al sistema que provoca una condición de carrera. Los desarrolladores del kernel ya han publicado un parche que corrige el problema.

    Se recomienda a todos los administradores de sistemas que actualicen sus servidores Linux lo antes posible. Las principales distribuciones, incluyendo Ubuntu, Debian, Red Hat y SUSE, ya han lanzado actualizaciones de seguridad.

    Los sistemas que no pueden ser actualizados inmediatamente deberían implementar las mitigaciones recomendadas, que incluyen la desactivación de ciertos módulos del kernel y la restricción de acceso a determinadas llamadas al sistema mediante seccomp.`,
    imagen: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    fecha: '2023-03-15',
    autor: 'Juan Pérez',
    categoria: 'Vulnerabilidades'
  },
  {
    id: 2,
    titulo: 'La UE aprueba nueva legislación sobre ciberseguridad para dispositivos IoT',
    resumen: 'El Parlamento Europeo ha aprobado una nueva normativa que establece requisitos mínimos de seguridad para todos los dispositivos conectados.',
    contenido: `El Parlamento Europeo ha dado luz verde a una nueva legislación que obligará a los fabricantes de dispositivos IoT (Internet de las Cosas) a cumplir con estándares mínimos de ciberseguridad.

    La normativa, conocida como "Cyber Resilience Act", establece que todos los productos conectados vendidos en el mercado europeo deberán incorporar:

    • Protección contra accesos no autorizados
    • Cifrado para las comunicaciones
    • Actualizaciones de seguridad garantizadas durante al menos 5 años
    • Documentación completa sobre las medidas de seguridad implementadas
    • Proceso de divulgación responsable de vulnerabilidades

    Los fabricantes tendrán un plazo de 24 meses para adaptar sus productos a la nueva regulación. Las empresas que incumplan podrían enfrentarse a multas de hasta el 15% de su facturación global.

    Esta legislación busca abordar el creciente problema de los dispositivos IoT inseguros, que han sido utilizados en numerosas ocasiones para formar redes botnets y lanzar ataques DDoS a gran escala.

    Según las estimaciones, para 2025 habrá más de 30.000 millones de dispositivos IoT conectados en todo el mundo, lo que subraya la importancia de garantizar su seguridad.`,
    imagen: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    fecha: '2023-04-10',
    autor: 'María Rodríguez',
    categoria: 'Regulación'
  },
  {
    id: 3,
    titulo: 'Aumentan un 300% los ataques de ransomware dirigidos al sector sanitario',
    resumen: 'Un nuevo informe revela un alarmante incremento de ataques ransomware contra hospitales y centros de salud durante el último trimestre.',
    contenido: `Según el último informe publicado por CyberHealth Research, los ataques de ransomware dirigidos al sector sanitario han aumentado un 300% en el último trimestre, convirtiendo a hospitales y centros de salud en los principales objetivos de los ciberdelincuentes.

    El informe destaca que más de 150 instituciones sanitarias en todo el mundo han sido víctimas de estos ataques, con un tiempo medio de inactividad de sistemas críticos de 9 días y un coste promedio de recuperación que supera los 2 millones de dólares.

    Los grupos de ransomware más activos en este sector han sido REvil, DarkSide y Conti, que han modificado sus tácticas para ejercer mayor presión sobre las víctimas, combinando el cifrado de datos con la exfiltración y amenaza de publicación de información médica sensible.

    El Dr. Javier Santos, uno de los autores del estudio, señala: "La pandemia ha acelerado la digitalización del sector sanitario sin que las medidas de seguridad hayan evolucionado al mismo ritmo, creando numerosas vulnerabilidades que los atacantes están aprovechando".

    Entre las recomendaciones que proporciona el informe se incluyen:
    • Implementación de autenticación multifactor
    • Segmentación de redes
    • Copias de seguridad regulares y desconectadas
    • Formación continua del personal en seguridad informática
    • Desarrollo de planes de respuesta a incidentes específicos para escenarios de ransomware`,
    imagen: 'https://images.unsplash.com/photo-1516841273335-e39b37888115?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    fecha: '2023-02-28',
    autor: 'Carlos Montero',
    categoria: 'Ataques'
  },
  {
    id: 4,
    titulo: 'Descubre las tendencias en ciberseguridad para 2023',
    resumen: 'Expertos analizan las tecnologías y estrategias de seguridad que dominarán el panorama digital durante el próximo año.',
    contenido: `El panorama de la ciberseguridad evoluciona constantemente, y 2023 promete ser un año de cambios significativos. Tras analizar los datos y tendencias del último año, los expertos destacan estas cinco áreas clave que dominarán el sector:

    1. **Seguridad en entornos de nube distribuida**: Con el auge de arquitecturas multi-nube e híbridas, las organizaciones necesitarán implementar estrategias de seguridad unificadas que protejan los datos independientemente de su ubicación. Se espera un crecimiento del 45% en la adopción de soluciones CSPM (Cloud Security Posture Management) y CNAPP (Cloud-Native Application Protection Platform).

    2. **Inteligencia Artificial defensiva y ofensiva**: La IA no solo será una herramienta para los defensores, sino también para los atacantes. Veremos un incremento en malware impulsado por IA capaz de adaptarse a las defensas y evadir la detección. Como respuesta, las soluciones de seguridad adoptarán algoritmos de aprendizaje más sofisticados para identificar comportamientos anómalos.

    3. **Zero Trust generalizado**: El principio de "nunca confiar, siempre verificar" se convertirá en el estándar para las empresas de todos los tamaños. Un estudio reciente indica que el 75% de las organizaciones planea implementar arquitecturas Zero Trust completas en los próximos 18 meses.

    4. **Seguridad de la cadena de suministro de software**: Tras los ataques a SolarWinds y Kaseya, la seguridad de la cadena de suministro será una prioridad absoluta. Se espera la adopción masiva de SBOMs (Software Bill of Materials) y herramientas de análisis automatizado de código.

    5. **Protección de identidad avanzada**: Más allá del MFA tradicional, veremos nuevos enfoques como la autenticación continua y basada en comportamiento. Las tecnologías de verificación biométrica y sin contraseñas experimentarán un crecimiento del 60%.

    Eduardo Vázquez, CISO de CyberDefense Global, comenta: "Las organizaciones deben prepararse para un ecosistema de amenazas más complejo y sofisticado. La buena noticia es que disponemos de tecnologías defensivas cada vez más avanzadas. La clave está en implementarlas correctamente y mantener un enfoque proactivo frente a la seguridad."`,
    imagen: 'https://images.unsplash.com/photo-1633265486501-0cf354162e63?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    fecha: '2023-01-15',
    autor: 'Laura Gómez',
    categoria: 'Tendencias'
  }
];

export default function NoticiasContent() {
  const [selectedNoticia, setSelectedNoticia] = useState<Noticia | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');
  const [categorias, setCategorias] = useState<string[]>([]);

  // Extraer categorías únicas
  useEffect(() => {
    const categoriasObj: Record<string, boolean> = {};
    noticias.forEach(noticia => {
      categoriasObj[noticia.categoria] = true;
    });
    setCategorias(Object.keys(categoriasObj).sort());
  }, []);

  // Filtrar noticias
  const filteredNoticias = noticias.filter(noticia => {
    const matchesCategoria = filterCategoria === '' || noticia.categoria === filterCategoria;
    const matchesSearch = searchTerm === '' || 
      noticia.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      noticia.resumen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      noticia.contenido.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategoria && matchesSearch;
  });

  const openModal = (noticia: Noticia) => {
    setSelectedNoticia(noticia);
  };

  const closeModal = () => {
    setSelectedNoticia(null);
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

  // Limpiar filtros
  const clearFilters = () => {
    setFilterCategoria('');
    setSearchTerm('');
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-background to-background-light relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute -top-20 left-1/4 w-96 h-96 bg-highlight/5 rounded-full blur-3xl"></div>
      <div className="absolute right-0 bottom-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
      
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <div className="rotate-90 text-xs tracking-widest text-accent/70 font-mono">ANÁLISIS</div>
        <div className="w-px h-16 bg-accent"></div>
        <div className="w-6 h-6 rounded-full border border-accent flex items-center justify-center my-3">
          <div className="w-2 h-2 bg-accent rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="w-px h-20 bg-accent"></div>
        <div className="w-8 h-8 rounded-full border border-accent flex items-center justify-center my-3 animate-pulse">
          <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        </div>
        <div className="w-px h-16 bg-accent"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent">
            Últimas Noticias
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-highlight to-accent mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Mantente informado sobre las últimas novedades en el mundo de la ciberseguridad
          </p>
        </div>
        
        {/* Buscador y Filtros */}
        <div className="mb-10 bg-card rounded-xl p-5 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar noticias..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-card-hover border border-border focus:outline-none focus:ring-2 focus:ring-highlight transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="md:w-64">
              <select
                className="w-full px-4 py-2 rounded-lg bg-blue-800 text-white border border-blue-700 focus:outline-none focus:ring-2 focus:ring-highlight appearance-none transition-all duration-300"
                value={filterCategoria}
                onChange={(e) => setFilterCategoria(e.target.value)}
                style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"24\" height=\"24\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"white\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M19 9l-7 7-7-7\" /></svg>')", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
              >
                <option value="">Todas las categorías</option>
                {categorias.map((categoria) => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
            </div>
          </div>
          
          {(filterCategoria || searchTerm) && (
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
        
        {/* Grid de noticias */}
        {filteredNoticias.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredNoticias.map((noticia) => (
              <div 
                key={noticia.id} 
                className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer"
                onClick={() => openModal(noticia)}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src={noticia.imagen} 
                    alt={noticia.titulo}
                    fill={true}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <span className="inline-block px-3 py-1 bg-highlight/90 text-white text-xs rounded-full backdrop-blur-sm mb-2">
                      {noticia.categoria}
                    </span>
                    <h2 className="text-xl font-bold text-white mb-1 line-clamp-2 group-hover:text-highlight-light transition-colors">
                      {noticia.titulo}
                    </h2>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-foreground/80 mb-4 line-clamp-3">{noticia.resumen}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-highlight/20 flex items-center justify-center text-highlight mr-2">
                        {noticia.autor.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{noticia.autor}</p>
                        <p className="text-xs text-foreground/60">{formatDate(noticia.fecha)}</p>
                      </div>
                    </div>
                    <button className="text-highlight flex items-center gap-1 text-sm group-hover:translate-x-1 transition-transform duration-300">
                      <span>Leer</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-card rounded-xl shadow-md">
            <svg className="w-16 h-16 text-foreground/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl text-center mb-2">No se encontraron noticias</p>
            <p className="text-foreground/60 text-center">Prueba con otros criterios de búsqueda o cambia los filtros</p>
            <button 
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-highlight text-white rounded-lg hover:bg-highlight-dark transition-colors duration-300"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        {/* Modal de noticia detallada */}
        {selectedNoticia && (
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 px-4 overflow-y-auto transition-opacity duration-300"
            onClick={closeModal}
          >
            <div 
              className="bg-card rounded-xl w-full max-w-4xl my-8 shadow-2xl transform transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <div className="h-64 md:h-80 relative overflow-hidden">
                  <Image 
                    src={selectedNoticia.imagen} 
                    alt={selectedNoticia.titulo}
                    fill={true}
                    sizes="100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <span className="inline-block px-3 py-1 bg-highlight/90 text-white text-xs rounded-full backdrop-blur-sm mb-2">
                      {selectedNoticia.categoria}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">{selectedNoticia.titulo}</h2>
                    <div className="flex items-center mt-4 text-white/90">
                      <div className="w-8 h-8 rounded-full bg-highlight/20 flex items-center justify-center text-white mr-2">
                        {selectedNoticia.autor.charAt(0)}
                      </div>
                      <span className="mr-4">{selectedNoticia.autor}</span>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(selectedNoticia.fecha)}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={closeModal}
                  className="absolute top-4 right-4 bg-black/10 hover:bg-black/20 backdrop-blur-sm text-white p-2 rounded-full transition-colors duration-300"
                  aria-label="Cerrar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 md:p-8">
                <p className="text-lg italic text-foreground/80 mb-6 border-l-4 border-highlight pl-4 py-2">
                  {selectedNoticia.resumen}
                </p>
                <div className="prose prose-lg max-w-none text-foreground/90 whitespace-pre-line">
                  {selectedNoticia.contenido}
                </div>
                <div className="mt-8 flex justify-end">
                  <button 
                    onClick={closeModal}
                    className="px-5 py-2 bg-card-hover hover:bg-card-dark text-foreground rounded-lg transition-colors duration-300"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 