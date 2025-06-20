import useSWR from 'swr';
import { apiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface ApiResponse<T> {
  results: T[];
  count: number;
}

interface UseApiOptions {
  refreshInterval?: number;
  revalidateOnFocus?: boolean;
}

interface ApiError {
  response?: {
    status: number;
  };
}

interface ApiClientResponse {
  data: unknown;
}

const defaultOptions: UseApiOptions = {
  refreshInterval: 5000, // 5 segundos
  revalidateOnFocus: true,
};

export function useApi<T>(
  endpoint: string,
  params?: Record<string, string | number>,
  options: UseApiOptions = defaultOptions
) {
  const router = useRouter();
  const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
  const url = `${endpoint}${queryString}`;

  const fetcher = async (url: string): Promise<ApiResponse<T>> => {
    try {
      const response = await apiClient.get(url) as ApiClientResponse;
      return response.data as ApiResponse<T>;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 401) {
        router.push('/login');
      } else if (apiError.response?.status === 403) {
        throw new Error('No tienes permisos para realizar esta acción');
      }
      throw error;
    }
  };

  const { data, error, isLoading, mutate } = useSWR<ApiResponse<T>>(
    url,
    fetcher,
    {
      refreshInterval: options.refreshInterval,
      revalidateOnFocus: options.revalidateOnFocus,
      dedupingInterval: 2000, // evita múltiples peticiones en 2 segundos
      shouldRetryOnError: (err) => {
        // No reintentar en errores de autenticación o permisos
        if (err.message === 'No tienes permisos para realizar esta acción') {
          return false;
        }
        return true;
      },
    }
  );

  return {
    data: data?.results || [],
    total: data?.count || 0,
    isLoading,
    isError: error,
    mutate,
  };
} 