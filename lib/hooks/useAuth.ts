'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types/api';
import { apiClient } from '@/lib/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await apiClient.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiClient.login(email, password);
    apiClient.setToken(response.key);
    setUser(response.user);
    return response;
  };

  const register = async (email: string, password: string) => {
    const response = await apiClient.register(email, password);
    apiClient.setToken(response.key);
    setUser(response.user);
    return response;
  };

  const logout = () => {
    apiClient.clearToken();
    setUser(null);
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
} 