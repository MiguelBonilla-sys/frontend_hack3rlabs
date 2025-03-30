'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

// Datos simulados para el carrusel - en una aplicación real se obtendrían de API
const slides = [
  {
    id: 1,
    title: 'Formando Líderes en Ciberseguridad',
    text: 'Descubre el mundo de la seguridad informática con nuestros cursos especializados y eventos exclusivos.',
    imagePath: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y29kaW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=1200&q=80',
    cta: 'Ver cursos'
  },
  {
    id: 2,
    title: 'Aprende Hacking Ético',
    text: 'Desarrolla habilidades prácticas en un entorno seguro y ético, preparándote para los desafíos del mundo real.',
    imagePath: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fGN5YmVyc2VjdXJpdHl8ZW58MHwwfDB8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    cta: 'Explorar proyectos'
  },
  {
    id: 3,
    title: 'Comunidad de Expertos',
    text: 'Forma parte de una comunidad activa de profesionales y estudiantes apasionados por la seguridad informática.',
    imagePath: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGNvbXB1dGVyfGVufDB8MHwwfHw%3D&auto=format&fit=crop&w=1200&q=80',
    cta: 'Unirse ahora'
  }
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)

  const goToSlide = useCallback((index: number) => {
    if (isAnimating || index === currentSlide) return
    
    setIsAnimating(true)
    setDirection(index > currentSlide ? 'right' : 'left')
    setCurrentSlide(index)
    
    setTimeout(() => {
      setIsAnimating(false)
    }, 500)
  }, [currentSlide, isAnimating])

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length)
  }, [currentSlide, goToSlide])

  const prevSlide = useCallback(() => {
    goToSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1)
  }, [currentSlide, goToSlide])

  // Rotación automática de slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 7000)

    return () => clearInterval(interval)
  }, [nextSlide])

  return (
    <section className="mt-20 overflow-hidden relative">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <div className="bg-gradient-to-r from-accent to-secondary rounded-2xl overflow-hidden shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 z-10"></div>
          
          <div className="relative h-[450px] md:h-[500px] w-full overflow-hidden">
            {slides.map((slide, index) => (
              <div 
                key={slide.id}
                className={`absolute inset-0 w-full h-full transition-all duration-500 ease-in-out ${
                  index === currentSlide 
                    ? 'opacity-100 translate-x-0 z-20' 
                    : direction === 'right' && index === (currentSlide - 1 + slides.length) % slides.length
                      ? 'opacity-0 -translate-x-full z-10'
                      : direction === 'left' && index === (currentSlide + 1) % slides.length
                        ? 'opacity-0 translate-x-full z-10'
                        : 'opacity-0 translate-x-0 z-0'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-transparent to-transparent z-10"></div>
                <Image 
                  src={slide.imagePath} 
                  alt={slide.title}
                  fill={true}
                  className={`object-cover transition-transform duration-10000 ease-out ${
                    index === currentSlide ? 'scale-105' : 'scale-100'
                  }`}
                  sizes="100vw"
                  priority={index === 0}
                />

                <div className="absolute inset-0 z-20 flex items-center">
                  <div className={`w-full md:w-3/5 lg:w-1/2 px-6 md:px-12 py-8 text-white ${
                    index === 2 ? 'md:pl-16 lg:pl-20' : ''
                  }`}>
                    <h2 
                      className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 transition-all duration-700 ${
                        index === currentSlide 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 -translate-y-10'
                      } ${index === 2 ? 'max-w-[80%] mb-8' : ''}`}
                    >
                      {slide.title}
                    </h2>
                    <p 
                      className={`text-base md:text-lg mb-8 transition-all duration-700 delay-100 ${
                        index === currentSlide 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 -translate-y-10'
                      } ${index === 2 ? 'max-w-[80%] mb-10' : ''}`}
                    >
                      {slide.text}
                    </p>
                    <div className={`${index === 2 ? 'mt-4' : 'mt-2'}`}>
                      <button 
                        className={`px-6 py-3 bg-highlight text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-highlight/30 transform hover:-translate-y-1 ${
                          index === currentSlide 
                            ? 'opacity-100 translate-y-0 delay-200' 
                            : 'opacity-0 -translate-y-10'
                        }`}
                      >
                        {slide.cta}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Controles de navegación */}
            <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center">
              <div className="flex space-x-2">
                {slides.map((_, index) => (
                  <button 
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-white w-8 md:w-10' 
                        : 'bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Ir al slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            
            {/* Flechas laterales */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-all duration-300 text-white hover:scale-110"
              aria-label="Anterior"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-all duration-300 text-white hover:scale-110"
              aria-label="Siguiente"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Decoración adicional */}
      <div className="absolute -left-10 -bottom-24 w-40 h-40 bg-highlight/20 rounded-full blur-3xl"></div>
      <div className="absolute -right-10 -top-24 w-40 h-40 bg-orange/20 rounded-full blur-3xl"></div>
    </section>
  )
} 