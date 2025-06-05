'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { OfertaEmpleo, PaginatedResponse } from '@/types/api';
import DataTable from '@/components/admin/DataTable';
import { Plus, Search, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function OfertasAdminPage() {
  const [ofertas, setOfertas] = useState<PaginatedResponse<OfertaEmpleo>>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const fetchOfertas = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getOfertas({
        search: search || undefined,
        page: currentPage,
      });
      setOfertas(data);
    } catch (error) {
      console.error('Error fetching ofertas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOfertas();
  }, [search, currentPage]);

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta oferta?')) {
      try {
        await apiClient.deleteOferta(id);
        fetchOfertas(); // Refrescar la lista
      } catch (error) {
        console.error('Error deleting oferta:', error);
        alert('Error al eliminar la oferta');
      }
    }
  };

  const isOfertaExpired = (fechaExpiracion?: string) => {
    if (!fechaExpiracion) return false;
    return new Date(fechaExpiracion) < new Date();
  };



  const columns = [
    {
      key: 'imagen',
      title: 'Logo',
      render: (value: string, item: OfertaEmpleo) => (
        <div className="flex items-center">
          <img
            src={value || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=40&h=40&fit=crop&crop=center'}
            alt={item.empresa}
            className="h-10 w-10 rounded object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=40&h=40&fit=crop&crop=center';
            }}
          />
        </div>
      ),
    },
    {
      key: 'titulo_empleo',
      title: 'Oferta',
      render: (value: string, item: OfertaEmpleo) => (
        <div>
          <div className="font-medium text-gray-900">
            {value}
          </div>
          <div className="text-sm text-gray-500">
            {item.empresa}
          </div>
        </div>
      ),
    },
    {
      key: 'link_oferta',
      title: 'Enlace',
      render: (value: string) => (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 text-sm"
        >
          Ver oferta
        </a>
      ),
    },
    {
      key: 'fecha_expiracion',
      title: 'Estado',
      render: (value: string) => {
        const isExpired = isOfertaExpired(value);
        return (
          <div className="flex items-center gap-1">
            {isExpired ? (
              <>
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-xs text-red-600">
                  Expirada
                </span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-600">
                  Vigente
                </span>
              </>
            )}
          </div>
        );
      },
    },
    {
      key: 'fecha_publicacion',
      title: 'Publicada',
      render: (value: string) => (
        <span className="text-xs text-gray-500">
          {new Date(value).toLocaleDateString('es-ES')}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Acciones',
      render: (_: unknown, item: OfertaEmpleo) => (
        <div className="flex space-x-2">
          <button
            onClick={() => router.push(`/admin/ofertas/${item.idoferta}/edit`)}
            className="text-blue-600 hover:text-blue-700"
            title="Editar oferta"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(item.idoferta)}
            className="text-red-600 hover:text-red-700"
            title="Eliminar oferta"
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
            Gestión de Ofertas de Empleo
          </h1>
          <p className="mt-2 text-gray-600">
            Administra las oportunidades laborales para la comunidad
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/ofertas/nuevo')}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Oferta
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar ofertas de empleo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      <DataTable
        data={ofertas.results}
        columns={columns}
        isLoading={isLoading}
        pagination={{
          current: currentPage,
          total: Math.ceil(ofertas.count / 20),
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
}
