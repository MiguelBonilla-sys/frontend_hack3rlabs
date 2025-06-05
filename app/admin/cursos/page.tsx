'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Curso, PaginatedResponse } from '@/types/api';
import DataTable from '@/components/admin/DataTable';
import { Plus, Search, Edit, Trash2, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function CursosAdminPage() {
  const [cursos, setCursos] = useState<PaginatedResponse<Curso>>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const router = useRouter();

  const fetchCursos = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await apiClient.getCursos({
        search: search || undefined,
        page: currentPage,
      });
      setCursos(data);
    } catch (error) {
      console.error('Error fetching cursos:', error);
      setError('Error al cargar los cursos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCursos();
  }, [search, currentPage]);

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este curso?')) {
      try {
        await apiClient.deleteCurso(id);
        fetchCursos(); // Refrescar la lista
      } catch (error) {
        console.error('Error deleting curso:', error);
        alert('Error al eliminar el curso');
      }
    }
  };

  const isCursoActive = (fechaInicial?: string, fechaFinal?: string) => {
    if (!fechaInicial) return false;
    
    const now = new Date();
    const inicio = new Date(fechaInicial);
    const fin = fechaFinal ? new Date(fechaFinal) : null;
    
    if (fin) {
      return now >= inicio && now <= fin;
    }
    
    return now >= inicio;
  };

  const isCursoUpcoming = (fechaInicial?: string) => {
    if (!fechaInicial) return false;
    return new Date(fechaInicial) > new Date();
  };

  const getModalidadColor = (modalidad?: string) => {
    switch (modalidad?.toLowerCase()) {
      case 'presencial':
        return 'bg-blue-100 text-blue-800';
      case 'virtual':
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'hibrido':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    {
      key: 'nombre_curso',
      title: 'Curso',
      render: (value: string, item: Curso) => (
        <div>
          <div className="font-medium text-gray-900">
            {value}
          </div>
          {item.descripcion_curso && (
            <div className="text-sm text-gray-500 truncate max-w-xs">
              {item.descripcion_curso}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'modalidad_curso',
      title: 'Modalidad',
      render: (value?: string) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getModalidadColor(value)}`}>
          {value || 'No especificada'}
        </span>
      ),
    },
    {
      key: 'fechas',
      title: 'Fechas',
      render: (_: unknown, item: Curso) => (
        <div className="space-y-1">
          {item.fechainicial_curso && (
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="h-3 w-3 text-gray-400" />
              <span className="text-gray-600">
                Inicio: {new Date(item.fechainicial_curso).toLocaleDateString('es-ES')}
              </span>
            </div>
          )}
          {item.fechafinal_curso && (
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="h-3 w-3 text-gray-400" />
              <span className="text-gray-600">
                Fin: {new Date(item.fechafinal_curso).toLocaleDateString('es-ES')}
              </span>
            </div>
          )}
          {!item.fechainicial_curso && !item.fechafinal_curso && (
            <span className="text-xs text-gray-400">Sin fechas definidas</span>
          )}
        </div>
      ),
    },
    {
      key: 'duracion_curso',
      title: 'Duración',
      render: (value?: number) => (
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {value ? `${value} horas` : 'No especificada'}
          </span>
        </div>
      ),
    },
    {
      key: 'estado',
      title: 'Estado',
      render: (_: unknown, item: Curso) => {
        const isActive = isCursoActive(item.fechainicial_curso, item.fechafinal_curso);
        const isUpcoming = isCursoUpcoming(item.fechainicial_curso);
        const isEnabled = item.estado_curso !== false;

        if (!isEnabled) {
          return (
            <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
              <XCircle className="h-3 w-3" />
              Inactivo
            </span>
          );
        }

        if (isActive) {
          return (
            <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              <CheckCircle className="h-3 w-3" />
              En curso
            </span>
          );
        }

        if (isUpcoming) {
          return (
            <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              <Calendar className="h-3 w-3" />
              Próximamente
            </span>
          );
        }

        return (
          <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            Finalizado
          </span>
        );
      },
    },
    {
      key: 'link_curso',
      title: 'Enlace',
      render: (value: string) => (
        value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700 text-sm"
          >
            Ver curso
          </a>
        ) : (
          <span className="text-gray-400 text-sm">Sin enlace</span>
        )
      ),
    },
    {
      key: 'actions',
      title: 'Acciones',
      render: (_: unknown, item: Curso) => (
        <div className="flex space-x-2">
          <button
            onClick={() => router.push(`/admin/cursos/${item.idcursos}/edit`)}
            className="text-blue-600 hover:text-blue-700"
            title="Editar curso"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(item.idcursos)}
            className="text-red-600 hover:text-red-700"
            title="Eliminar curso"
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
            Gestión de Cursos
          </h1>
          <p className="mt-2 text-gray-600">
            Administra los cursos de formación de H4ck3r L4bs
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/cursos/nuevo')}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Curso
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar cursos por nombre o descripción..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <DataTable<Curso>
          data={cursos.results}
          columns={columns}
          isLoading={isLoading}
          pagination={{
            current: currentPage,
            total: Math.ceil(cursos.count / 20),
            onPageChange: setCurrentPage,
          }}
        />
      </div>
    </div>
  );
}
