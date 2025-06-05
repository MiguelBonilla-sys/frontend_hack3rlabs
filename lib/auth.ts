'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { apiClient } from './api';
import { User } from '@/types/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isDevelopmentMode: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  setDevelopmentMode: (enabled: boolean) => void;
}

// Credenciales de desarrollo para fallback
const DEV_CREDENTIALS = [
  { username: 'admin', password: 'Hack3r2024!@#' },
  { username: 'testuser', password: 'test123' },
] as const;

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isDevelopmentMode: process.env.NEXT_PUBLIC_DEV_MODE === 'true',      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        console.log('🔐 Iniciando login para:', username);

        // Validación de entrada
        if (!username?.trim() || !password?.trim()) {
          set({ 
            isLoading: false, 
            error: 'Usuario y contraseña son requeridos' 
          });
          return false;
        }        try {
          const response = await apiClient.login(username.trim(), password);
          
          // Verificar que la respuesta tenga la estructura esperada
          if (!response || !response.key) {
            throw new Error('Respuesta de login inválida: falta token de autenticación');
          }
          
          const { key: token, user } = response;
          
          // Verificar que el usuario esté presente y tenga las propiedades necesarias
          if (!user || !user.username) {
            throw new Error('Respuesta de login inválida: datos de usuario incompletos');
          }
          
          console.log('✅ Login exitoso en Railway:', { 
            username: user.username, 
            is_staff: user.is_staff || false,
            is_superuser: user.is_superuser || false,
            hasUserData: Boolean(user),
            responseStructure: {
              hasKey: Boolean(response.key),
              hasUser: Boolean(response.user),
              userKeys: user ? Object.keys(user) : []
            }
          });

          Cookies.set('auth_token', token, { expires: 7 }); // 7 días
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (error) {
          console.error('❌ Error en login de Railway:', error);
          
          // Detectar si es un error de red (backend caído)
          const errorMessage = error instanceof Error ? error.message : String(error);
          const isNetworkError = errorMessage.includes('Error de red') || 
                                 errorMessage.includes('Backend no disponible') ||
                                 errorMessage.includes('502') || 
                                 errorMessage.includes('503') || 
                                 errorMessage.includes('ECONNREFUSED');

          if (isNetworkError && get().isDevelopmentMode) {
            // Modo fallback para desarrollo
            const isValidDevCredentials = DEV_CREDENTIALS.some(
              cred => cred.username === username && cred.password === password
            );

            if (isValidDevCredentials) {
              // Simular respuesta exitosa en modo desarrollo
              const mockUser: User = {
                id: 1,
                username,
                email: `${username}@hack3rlabs.com`,
                first_name: username === 'admin' ? 'Administrador' : 'Usuario',
                last_name: 'Test',
                is_staff: username === 'admin',
                is_superuser: username === 'admin',
              };

              const mockToken = `dev-token-${Date.now()}`;
              
              Cookies.set('auth_token', mockToken, { expires: 7 });
              set({
                user: mockUser,
                token: mockToken,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });

              console.warn('🚨 Usando credenciales de desarrollo (Railway no disponible)');
              return true;
            }
          }

          // Manejar errores específicos de Railway
          let userError = 'Error al iniciar sesión. Intenta nuevamente.';
          
          if (isNetworkError) {
            userError = get().isDevelopmentMode 
              ? 'Railway no disponible. En desarrollo, usa: admin/Hack3r2024!@# o testuser/test123'
              : 'Servicio temporalmente no disponible. Intenta más tarde.';
          } else if (errorMessage.includes('Errores de validación')) {
            userError = errorMessage; // Mostrar errores específicos de Django
          } else if (errorMessage.includes('401') || errorMessage.includes('credenciales') || 
                     errorMessage.includes('unauthorized') || errorMessage.includes('authentication')) {
            userError = 'Credenciales incorrectas. Verifica tu usuario y contraseña.';
          } else if (errorMessage.includes('400')) {
            userError = 'Datos de login inválidos. Verifica los campos.';
          }

          set({ 
            isLoading: false, 
            error: userError,
            isAuthenticated: false 
          });
          
          return false;
        }
      },

      logout: () => {
        // Intentar logout en el backend si hay conexión
        if (get().token && !get().isDevelopmentMode) {
          apiClient.logout().catch(err => 
            console.warn('Error en logout del backend:', err)
          );
        }

        Cookies.remove('auth_token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      checkAuth: async () => {
        const token = Cookies.get('auth_token');
        if (!token) {
          set({ isAuthenticated: false, error: null });
          return;
        }        // Si es un token de desarrollo, validar directamente
        if (token.startsWith('dev-token-') && get().isDevelopmentMode) {
          const mockUser: User = {
            id: 1,
            username: 'dev-user',
            email: 'dev@hack3rlabs.com',
            first_name: 'Desarrollo',
            last_name: 'Usuario',
            is_staff: true,
            is_superuser: true,
          };

          set({
            user: mockUser,
            token,
            isAuthenticated: true,
            error: null,
          });
          return;
        }

        try {
          const user = await apiClient.getProfile();
          set({
            user,
            token,
            isAuthenticated: true,
            error: null,
          });
        } catch (error) {
          console.warn('Token inválido o expirado:', error);
          // Token inválido
          Cookies.remove('auth_token');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setDevelopmentMode: (enabled: boolean) => {
        set({ isDevelopmentMode: enabled });
      },
    }),
    {
      name: 'auth-storage',
      // Solo persistir datos seguros, no errores temporales
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isDevelopmentMode: state.isDevelopmentMode,
      }),
    }
  )
);
