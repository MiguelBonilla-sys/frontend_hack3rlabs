'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Noticia, PaginatedResponse } from '@/types/api';
import DataTable from '@/components/admin/DataTable';
import { Plus, Search, Edit, Trash2, ExternalLink } from 'lucide-react';

export default function NoticiasAdminPage() {
  const [noticias, setNoticias] = useState<PaginatedResponse<Noticia>>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const fetchNoticias = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getNoticias({
        search: search || undefined,
        page: currentPage,
      });
      setNoticias(data);
    } catch (error) {
      console.error('Error fetching noticias:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNoticias();
  }, [search, currentPage]);

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
      try {
        await apiClient.deleteNoticia(id);
        fetchNoticias();
      } catch (error) {
        console.error('Error deleting noticia:', error);
        alert('Error al eliminar la noticia');
      }
    }
  };

  const columns = [
    {
      key: 'imagen_noticia',
      title: 'Imagen',
      render: (value: string) => (
        <div className="w-12 h-12">
          <img
            src={value || '/placeholder.jpg'}
            alt="Noticia"
            className="w-full h-full object-cover rounded"
          />
        </div>
      ),
    },
    {
      key: 'nombre_noticia',
      title: 'Título',
      render: (value: string) => (
        <div className="font-medium text-gray-900 max-w-xs truncate">{value}</div>
      ),
    },
    {
      key: 'fecha_noticia',
      title: 'Fecha',
      render: (value: string) => (
        <div className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'fuente',
      title: 'Fuente',
      render: (value: string) => (
        <div className="text-sm text-gray-600">{value || 'H4ck3r L4bs'}</div>
      ),
    },
    {
      key: 'link_noticia',
      title: 'Enlace',
      render: (value: string) => (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      ),
    },
    {
      key: 'actions',
      title: 'Acciones',
      render: (_: unknown, item: Noticia) => (
        <div className="flex space-x-2">
          <button
            onClick={() => router.push(`/admin/noticias/${item.idnoticia}/edit`)}
            className="text-blue-600 hover:text-blue-700"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(item.idnoticia)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Noticias
          </h1>
          <p className="mt-2 text-gray-600">
            Administra las noticias de ciberseguridad
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/noticias/nuevo')}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Noticia
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar noticias..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      <DataTable
        data={noticias.results}
        columns={columns}
        isLoading={isLoading}
        pagination={{
          current: currentPage,
          total: Math.ceil(noticias.count / 20),
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
}
