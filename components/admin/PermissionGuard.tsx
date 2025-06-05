'use client';

import { usePermissions } from '@/lib/permissions';
import { PermissionModels, ModelPermissions } from '@/types/api';

interface PermissionGuardProps {
  children: React.ReactNode;
  model: PermissionModels;
  action: keyof ModelPermissions;
  fallback?: React.ReactNode;
}

/**
 * Componente de orden superior que renderiza sus hijos solo si el usuario
 * actual tiene los permisos necesarios para la acción y modelo especificados.
 * @param children - Elementos a renderizar si el permiso es concedido.
 * @param model - El modelo sobre el cual se verifica el permiso (ej. 'conferencias').
 * @param action - La acción que se quiere realizar (ej. 'view', 'add').
 * @param fallback - Un componente o elemento opcional a renderizar si no hay permisos.
 */
export default function PermissionGuard({
  children,
  model,
  action,
  fallback = null,
}: PermissionGuardProps) {
  const { hasPermission } = usePermissions();

  if (hasPermission(model, action)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
} 