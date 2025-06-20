'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
// import { Badge } from '@/components/ui/Badge'; // Eliminar porque ya no se usa
import AdminPage from '@/components/admin/AdminPage';
import { Conferencia } from '@/types/api';
import { usePermissions } from '@/lib/hooks/usePermissions';

export default function ConferenciasPage() {
  const router = useRouter();
  const { can } = usePermissions();

  const handleDelete = async (id: number) => {
    if (!can('delete', 'conferencias')) return;
    try {
      await fetch(`/api/conferencias/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const columns = [
    {
      key: 'imagen_conferencia',
      title: 'Imagen',
      render: (row: Conferencia) => (
        <div className="flex items-center">
          <Image
            src={row.imagen_conferencia || '/placeholder.jpg'}
            alt={row.nombre_conferencia}
            width={128}
            height={80}
            className="rounded-lg w-32 h-20 object-cover"
          />
        </div>
      ),
    },
    {
      key: 'nombre_conferencia',
      title: 'Nombre',
      render: (row: Conferencia) => (
        <div>
          <p className="font-medium">{row.nombre_conferencia}</p>
          <p className="text-sm text-gray-500">{row.ponente_conferencia}</p>
        </div>
      ),
    },
    {
      key: 'fecha_conferencia',
      title: 'Fecha y Hora',
      render: (row: Conferencia) => (
        <div>
          <p>{row.fecha_conferencia ? new Date(row.fecha_conferencia).toLocaleDateString() : ''}</p>
        </div>
      ),
    },
    {
      key: 'link_conferencia',
      title: 'Enlace',
      render: (row: Conferencia) => (
        <a href={row.link_conferencia} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          Ver enlace
        </a>
      ),
    },
    {
      key: 'actions',
      title: 'Acciones',
      render: (row: Conferencia) => (
        <div className="flex items-center gap-2">
          {can('update', 'conferencias') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/admin/conferencias/${row.idconferencia}/edit`)}
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
          {can('delete', 'conferencias') && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(row.idconferencia)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminPage<Conferencia>
      title="Conferencia"
      endpoint="/conferencias"
      columns={columns}
      createPath="/admin/conferencias/nuevo"
      searchPlaceholder="Buscar conferencias..."
      onDelete={handleDelete}
      modelName="conferencias"
    />
  );
}
