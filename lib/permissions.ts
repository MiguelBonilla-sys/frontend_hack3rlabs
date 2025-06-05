'use client';

import { useAuth } from './auth';
import { ModelPermissions, PermissionModels } from '@/types/api';

/**
 * Hook personalizado para gestionar y verificar los permisos del usuario.
 * Proporciona una API sencilla para comprobar si el usuario puede realizar
 * acciones específicas en diferentes partes de la aplicación.
 */
export function usePermissions() {
  const { user } = useAuth();

  /**
   * Verifica si el usuario tiene un permiso específico para un modelo.
   * Es la función base para todas las demás comprobaciones de permisos.
   * @param model - El nombre del modelo (ej. 'conferencias').
   * @param action - La acción a verificar (ej. 'view', 'add').
   * @returns `true` si el usuario tiene el permiso, `false` en caso contrario.
   */
  const hasPermission = (model: PermissionModels, action: keyof ModelPermissions): boolean => {
    if (!user?.permissions) {
      return false;
    }
    return user.permissions[model]?.[action] ?? false;
  };

  const canView = (model: PermissionModels) => hasPermission(model, 'view');
  const canAdd = (model: PermissionModels) => hasPermission(model, 'add');
  const canChange = (model: PermissionModels) => hasPermission(model, 'change');
  const canDelete = (model: PermissionModels) => hasPermission(model, 'delete');

  const isSuperuser = () => user?.is_superuser === true;
  const isStaff = () => user?.is_staff === true;

  return {
    userPermissions: user?.permissions,
    hasPermission,
    canView,
    canAdd,
    canChange,
    canDelete,
    isSuperuser,
    isStaff,
  };
} 