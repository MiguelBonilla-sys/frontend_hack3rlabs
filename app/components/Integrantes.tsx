'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Integrante {
  id: number
  nombre: string
  rol: string
  bio: string
  imagen: string
  redes: {
    github?: string
    linkedin?: string
    twitter?: string
  }
}

const integrantesData: Integrante[] = [
  {
    id: 1,
    nombre: 'Ana Martínez',
    rol: 'Cybersecurity Analyst',
    bio: 'Especialista en análisis de vulnerabilidades y respuesta a incidentes con más de 5 años de experiencia en el sector financiero.',
    imagen: 'https://randomuser.me/api/portraits/women/44.jpg',
    redes: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com'
    }
  },
  {
    id: 2,
    nombre: 'Carlos Rodríguez',
    rol: 'Ethical Hacker',
    bio: 'Certificado en OSCP y CEH. Ha participado en más de 50 programas de bug bounty descubriendo vulnerabilidades críticas.',
    imagen: 'https://randomuser.me/api/portraits/men/32.jpg',
    redes: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: 3,
    nombre: 'Elena Gómez',
    rol: 'Security Researcher',
    bio: 'Investigadora especializada en criptografía y seguridad de aplicaciones web, con publicaciones en conferencias de seguridad.',
    imagen: 'https://randomuser.me/api/portraits/women/68.jpg',
    redes: {
      github: 'https://github.com',
      twitter: 'https://twitter.com'
    }
  },
  {
    id: 4,
    nombre: 'Miguel López',
    rol: 'DevSecOps Engineer',
    bio: 'Experto en integrar seguridad en pipelines CI/CD y automatización de evaluaciones de seguridad para desarrollo ágil.',
    imagen: 'https://randomuser.me/api/portraits/men/75.jpg',
    redes: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com'
    }
  },
  {
    id: 5,
    nombre: 'Laura Torres',
    rol: 'Digital Forensics Expert',
    bio: 'Especialista en análisis forense digital y recuperación de datos, colaborando con agencias gubernamentales en casos de alta complejidad.',
    imagen: 'https://randomuser.me/api/portraits/women/90.jpg',
    redes: {
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: 6,
    nombre: 'Javier Ruiz',
    rol: 'Security Architect',
    bio: 'Diseñador de arquitecturas seguras para aplicaciones cloud, especializado en AWS y Azure con enfoque Zero-Trust.',
    imagen: 'https://randomuser.me/api/portraits/men/40.jpg',
    redes: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    }
  }
]

export default function Integrantes() {
  const [hover, setHover] = useState<number | null>(null)

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
            Conoce a los expertos detrás de Hack Club, profesionales apasionados por la ciberseguridad y la educación en tecnología.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {integrantesData.map((integrante) => (
            <div 
              key={integrante.id}
              onMouseEnter={() => setHover(integrante.id)}
              onMouseLeave={() => setHover(null)}
              className="bg-card rounded-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 group hover:shadow-xl hover:shadow-highlight/10"
            >
              <div className="relative h-60 overflow-hidden">
                <Image 
                  src={integrante.imagen} 
                  alt={integrante.nombre}
                  fill={true}
                  className="transition-transform duration-500 group-hover:scale-110 object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent opacity-70"></div>
                
                {/* Overlay de redes sociales */}
                <div className={`absolute inset-0 bg-primary/80 flex items-center justify-center gap-4 transition-opacity duration-300 ${hover === integrante.id ? 'opacity-100' : 'opacity-0'}`}>
                  {integrante.redes.github && (
                    <a 
                      href={integrante.redes.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-card rounded-full flex items-center justify-center text-highlight transition-transform duration-300 hover:scale-110 hover:bg-card-hover"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
                    </a>
                  )}
                  {integrante.redes.linkedin && (
                    <a 
                      href={integrante.redes.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-card rounded-full flex items-center justify-center text-highlight transition-transform duration-300 hover:scale-110 hover:bg-card-hover"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  )}
                  {integrante.redes.twitter && (
                    <a 
                      href={integrante.redes.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-card rounded-full flex items-center justify-center text-highlight transition-transform duration-300 hover:scale-110 hover:bg-card-hover"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1 group-hover:text-highlight transition-colors duration-300">
                  {integrante.nombre}
                </h3>
                <p className="text-sm text-foreground/60 font-medium mb-3 border-b border-border pb-3">
                  {integrante.rol}
                </p>
                <p className="text-sm text-foreground/80">
                  {integrante.bio}
                </p>
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