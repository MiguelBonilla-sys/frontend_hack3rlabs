'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '@/lib/api';
import { Proyecto } from '@/types/api';
import { useAuth } from '@/lib/auth';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

const proyectoSchema = z.object({
  nombre_proyecto: z.string().min(1, 'El nombre es requerido'),
  description_proyecto: z.string().min(1, 'La descripción es requerida'),
  link_proyecto: z.string().url('Debe ser una URL válida').min(1, 'El link es requerido'),
});

type ProyectoForm = z.infer<typeof proyectoSchema>;

export default function EditProyectoPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProyectoForm>({
    resolver: zodResolver(proyectoSchema),
  });

  const fetchProyecto = useCallback(async () => {
    try {
      setIsLoading(true);
      const proyectoData = await apiClient.getProyecto(Number(params.id));
      setProyecto(proyectoData);
      
      // Poblar el formulario con los datos existentes
      setValue('nombre_proyecto', proyectoData.nombre_proyecto || '');
      setValue('description_proyecto', proyectoData.description_proyecto || '');
      setValue('link_proyecto', proyectoData.link_proyecto || '');
    } catch (error) {
      console.error('Error fetching proyecto:', error);
      setError('Error al cargar el proyecto');
      router.push('/admin/proyectos');
    } finally {
      setIsLoading(false);
    }
  }, [params.id, router, setValue]);

  useEffect(() => {
    fetchProyecto();
  }, [fetchProyecto]);

  const onSubmit = async (data: ProyectoForm) => {
    setIsSaving(true);
    setError('');

    try {
      if (!user?.id) {
        throw new Error('Usuario no autenticado');
      }

      const updateData = {
        ...data,
        creador: user.id,
      };

      console.log('📝 Actualizando proyecto con datos:', updateData);

      // Usar el método básico de actualización (los proyectos no tienen imágenes)
      await apiClient.updateProyecto(Number(params.id), updateData);
      
      console.log('✅ Proyecto actualizado exitosamente');
      router.push('/admin/proyectos');
    } catch (err) {
      console.error('❌ Error updating proyecto:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error al actualizar el proyecto: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!proyecto) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Proyecto no encontrado</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Editar Proyecto
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Modifica la información del proyecto
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Proyecto *
            </label>
            <input
              {...register('nombre_proyecto')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Nombre descriptivo del proyecto"
            />
            {errors.nombre_proyecto && (
              <p className="mt-1 text-sm text-red-600">
                {errors.nombre_proyecto.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link del Proyecto *
            </label>
            <input
              {...register('link_proyecto')}
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="https://github.com/usuario/proyecto"
            />
            {errors.link_proyecto && (
              <p className="mt-1 text-sm text-red-600">
                {errors.link_proyecto.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              URL del repositorio, demo o documentación del proyecto
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción del Proyecto *
            </label>
            <textarea
              {...register('description_proyecto')}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Describe el objetivo, tecnologías utilizadas, características principales y cualquier información relevante del proyecto..."
            />
            {errors.description_proyecto && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description_proyecto.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Actualizando...' : 'Actualizar Proyecto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 