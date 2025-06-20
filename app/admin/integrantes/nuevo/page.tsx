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

const integranteSchema = z.object({
  nombre_integrante: z.string().min(1, 'El nombre es requerido'),
  reseña: z.string().min(1, 'La reseña es requerida'),
  semestre: z.string().min(1, 'El semestre es requerido'),
  estado: z.boolean(),
  correo: z.string().email('El correo debe ser válido'),
  link_git: z.string().url('Debe ser una URL válida de GitHub').refine(
    (url) => url.includes('github.com'),
    'Debe ser una URL de GitHub válida'
  ),
  imagen: z.any().optional().refine((file) => !file || file instanceof File, {
    message: 'La imagen debe ser un archivo válido',
  }),
});

type IntegranteForm = z.infer<typeof integranteSchema>;

export default function NuevoIntegrante() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IntegranteForm>({
    resolver: zodResolver(integranteSchema),
    defaultValues: {
      estado: true, // Por defecto activo
    },
  });

  const onSubmit = async (data: IntegranteForm) => {
    setIsLoading(true);
    setError('');

    try {
      if (!user?.id) {
        throw new Error('Usuario no autenticado');
      }

      // Subir la imagen a Cloudinary y obtener la URL
      const imageUrl = await apiClient.uploadImage(data.imagen as File);

      const processedData = {
        ...data,
        creador: user.id,
        imagen: imageUrl, // Enviar la URL de la imagen
      };

      // Usar el método con la URL de la imagen
      await apiClient.createIntegrante(processedData);
      router.push('/admin/integrantes');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error al crear el integrante: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (file: File | null) => {
    if (file) {
      setValue('imagen', file);
    }
  };

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
            Nuevo Integrante
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Agrega un nuevo miembro al equipo de H4ck3r Labs
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
                placeholder="Juan Pérez"
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
              <select
                {...register('semestre')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Seleccionar semestre</option>
                {[1,2,3,4,5,6,7,8,9,10].map(sem => (
                  <option key={sem} value={sem.toString()}>{sem}° Semestre</option>
                ))}
              </select>
              {errors.semestre && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.semestre.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reseña Profesional *
            </label>
            <textarea
              {...register('reseña')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Describe las habilidades, intereses y logros del integrante..."
            />
            {errors.reseña && (
              <p className="mt-1 text-sm text-red-600">
                {errors.reseña.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado *
              </label>
              <select
                {...register('estado', { 
                  setValueAs: (value) => value === 'true' 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
              {errors.estado && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.estado.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico *
              </label>
              <input
                {...register('correo')}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="juan.perez@ejemplo.com"
              />
              {errors.correo && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.correo.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GitHub *
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen del Integrante *
            </label>
            <FileUpload onFileSelect={handleFileSelect} accept="image/*" />
                          {errors.imagen && (
                <p className="mt-1 text-sm text-red-600">
                  {String(errors.imagen.message)}
                </p>
              )}
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
              {isLoading ? 'Guardando...' : 'Agregar Integrante'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
