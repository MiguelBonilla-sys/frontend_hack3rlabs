'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '@/lib/api';
import { Integrante } from '@/types/api';
import { useAuth } from '@/lib/auth';
import FileUpload from '@/components/admin/FileUpload';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

const integranteSchema = z.object({
  nombre_integrante: z.string().min(1, 'El nombre es requerido'),
  semestre: z.string().min(1, 'El semestre es requerido'),
  correo: z.string().email('Debe ser un email válido').min(1, 'El correo es requerido'),
  link_git: z.string().url('Debe ser una URL válida de GitHub').min(1, 'El link de GitHub es requerido'),
  reseña: z.string().min(1, 'La reseña es requerida'),
  estado: z.boolean(),
});

type IntegranteForm = z.infer<typeof integranteSchema>;

export default function EditIntegrantePage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [integrante, setIntegrante] = useState<Integrante | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IntegranteForm>({
    resolver: zodResolver(integranteSchema),
  });

  const fetchIntegrante = useCallback(async () => {
    try {
      setIsLoading(true);
      const integranteData = await apiClient.getIntegrante(Number(params.id));
      setIntegrante(integranteData);
      
      // Poblar el formulario con los datos existentes
      setValue('nombre_integrante', integranteData.nombre_integrante || '');
      setValue('semestre', integranteData.semestre || '');
      setValue('correo', integranteData.correo || '');
      setValue('link_git', integranteData.link_git || '');
      setValue('reseña', integranteData.reseña || '');
      setValue('estado', integranteData.estado || false);
    } catch (error) {
      console.error('Error fetching integrante:', error);
      setError('Error al cargar el integrante');
      router.push('/admin/integrantes');
    } finally {
      setIsLoading(false);
    }
  }, [params.id, router, setValue]);

  useEffect(() => {
    fetchIntegrante();
  }, [fetchIntegrante]);

  const onSubmit = async (data: IntegranteForm) => {
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

      console.log('📝 Actualizando integrante con datos:', updateData);
      console.log('🖼️ Archivo de imagen:', imageFile);

      // Usar el método específico para actualizar con archivos
      await apiClient.updateIntegranteWithFile(Number(params.id), updateData, imageFile || undefined);
      
      console.log('✅ Integrante actualizado exitosamente');
      router.push('/admin/integrantes');
    } catch (err) {
      console.error('❌ Error updating integrante:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error al actualizar el integrante: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileSelect = (file: File | null) => {
    setImageFile(file);
    console.log('📁 Archivo seleccionado:', file?.name);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!integrante) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Integrante no encontrado</p>
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
            Editar Integrante
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Modifica la información del integrante
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <input
                {...register('nombre_integrante')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Nombre completo del integrante"
              />
              {errors.nombre_integrante && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.nombre_integrante.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semestre *
              </label>
              <input
                {...register('semestre')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Ej: 8vo semestre"
              />
              {errors.semestre && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.semestre.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico *
              </label>
              <input
                {...register('correo')}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="correo@ejemplo.com"
              />
              {errors.correo && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.correo.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub Profile *
              </label>
              <input
                {...register('link_git')}
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="https://github.com/usuario"
              />
              {errors.link_git && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.link_git.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reseña Personal *
            </label>
            <textarea
              {...register('reseña')}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Describe tus habilidades, experiencia y objetivos profesionales..."
            />
            {errors.reseña && (
              <p className="mt-1 text-sm text-red-600">
                {errors.reseña.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto de Perfil
            </label>
            
            {/* Mostrar imagen actual si existe */}
            {integrante.imagen && !imageFile && (
              <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <p className="text-sm text-gray-600 mb-2">Imagen actual:</p>
                <img
                  src={integrante.imagen}
                  alt="Imagen actual"
                  className="h-32 w-32 object-cover rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=center';
                  }}
                />
              </div>
            )}
            
            <FileUpload
              onFileSelect={handleFileSelect}
              currentFile={imageFile}
              accept="image/*"
            />
            <p className="mt-2 text-xs text-gray-500">
              {integrante.imagen 
                ? 'Sube una nueva imagen para reemplazar la actual o deja vacío para mantenerla' 
                : 'Sube una foto de perfil'
              }
            </p>
          </div>

          <div className="flex items-center">
            <label className="flex items-center">
              <input
                {...register('estado')}
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Integrante activo</span>
            </label>
            <p className="ml-4 text-xs text-gray-500">
              Los integrantes activos aparecen en la página principal
            </p>
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
              {isSaving ? 'Actualizando...' : 'Actualizar Integrante'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 