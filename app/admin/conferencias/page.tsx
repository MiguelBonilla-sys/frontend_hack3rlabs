'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Conferencia, PaginatedResponse } from '@/types/api';
import DataTable from '@/components/admin/DataTable';
import { Plus, Search, Edit, Trash2, Calendar, User } from 'lucide-react';
import { usePermissions } from '@/lib/permissions';
import Link from 'next/link';
import PermissionGuard from '@/components/admin/PermissionGuard';
import { useAuth } from '@/lib/auth';

export default function ConferenciasAdminPage() {
  const [conferencias, setConferencias] = useState<PaginatedResponse<Conferencia>>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const { canView } = usePermissions();
  const { isLoading: authLoading, user } = useAuth();

  const fetchConferencias = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getConferencias({
        search: search || undefined,
        page: currentPage,
      });
      setConferencias(data);
    } catch (error) {
      console.error('Error fetching conferencias:', error);
    } finally {
      setIsLoading(false);
    }
  }, [search, currentPage]);

  useEffect(() => {
    fetchConferencias();
  }, [fetchConferencias]);

  useEffect(() => {
    if (!authLoading && user && !canView('conferencias')) {
      router.push('/admin');
    }
  }, [authLoading, user, canView, router]);

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta conferencia?')) {
      try {
        await apiClient.deleteConferencia(id);
        fetchConferencias(); // Refrescar la lista
      } catch (error) {
        console.error('Error deleting conferencia:', error);
        alert('Error al eliminar la conferencia');
      }
    }
  };

  const isConferenciaPast = (fecha: string) => {
    return new Date(fecha) < new Date();
  };

  const isConferenciaSoon = (fecha: string) => {
    const now = new Date();
    const conferenceDate = new Date(fecha);
    const diffTime = conferenceDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  const columns = [
    {
      key: 'imagen_conferencia',
      title: 'Imagen',
      render: (value: string, item: Conferencia) => (
        <div className="flex items-center justify-center">
          <img
            src={value || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&h=75&fit=crop&crop=center'}
            alt={item.nombre_conferencia}
            className="h-10 w-14 rounded object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&h=75&fit=crop&crop=center';
            }}
          />
        </div>
      ),
    },
    {
      key: 'nombre_conferencia',
      title: 'Conferencia',
      render: (value: string, item: Conferencia) => (
        <div className="min-w-0">
          <div className="font-medium text-gray-900 text-sm truncate">
            {value}
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1 truncate">
            <User className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{item.ponente_conferencia}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'fecha_conferencia',
      title: 'Fecha',
      render: (value: string) => {
        const date = new Date(value);
        const isPast = isConferenciaPast(value);
        const isSoon = isConferenciaSoon(value);
        
        return (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-gray-400 flex-shrink-0" />
            <div className="min-w-0">
              <div className={`text-xs font-medium whitespace-nowrap ${
                isPast 
                  ? 'text-gray-500' 
                  : isSoon 
                    ? 'text-orange-600'
                    : 'text-gray-900'
              }`}>
                {date.toLocaleDateString('es-ES')}
              </div>
              <div className="text-xs text-gray-500 whitespace-nowrap">
                {date.toLocaleTimeString('es-ES', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: 'descripcion_conferencia',
      title: 'Descripción',
      render: (value: string) => (
        <div className="max-w-48">
          <p className="text-xs text-gray-600 line-clamp-2">
            {value}
          </p>
        </div>
      ),
    },
    {
      key: 'estado',
      title: 'Estado',
      render: (_: unknown, item: Conferencia) => {
        const isPast = isConferenciaPast(item.fecha_conferencia);
        const isSoon = isConferenciaSoon(item.fecha_conferencia);
        
        if (isPast) {
          return (
            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full whitespace-nowrap">
              Finalizada
            </span>
          );
        } else if (isSoon) {
          return (
            <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full whitespace-nowrap">
              Próximamente
            </span>
          );
        } else {
          return (
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full whitespace-nowrap">
              Programada
            </span>
          );
        }
      },
    },
    {
      key: 'actions',
      title: 'Acciones',
      render: (_: unknown, item: Conferencia) => (
        <div className="flex space-x-1">
          <PermissionGuard model="conferencias" action="change">
            <Link
              href={`/admin/conferencias/${item.idconferencia}/edit`}
              className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
              title="Editar conferencia"
              aria-label="Editar conferencia"
            >
              <Edit className="h-4 w-4" />
            </Link>
          </PermissionGuard>
          <PermissionGuard model="conferencias" action="delete">
            <button
              onClick={() => handleDelete(item.idconferencia)}
              className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              title="Eliminar conferencia"
              aria-label="Eliminar conferencia"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </PermissionGuard>
        </div>
      ),
    },
  ];

  if (isLoading || !canView('conferencias')) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Verificando permisos...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Conferencias
          </h1>
          <p className="mt-2 text-gray-600">
            Administra las conferencias y eventos de H4ck3r L4bs
          </p>
        </div>
        <PermissionGuard model="conferencias" action="add">
          <Link
            href="/admin/conferencias/nuevo"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Conferencia
          </Link>
        </PermissionGuard>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar conferencias..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      <DataTable<Conferencia>
        data={conferencias.results}
        columns={columns}
        isLoading={isLoading}
        pagination={{
          current: currentPage,
          total: Math.max(1, Math.ceil((conferencias.count || 0) / 20)),
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
}

// Componente actualizado - Las columnas de acciones (editar/eliminar) están implementadas
