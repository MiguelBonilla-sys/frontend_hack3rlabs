'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '@/lib/api';
import { Noticia } from '@/types/api';
import { useAuth } from '@/lib/auth';
import FileUpload from '@/components/admin/FileUpload';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

const noticiaSchema = z.object({
  nombre_noticia: z.string().min(1, 'El título es requerido'),
  link_noticia: z.string().url('Debe ser una URL válida').min(1, 'El link es requerido'),
  description_noticia: z.string().min(1, 'La descripción es requerida'),
  fuente: z.string().min(1, 'La fuente es requerida'),
});

type NoticiaForm = z.infer<typeof noticiaSchema>;

export default function EditNoticiaPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<NoticiaForm>({
    resolver: zodResolver(noticiaSchema),
  });

  const fetchNoticia = useCallback(async () => {
    try {
      setIsLoading(true);
      const noticiaData = await apiClient.getNoticia(Number(params.id));
      setNoticia(noticiaData);
      
      // Poblar el formulario con los datos existentes
      setValue('nombre_noticia', noticiaData.nombre_noticia || '');
      setValue('link_noticia', noticiaData.link_noticia || '');
      setValue('description_noticia', noticiaData.description_noticia || '');
      setValue('fuente', noticiaData.fuente || '');
    } catch (error) {
      console.error('Error fetching noticia:', error);
      setError('Error al cargar la noticia');
      router.push('/admin/noticias');
    } finally {
      setIsLoading(false);
    }
  }, [params.id, router, setValue]);

  useEffect(() => {
    fetchNoticia();
  }, [fetchNoticia]);

  const onSubmit = async (data: NoticiaForm) => {
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

      console.log('📝 Actualizando noticia con datos:', updateData);
      console.log('🖼️ Archivo de imagen:', imageFile);

      // Usar el método específico para actualizar con archivos
      await apiClient.updateNoticiaWithFile(Number(params.id), updateData, imageFile || undefined);
      
      console.log('✅ Noticia actualizada exitosamente');
      router.push('/admin/noticias');
    } catch (err) {
      console.error('❌ Error updating noticia:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error al actualizar la noticia: ${errorMessage}`);
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

  if (!noticia) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Noticia no encontrada</p>
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
            Editar Noticia
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Modifica la información de la noticia
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
              Título de la Noticia *
            </label>
            <input
              {...register('nombre_noticia')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Título impactante de la noticia"
            />
            {errors.nombre_noticia && (
              <p className="mt-1 text-sm text-red-600">
                {errors.nombre_noticia.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link de la Noticia *
              </label>
              <input
                {...register('link_noticia')}
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="https://ejemplo.com/noticia"
              />
              {errors.link_noticia && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.link_noticia.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuente *
              </label>
              <input
                {...register('fuente')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Nombre del medio o fuente"
              />
              {errors.fuente && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.fuente.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción de la Noticia *
            </label>
            <textarea
              {...register('description_noticia')}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Describe el contenido y relevancia de la noticia..."
            />
            {errors.description_noticia && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description_noticia.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen de la Noticia
            </label>
            
            {/* Mostrar imagen actual si existe */}
            {noticia.imagen_noticia && !imageFile && (
              <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <p className="text-sm text-gray-600 mb-2">Imagen actual:</p>
                <img
                  src={noticia.imagen_noticia}
                  alt="Imagen actual"
                  className="h-32 w-48 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=400&h=300&fit=crop&crop=center';
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
              {noticia.imagen_noticia 
                ? 'Sube una nueva imagen para reemplazar la actual o deja vacío para mantenerla' 
                : 'Sube una imagen para la noticia'
              }
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
              {isSaving ? 'Actualizando...' : 'Actualizar Noticia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 