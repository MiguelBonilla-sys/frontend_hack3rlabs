'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { apiClient } from '@/lib/api';

export interface UserPermissions {
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
}

export interface Permissions {
  [key: string]: UserPermissions;
}

export function usePermissions() {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<Permissions | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user) {
        setPermissions(null);
        setIsLoading(false);
        return;
      }

      try {
        const userPermissions = await apiClient.getUserPermissions();
        setPermissions(userPermissions);
      } catch (error) {
        console.error('Error fetching permissions:', error);
        setPermissions(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, [user]);

  const can = (action: 'create' | 'read' | 'update' | 'delete', model: string) => {
    if (!permissions || !permissions[model]) return false;
    return permissions[model][`can_${action}`];
  };

  // Extend can object with convenience methods
  const extendedCan = Object.assign(can, {
    create: (model: string) => can('create', model),
    read: (model: string) => can('read', model),
    update: (model: string) => can('update', model),
    delete: (model: string) => can('delete', model),
  });

  const hasPermission = (permission: string) => {
    // Simple permission check - can be extended based on requirements
    // You can implement specific permission logic here
    console.log('Checking permission:', permission);
    return user?.is_superuser || false;
  };

  const isStaff = user?.is_staff || false;
  const isSuperuser = user?.is_superuser || false;
  const isAuthenticated = !!user;

  return { 
    can: extendedCan, 
    isLoading, 
    hasPermission, 
    isStaff, 
    isSuperuser, 
    isAuthenticated 
  };
} 