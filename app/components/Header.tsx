'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/90 backdrop-blur-md shadow-lg py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <div className="flex items-center group">
              <span className="text-xl md:text-2xl font-bold text-white font-tech tracking-tight">
                <span className="bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent">H4ck3r</span>
                <span className="transition-colors duration-300 group-hover:text-highlight">L4bs</span>
              </span>
              <div className="ml-2 w-2 h-2 rounded-full bg-highlight animate-pulse"></div>
            </div>
          </Link>

          {/* Navegación Desktop - Centrada */}
          <nav className="hidden md:flex justify-center space-x-1 flex-grow">
            {[
              { name: 'Inicio', href: '/' },
              { name: 'Cursos', href: '/cursos' },
              { name: 'Proyectos', href: '/proyectos' },
              { name: 'Noticias', href: '/noticias' },
              { name: 'Ofertas', href: '/ofertas' },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-4 py-2 text-white/90 hover:text-white font-medium transition-colors duration-200 group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-highlight transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>
          
          {/* Botón Ingresar - Lado derecho */}
          <div className="hidden md:block flex-shrink-0">
            <Link 
              href="/login" 
              className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-white rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 hover:from-cyan-500 hover:to-blue-500"
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-primary rounded-md group-hover:bg-opacity-0">
                Ingresar
              </span>
            </Link>
          </div>

          {/* Toggle Menú Móvil */}
          <button 
            className="md:hidden text-white p-2 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <div className="w-6 flex flex-col items-end justify-center gap-1.5">
              <span 
                className={`block h-0.5 bg-white transition-all duration-300 ease-out ${
                  isMenuOpen 
                    ? 'w-6 -rotate-45 translate-y-2' 
                    : 'w-6'
                }`}
              ></span>
              <span 
                className={`block h-0.5 bg-white transition-all duration-300 ease-out ${
                  isMenuOpen 
                    ? 'w-0 opacity-0' 
                    : 'w-4'
                }`}
              ></span>
              <span 
                className={`block h-0.5 bg-white transition-all duration-300 ease-out ${
                  isMenuOpen 
                    ? 'w-6 rotate-45 -translate-y-2' 
                    : 'w-5'
                }`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {/* Menú Móvil */}
      <nav 
        className={`md:hidden absolute w-full bg-primary/95 backdrop-blur-md transition-all duration-300 ease-in-out overflow-hidden border-t border-border/10 ${
          isMenuOpen 
            ? 'max-h-screen py-5 opacity-100' 
            : 'max-h-0 py-0 opacity-0'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 flex flex-col space-y-3">
          {[
            { name: 'Inicio', href: '/' },
            { name: 'Cursos', href: '/cursos' },
            { name: 'Proyectos', href: '/proyectos' },
            { name: 'Noticias', href: '/noticias' },
            { name: 'Ofertas', href: '/ofertas' },
          ].map((item, index) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={`px-4 py-2 text-white/90 hover:text-white font-medium border-l-2 transition-all duration-300 ${
                index === 0 ? 'border-highlight' : 'border-transparent hover:border-highlight/70'
              }`}
              style={{ 
                transitionDelay: `${index * 50}ms` 
              }}
            >
              {item.name}
            </Link>
          ))}
          <Link 
            href="/login" 
            onClick={() => setIsMenuOpen(false)}
            className="relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-white rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 hover:from-cyan-500 hover:to-blue-500 w-full"
            style={{ transitionDelay: '250ms' }}
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-primary rounded-md group-hover:bg-opacity-0 w-full text-center">
              Ingresar
            </span>
          </Link>
        </div>
      </nav>
    </header>
  )
} 