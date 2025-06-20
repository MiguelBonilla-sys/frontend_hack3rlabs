'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { Alert, AlertDescription } from '@/components/ui/Alert';

interface PermissionGuardProps {
  children: ReactNode;
  permission?: string;
  modelName?: string;
  action?: 'view' | 'add' | 'change' | 'delete';
  requireStaff?: boolean;
  requireSuperuser?: boolean;
  fallback?: ReactNode;
}

export default function PermissionGuard({
  children,
  permission,
  modelName,
  action = 'view',
  requireStaff = false,
  requireSuperuser = false,
  fallback,
}: PermissionGuardProps) {
  const router = useRouter();
  const { hasPermission, isStaff, isSuperuser, isLoading, isAuthenticated } = usePermissions();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  if (requireSuperuser && !isSuperuser) {
    return fallback || (
      <Alert variant="destructive" className="m-6">
        <AlertDescription>
          Esta sección requiere permisos de superusuario
        </AlertDescription>
      </Alert>
    );
  }

  if (requireStaff && !isStaff) {
    return fallback || (
      <Alert variant="destructive" className="m-6">
        <AlertDescription>
          Esta sección requiere permisos de staff
        </AlertDescription>
      </Alert>
    );
  }

  if (permission && !hasPermission(permission)) {
    return fallback || (
      <Alert variant="destructive" className="m-6">
        <AlertDescription>
          No tienes los permisos necesarios para acceder a esta sección
        </AlertDescription>
      </Alert>
    );
  }

  if (modelName) {
    const fullPermission = `${modelName}.${action}.${modelName}`;
    if (!hasPermission(fullPermission)) {
      return fallback || (
        <Alert variant="destructive" className="m-6">
          <AlertDescription>
            No tienes los permisos necesarios para {action === 'view' ? 'ver' : action === 'add' ? 'crear' : action === 'change' ? 'modificar' : 'eliminar'} {modelName}
          </AlertDescription>
        </Alert>
      );
    }
  }

  return <>{children}</>;
} 