'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import StatsCards from '@/components/admin/StatsCards';
import { Users, BookOpen, Newspaper, Briefcase, Building2, Calendar } from 'lucide-react';

interface DashboardStats {
  totalCursos: number;
  totalNoticias: number;
  totalProyectos: number;
  totalIntegrantes: number;
  totalOfertas: number;
  totalConferencias: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCursos: 0,
    totalNoticias: 0,
    totalProyectos: 0,
    totalIntegrantes: 0,
    totalOfertas: 0,
    totalConferencias: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [cursos, noticias, proyectos, integrantes, ofertas, conferencias] = await Promise.all([
          apiClient.getCursos({ page: 1 }),
          apiClient.getNoticias({ page: 1 }),
          apiClient.getProyectos({ page: 1 }),
          apiClient.getIntegrantes({ page: 1 }),
          apiClient.getOfertas({ page: 1 }),
          apiClient.getConferencias({ page: 1 }),
        ]);

        setStats({
          totalCursos: cursos.count,
          totalNoticias: noticias.count,
          totalProyectos: proyectos.count,
          totalIntegrantes: integrantes.count,
          totalOfertas: ofertas.count,
          totalConferencias: conferencias.count,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Panel de Administración
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Gestiona el contenido de H4ck3r L4bs
        </p>
      </div>

      <StatsCards
        stats={[
          {
            title: 'Total Cursos',
            value: stats.totalCursos,
            icon: BookOpen,
            color: 'blue',
            href: '/admin/cursos',
          },
          {
            title: 'Total Noticias',
            value: stats.totalNoticias,
            icon: Newspaper,
            color: 'green',
            href: '/admin/noticias',
          },
          {
            title: 'Total Proyectos',
            value: stats.totalProyectos,
            icon: Briefcase,
            color: 'purple',
            href: '/admin/proyectos',
          },
          {
            title: 'Total Integrantes',
            value: stats.totalIntegrantes,
            icon: Users,
            color: 'orange',
            href: '/admin/integrantes',
          },
          {
            title: 'Total Ofertas',
            value: stats.totalOfertas,
            icon: Building2,
            color: 'blue',
            href: '/admin/ofertas',
          },
          {
            title: 'Total Conferencias',
            value: stats.totalConferencias,
            icon: Calendar,
            color: 'green',
            href: '/admin/conferencias',
          },
        ]}
      />

      {/* Gráficos y estadísticas adicionales */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Actividad Reciente
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Sistema funcionando correctamente</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">API conectada exitosamente</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Enlaces Útiles
          </h3>
          <div className="space-y-2">
            <a
              href={process.env.NEXT_PUBLIC_API_DOCS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-green-600 hover:text-green-700 text-sm"
            >
              📚 Documentación de la API
            </a>
            <a
              href="https://apihack3r-production.up.railway.app/admin/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-green-600 hover:text-green-700 text-sm"
            >
              🔧 Django Admin
            </a>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-green-600 hover:text-green-700 text-sm"
            >
              🌐 Ver Sitio Público
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
