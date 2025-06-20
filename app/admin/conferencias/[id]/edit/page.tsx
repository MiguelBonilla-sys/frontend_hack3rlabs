'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '@/lib/api';
import { Conferencia } from '@/types/api';
import { useAuth } from '@/lib/auth';
import FileUpload from '@/components/admin/FileUpload';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Image from 'next/image';

const conferenciaSchema = z.object({
  nombre_conferencia: z.string().min(1, 'El nombre es requerido'),
  ponente_conferencia: z.string().min(1, 'El ponente es requerido'),
  descripcion_conferencia: z.string().min(1, 'La descripción es requerida'),
  fecha_conferencia: z.string().min(1, 'La fecha es requerida'),
  link_conferencia: z.string().url('Debe ser una URL válida').min(1, 'El link es requerido'),
});

type ConferenciaForm = z.infer<typeof conferenciaSchema>;

export default function EditConferenciaPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [conferencia, setConferencia] = useState<Conferencia | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ConferenciaForm>({
    resolver: zodResolver(conferenciaSchema),
  });

  const fetchConferencia = useCallback(async () => {
    try {
      setIsLoading(true);
      const conferenciaData = await apiClient.getConferencia(Number(params.id));
      setConferencia(conferenciaData);
      
      // Poblar el formulario con los datos existentes
      setValue('nombre_conferencia', conferenciaData.nombre_conferencia || '');
      setValue('ponente_conferencia', conferenciaData.ponente_conferencia || '');
      setValue('descripcion_conferencia', conferenciaData.descripcion_conferencia || '');
      setValue('link_conferencia', conferenciaData.link_conferencia || '');
      
      // Formatear la fecha para datetime-local
      if (conferenciaData.fecha_conferencia) {
        const date = new Date(conferenciaData.fecha_conferencia);
        const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
        setValue('fecha_conferencia', formattedDate);
      }
    } catch (error) {
      console.error('Error fetching conferencia:', error);
      setError('Error al cargar la conferencia');
      router.push('/admin/conferencias');
    } finally {
      setIsLoading(false);
    }
  }, [params.id, router, setValue]);

  useEffect(() => {
    fetchConferencia();
  }, [fetchConferencia]);

  const onSubmit = async (data: ConferenciaForm) => {
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

      console.log('📝 Actualizando conferencia con datos:', updateData);
      console.log('🖼️ Archivo de imagen:', imageFile);

      // Usar el método específico para actualizar con archivos
      await apiClient.updateConferenciaWithFile(Number(params.id), updateData, imageFile || undefined);
      
      console.log('✅ Conferencia actualizada exitosamente');
      router.push('/admin/conferencias');
    } catch (err) {
      console.error('❌ Error updating conferencia:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error al actualizar la conferencia: ${errorMessage}`);
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

  if (!conferencia) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Conferencia no encontrada</p>
      </div>
    );
  }

  // Fecha y hora mínima (ahora)
  const now = new Date();
  const minDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

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
            Editar Conferencia
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Modifica la información de la conferencia
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
                Nombre de la Conferencia *
              </label>
              <input
                {...register('nombre_conferencia')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Introducción a la Ciberseguridad"
              />
              {errors.nombre_conferencia && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.nombre_conferencia.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ponente *
              </label>
              <input
                {...register('ponente_conferencia')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Dr. Juan Pérez"
              />
              {errors.ponente_conferencia && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.ponente_conferencia.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha y Hora de la Conferencia *
            </label>
            <input
              {...register('fecha_conferencia')}
              type="datetime-local"
              min={minDateTime}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            {errors.fecha_conferencia && (
              <p className="mt-1 text-sm text-red-600">
                {errors.fecha_conferencia.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Programa la conferencia para una fecha y hora futura
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción de la Conferencia *
            </label>
            <textarea
              {...register('descripcion_conferencia')}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Describe el contenido, objetivos y temática de la conferencia..."
            />
            {errors.descripcion_conferencia && (
              <p className="mt-1 text-sm text-red-600">
                {errors.descripcion_conferencia.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link de la Conferencia *
            </label>
            <input
              {...register('link_conferencia')}
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="https://meet.google.com/... o https://zoom.us/..."
            />
            {errors.link_conferencia && (
              <p className="mt-1 text-sm text-red-600">
                {errors.link_conferencia.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              URL para acceso virtual (Zoom, Google Meet, etc.) o más información
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen de la Conferencia
            </label>
            
            {/* Mostrar imagen actual si existe */}
            {conferencia.imagen_conferencia && !imageFile && (
              <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <p className="text-sm text-gray-600 mb-3 font-medium">📸 Imagen actual:</p>
                <div className="flex justify-center">
                  <Image
                    src={conferencia.imagen_conferencia}
                    alt="Imagen actual de la conferencia"
                    width={200}
                    height={200}
                    className="h-48 w-72 object-cover rounded-lg shadow-md border border-gray-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop&crop=center';
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Esta es la imagen actual de la conferencia
                </p>
              </div>
            )}
            
            {/* Mostrar preview de la nueva imagen si se selecciona */}
            {imageFile && (
              <div className="mb-4 p-4 border border-green-200 rounded-lg bg-green-50">
                <p className="text-sm text-green-700 mb-3 font-medium">🆕 Nueva imagen seleccionada:</p>
                <div className="flex justify-center">
                  <Image
                    src={URL.createObjectURL(imageFile)}
                    alt="Preview de nueva imagen"
                    width={200}
                    height={200}
                    className="h-48 w-72 object-cover rounded-lg shadow-md border border-green-300"
                  />
                </div>
                <p className="text-xs text-green-600 mt-2 text-center">
                  Esta imagen reemplazará la actual al guardar
                </p>
              </div>
            )}
            
            <FileUpload
              onFileSelect={handleFileSelect}
              currentFile={imageFile}
              accept="image/*"
            />
            <p className="mt-2 text-xs text-gray-500">
              {conferencia.imagen_conferencia 
                ? 'Sube una nueva imagen para reemplazar la actual o deja el campo vacío para mantener la imagen existente' 
                : 'Sube una imagen promocional para la conferencia'
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
              {isSaving ? 'Actualizando...' : 'Actualizar Conferencia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 