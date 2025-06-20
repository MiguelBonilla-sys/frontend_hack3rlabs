'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import DataTable from '@/components/admin/DataTable';
import { Column } from '@/types/api';
import { useApi } from '@/lib/hooks/useApi';
import { usePermissions } from '@/lib/hooks/usePermissions';

interface AdminPageProps<T> {
  title: string;
  endpoint: string;
  columns: Column<T>[];
  createPath: string;
  searchPlaceholder?: string;
  onDelete?: (id: number) => Promise<void>;
  modelName: string;
}

export default function AdminPage<T>({
  title,
  endpoint,
  columns,
  createPath,
  searchPlaceholder = 'Buscar...',
  onDelete,
  modelName,
}: AdminPageProps<T>) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { can, isLoading: isLoadingPermissions } = usePermissions();

  const { data, total, isLoading: isLoadingData, isError } = useApi<T>(
    endpoint,
    {
      search,
      page: currentPage,
    }
  );

  const isLoading = isLoadingPermissions || isLoadingData;

  if (!can.read(modelName)) {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertDescription>
          No tienes permisos para ver esta sección
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {isError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>Error al cargar los datos</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
          {can.create(modelName) && (
            <Button onClick={() => router.push(createPath)}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo {title}
            </Button>
          )}
        </div>

        <DataTable
          columns={columns.filter(col => 
            col.key !== 'actions' || 
            (can.update(modelName) || can.delete(modelName))
          )}
          data={data}
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