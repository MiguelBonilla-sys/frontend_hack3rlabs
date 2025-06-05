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

const ofertaSchema = z.object({
  titulo_empleo: z.string().min(1, 'El título es requerido'),
  empresa: z.string().min(1, 'La empresa es requerida'),
  descripcion_empleo: z.string().min(1, 'La descripción es requerida'),
  link_oferta: z.string().url('Debe ser una URL válida'),
  fecha_expiracion: z.string().optional(),
});

type OfertaForm = z.infer<typeof ofertaSchema>;

export default function NuevaOferta() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OfertaForm>({
    resolver: zodResolver(ofertaSchema),
  });

  const onSubmit = async (data: OfertaForm) => {
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

      console.log('📝 Creando oferta con datos:', processedData);
      console.log('🖼️ Archivo de imagen:', imageFile);

      // Usar el método con archivo
      await apiClient.createOfertaWithFile(processedData, imageFile || undefined);
      
      console.log('✅ Oferta creada exitosamente');
      router.push('/admin/ofertas');
    } catch (err) {
      console.error('❌ Error creating oferta:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error al crear la oferta: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (file: File | null) => {
    setImageFile(file);
    console.log('📁 Archivo seleccionado:', file?.name);
  };

  // Fecha mínima (hoy)
  const today = new Date().toISOString().split('T')[0];

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
            Nueva Oferta de Empleo
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Publica una nueva oportunidad laboral para la comunidad
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
                Título del Empleo *
              </label>
              <input
                {...register('titulo_empleo')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Analista de Ciberseguridad Junior"
              />
              {errors.titulo_empleo && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.titulo_empleo.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Empresa *
              </label>
              <input
                {...register('empresa')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Nombre de la empresa"
              />
              {errors.empresa && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.empresa.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción del Empleo *
            </label>
            <textarea
              {...register('descripcion_empleo')}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Descripción detallada del puesto, responsabilidades, requisitos..."
            />
            {errors.descripcion_empleo && (
              <p className="mt-1 text-sm text-red-600">
                {errors.descripcion_empleo.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link de la Oferta *
              </label>
              <input
                {...register('link_oferta')}
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="https://empresa.com/ofertas/123"
              />
              {errors.link_oferta && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.link_oferta.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Expiración (Opcional)
              </label>
              <input
                {...register('fecha_expiracion')}
                type="date"
                min={today}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              {errors.fecha_expiracion && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.fecha_expiracion.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo de la Empresa
            </label>
            <FileUpload
              onFileSelect={handleFileSelect}
              currentFile={imageFile}
              accept="image/*"
            />
            <p className="mt-2 text-xs text-gray-500">
              Sube el logo de la empresa para la oferta
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
              {isLoading ? 'Publicando...' : 'Publicar Oferta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
