'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { apiClient } from '@/lib/api';
import { Integrante, PaginatedResponse } from '@/types/api';
import DataTable from '@/components/admin/DataTable';
import { Plus, Search, Edit, Trash2, ExternalLink, UserCheck, UserX } from 'lucide-react';

export default function IntegrantesAdminPage() {
  const [integrantes, setIntegrantes] = useState<PaginatedResponse<Integrante>>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const fetchIntegrantes = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getIntegrantes({
        search: search || undefined,
        page: currentPage,
      });
      setIntegrantes(data);
    } catch (error) {
      console.error('Error fetching integrantes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [search, currentPage]);

  useEffect(() => {
    fetchIntegrantes();
  }, [fetchIntegrantes]);

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este integrante?')) {
      try {
        await apiClient.deleteIntegrante(id);
        fetchIntegrantes(); // Refrescar la lista
      } catch (error) {
        console.error('Error deleting integrante:', error);
        alert('Error al eliminar el integrante');
      }
    }
  };

  const toggleEstado = async (integrante: Integrante) => {
    try {
      await apiClient.updateIntegrante(integrante.idintegrantes, {
        estado: !integrante.estado,
      });
      fetchIntegrantes(); // Refrescar la lista
    } catch (error) {
      console.error('Error updating integrante status:', error);
      alert('Error al actualizar el estado del integrante');
    }
  };

  const columns = [
    {
      key: 'imagen',
      title: 'Foto',
      render: (row: Integrante) => (
        <div className="flex items-center">
          <Image
            src={row.imagen || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
            alt={row.nombre_integrante}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        </div>
      ),
    },
    {
      key: 'nombre_integrante',
      title: 'Integrante',
      render: (row: Integrante) => (
        <div>
          <div className="font-medium text-gray-900">
            {row.nombre_integrante}
          </div>
          <div className="text-sm text-gray-500">
            {row.correo}
          </div>
        </div>
      ),
    },
    {
      key: 'semestre',
      title: 'Semestre',
      render: (row: Integrante) => (
        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
          {row.semestre}
        </span>
      ),
    },
    {
      key: 'link_git',
      title: 'GitHub',
      render: (row: Integrante) => (
        <a
          href={row.link_git}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 hover:text-green-700 flex items-center gap-1"
        >
          <ExternalLink className="h-4 w-4" />
          GitHub
        </a>
      ),
    },
    {
      key: 'estado',
      title: 'Estado',
      render: (row: Integrante) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            row.estado
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {row.estado ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Acciones',
      render: (row: Integrante) => (
        <div className="flex space-x-2">
          <button
            onClick={() => toggleEstado(row)}
            className={row.estado 
              ? 'text-orange-600 hover:text-orange-700' 
              : 'text-green-600 hover:text-green-700'}
            title={row.estado ? 'Desactivar' : 'Activar'}
          >
            {row.estado ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
          </button>
          <button
            onClick={() => router.push(`/admin/integrantes/${row.idintegrantes}/edit`)}
            className="text-blue-600 hover:text-blue-700"
            title="Editar integrante"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(row.idintegrantes)}
            className="text-red-600 hover:text-red-700"
            title="Eliminar integrante"
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
            Gestión de Integrantes
          </h1>
          <p className="mt-2 text-gray-600">
            Administra los miembros del equipo H4ck3r L4bs
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/integrantes/nuevo')}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Integrante
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar integrantes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      <DataTable
        data={integrantes.results}
        columns={columns}
        isLoading={isLoading}
        pagination={{
          currentPage,
          totalPages: Math.ceil(integrantes.count / 10),
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
}
