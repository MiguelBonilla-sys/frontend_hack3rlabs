'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import FileUpload from '@/components/admin/FileUpload';
import { ArrowLeft, Save } from 'lucide-react';

const conferenciaSchema = z.object({
  nombre_conferencia: z.string().min(1, 'El nombre es requerido'),
  ponente_conferencia: z.string().min(1, 'El ponente es requerido'),
  descripcion_conferencia: z.string().min(1, 'La descripción es requerida'),
  fecha_conferencia: z.string().min(1, 'La fecha es requerida'),
  link_conferencia: z.string().url('Debe ser una URL válida').min(1, 'El link es requerido'),
});

type ConferenciaForm = z.infer<typeof conferenciaSchema>;

export default function NuevaConferencia() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConferenciaForm>({
    resolver: zodResolver(conferenciaSchema),
  });

  const onSubmit = async (data: ConferenciaForm) => {
    setIsLoading(true);
    setError('');

    try {
      if (!user?.id) {
        throw new Error('Usuario no autenticado');
      }

      const processedData = {
        ...data,
        creador: user.id,
      };

      console.log('📝 Creando conferencia con datos:', processedData);
      console.log('🖼️ Archivo de imagen:', imageFile);

      // Usar el método con archivo
      await apiClient.createConferenciaWithFile(processedData, imageFile || undefined);
      
      console.log('✅ Conferencia creada exitosamente');
      router.push('/admin/conferencias');
    } catch (err) {
      console.error('❌ Error creating conferencia:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error al crear la conferencia: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (file: File | null) => {
    setImageFile(file);
    console.log('📁 Archivo seleccionado:', file?.name);
  };

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
            Nueva Conferencia
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Programa una nueva conferencia o evento para la comunidad
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
            <FileUpload
              onFileSelect={handleFileSelect}
              currentFile={imageFile}
              accept="image/*"
            />
            <p className="mt-2 text-xs text-gray-500">
              Sube una imagen promocional para la conferencia
            </p>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Programando...' : 'Programar Conferencia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
