'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useApi } from '@/lib/hooks/useApi';
import { Noticia, Column } from '@/types/api';
import DataTable from '@/components/admin/DataTable';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert, AlertDescription } from '@/components/ui/Alert';

export default function NoticiasAdminPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: noticias, total, isLoading, isError, mutate } = useApi<Noticia>(
    '/noticias/',
    {
      search,
      page: currentPage,
    }
  );

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/noticias/${id}`, { method: 'DELETE' });
      mutate(); // Revalidar los datos después de eliminar
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const columns: Column<Noticia>[] = [
    {
      key: 'imagen_noticia',
      title: 'Imagen',
      render: (row: Noticia) => (
        <div className="flex items-center">
          <Image
            src={row.imagen_noticia || '/placeholder.jpg'}
            alt={row.nombre_noticia}
            width={128}
            height={80}
            className="rounded-lg w-32 h-20 object-cover"
          />
        </div>
      ),
    },
    {
      key: 'nombre_noticia',
      title: 'Título',
      render: (row: Noticia) => (
        <div>
          <div className="font-medium text-gray-900">
            {row.nombre_noticia}
          </div>
          <div className="text-sm text-gray-500">
            {row.description_noticia}
          </div>
        </div>
      ),
    },
    {
      key: 'fecha_noticia',
      title: 'Fecha',
      render: (row: Noticia) => new Date(row.fecha_noticia).toLocaleDateString(),
    },
    {
      key: 'link_noticia',
      title: 'Enlace',
      render: (row: Noticia) => (
        <a
          href={row.link_noticia}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 text-sm"
        >
          Ver noticia
        </a>
      ),
    },
    {
      key: 'actions',
      title: 'Acciones',
      render: (row: Noticia) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/noticias/${row.idnoticia}/edit`)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.idnoticia)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-6">
      {isError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>Error al cargar las noticias</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar noticias..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
          <Button onClick={() => router.push('/admin/noticias/nuevo')}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Noticia
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={noticias}
          isLoading={isLoading}
          pagination={{
            currentPage,
            totalPages: Math.ceil(total / 10),
            onPageChange: setCurrentPage,
          }}
        />
      </div>
    </div>
  );
}
