'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Proyecto, PaginatedResponse } from '@/types/api';
import DataTable from '@/components/admin/DataTable';
import { Plus, Search, Edit, Trash2, ExternalLink } from 'lucide-react';

export default function ProyectosAdminPage() {
  const [proyectos, setProyectos] = useState<PaginatedResponse<Proyecto>>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const fetchProyectos = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getProyectos({
        search: search || undefined,
        page: currentPage,
      });
      setProyectos(data);
    } catch (error) {
      console.error('Error fetching proyectos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProyectos();
  }, [search, currentPage]);

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      try {
        await apiClient.deleteProyecto(id);
        fetchProyectos(); // Refrescar la lista
      } catch (error) {
        console.error('Error deleting proyecto:', error);
        alert('Error al eliminar el proyecto');
      }
    }
  };

  const columns = [
    {
      key: 'nombre_proyecto',
      title: 'Proyecto',
      render: (value: string, item: Proyecto) => (
        <div>
          <div className="font-medium text-gray-900">
            {value}
          </div>
          <div className="text-sm text-gray-500 truncate max-w-xs">
            {item.description_proyecto}
          </div>
        </div>
      ),
    },
    {
      key: 'fecha_proyecto',
      title: 'Fecha',
      render: (value: string) => (
        <span className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString('es-ES')}
        </span>
      ),
    },
    {
      key: 'link_proyecto',
      title: 'Link',
      render: (value: string) => (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 hover:text-green-700 flex items-center gap-1"
        >
          <ExternalLink className="h-4 w-4" />
          Ver Proyecto
        </a>
      ),
    },
    {
      key: 'integrantes',
      title: 'Integrantes',
      render: (value: number[]) => (
        <span className="text-sm text-gray-600">
          {value?.length || 0} miembro(s)
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Acciones',
      render: (_: unknown, item: Proyecto) => (
        <div className="flex space-x-2">
          <button
            onClick={() => router.push(`/admin/proyectos/${item.idproyectos}/edit`)}
            className="text-blue-600 hover:text-blue-700"
            title="Editar proyecto"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(item.idproyectos)}
            className="text-red-600 hover:text-red-700"
            title="Eliminar proyecto"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Proyectos
          </h1>
          <p className="mt-2 text-gray-600">
            Administra los proyectos de la comunidad H4ck3r L4bs
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/proyectos/nuevo')}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Proyecto
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar proyectos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      <DataTable
        data={proyectos.results}
        columns={columns}
        isLoading={isLoading}
        pagination={{
          current: currentPage,
          total: Math.ceil(proyectos.count / 20),
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
}
