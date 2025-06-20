'use client';

import { useRouter } from 'next/navigation';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import AdminPage from '@/components/admin/AdminPage';
import { Curso } from '@/types/api';
import { usePermissions } from '@/lib/hooks/usePermissions';

export default function CursosPage() {
  const router = useRouter();
  const { can } = usePermissions();

  const handleDelete = async (id: number) => {
    if (!can('delete', 'cursos')) return;
    try {
      await fetch(`/api/cursos/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const columns = [
    {
      key: 'nombre_curso',
      title: 'Nombre',
      render: (row: Curso) => (
        <div>
          <p className="font-medium">{row.nombre_curso}</p>
          <p className="text-sm text-gray-500">{row.descripcion_curso}</p>
        </div>
      ),
    },
    {
      key: 'fechainicial_curso',
      title: 'Fecha Inicio',
      render: (row: Curso) => (
        <div>
          <p>{row.fechainicial_curso ? new Date(row.fechainicial_curso).toLocaleDateString() : 'No definida'}</p>
        </div>
      ),
    },
    {
      key: 'fechafinal_curso',
      title: 'Fecha Fin',
      render: (row: Curso) => (
        <div>
          <p>{row.fechafinal_curso ? new Date(row.fechafinal_curso).toLocaleDateString() : 'No definida'}</p>
        </div>
      ),
    },
    {
      key: 'link_curso',
      title: 'Enlace',
      render: (row: Curso) => (
        <a href={row.link_curso} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          Ver curso
        </a>
      ),
    },
    {
      key: 'actions',
      title: 'Acciones',
      render: (row: Curso) => (
        <div className="flex items-center gap-2">
          {can('update', 'cursos') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/admin/cursos/${row.idcursos}/edit`)}
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
          {can('delete', 'cursos') && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(row.idcursos)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminPage<Curso>
      title="Curso"
      endpoint="/cursos"
      columns={columns}
      createPath="/admin/cursos/nuevo"
      searchPlaceholder="Buscar cursos..."
      onDelete={handleDelete}
      modelName="cursos"
    />
  );
}
