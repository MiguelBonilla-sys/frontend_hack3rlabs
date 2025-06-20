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

const noticiaSchema = z.object({
  nombre_noticia: z.string().min(1, 'El nombre es requerido'),
  fecha_noticia: z.string().min(1, 'La fecha es requerida'),
  link_noticia: z.string().url('Debe ser una URL válida'),
  description_noticia: z.string().min(1, 'La descripción es requerida'),
  fuente: z.string().optional(),
  categoria: z.string().optional(),
  autor: z.string().optional(),
  contenido: z.string().optional(),
  imagen_noticia: z.any().optional().refine((file) => !file || file instanceof File, {
    message: 'La imagen debe ser un archivo válido',
  }),
});

type NoticiaForm = z.infer<typeof noticiaSchema>;

export default function NuevaNoticiaPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<NoticiaForm>({
    resolver: zodResolver(noticiaSchema),
    defaultValues: {
      fecha_noticia: new Date().toISOString().slice(0, 16), // Fecha actual por defecto
    },
  });

  const onSubmit = async (data: NoticiaForm) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      if (!user?.id) {
        throw new Error('Usuario no autenticado');
      }

      // Subir la imagen a Cloudinary y obtener la URL
      const imageUrl = await apiClient.uploadImage(data.imagen_noticia as File);

      const processedData = {
        ...data,
        creador: user.id,
        imagen_noticia: imageUrl, // Enviar la URL de la imagen
      };

      // Usar el método con la URL de la imagen
      await apiClient.createNoticia(processedData);
      router.push('/admin/noticias');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(`Error al crear la noticia: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (file: File | null) => {
    if (file) {
      setValue('imagen_noticia', file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Volver
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nueva Noticia</h1>
            <p className="text-gray-600">Crear una nueva noticia para H4ck3r L4bs</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Nombre/Título */}
            <div className="sm:col-span-2">
              <label htmlFor="nombre_noticia" className="block text-sm font-medium text-gray-700 mb-2">
                Título de la Noticia *
              </label>
              <input
                type="text"
                id="nombre_noticia"
                {...register('nombre_noticia')}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                placeholder="Ingresa el título de la noticia"
              />
              {errors.nombre_noticia && (
                <p className="mt-1 text-sm text-red-600">{errors.nombre_noticia.message}</p>
              )}
            </div>

            {/* Fecha */}
            <div>
              <label htmlFor="fecha_noticia" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Publicación *
              </label>
              <input
                type="datetime-local"
                id="fecha_noticia"
                {...register('fecha_noticia')}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              />
              {errors.fecha_noticia && (
                <p className="mt-1 text-sm text-red-600">{errors.fecha_noticia.message}</p>
              )}
            </div>

            {/* Link */}
            <div>
              <label htmlFor="link_noticia" className="block text-sm font-medium text-gray-700 mb-2">
                Link de la Noticia *
              </label>
              <input
                type="url"
                id="link_noticia"
                {...register('link_noticia')}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                placeholder="https://ejemplo.com/noticia"
              />
              {errors.link_noticia && (
                <p className="mt-1 text-sm text-red-600">{errors.link_noticia.message}</p>
              )}
            </div>

            {/* Descripción */}
            <div className="sm:col-span-2">
              <label htmlFor="description_noticia" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                id="description_noticia"
                {...register('description_noticia')}
                rows={3}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                placeholder="Descripción de la noticia"
              />
              {errors.description_noticia && (
                <p className="mt-1 text-sm text-red-600">{errors.description_noticia.message}</p>
              )}
            </div>

            {/* Campos opcionales en una fila */}
            <div>
              <label htmlFor="autor" className="block text-sm font-medium text-gray-700 mb-2">
                Autor
              </label>
              <input
                type="text"
                id="autor"
                {...register('autor')}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                placeholder="Nombre del autor"
              />
            </div>

            <div>
              <label htmlFor="fuente" className="block text-sm font-medium text-gray-700 mb-2">
                Fuente
              </label>
              <input
                type="text"
                id="fuente"
                {...register('fuente')}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                placeholder="Fuente de la noticia"
              />
            </div>

            <div>
              <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                id="categoria"
                {...register('categoria')}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              >
                <option value="">Seleccionar categoría</option>
                <option value="tecnologia">Tecnología</option>
                <option value="seguridad">Ciberseguridad</option>
                <option value="eventos">Eventos</option>
                <option value="comunidad">Comunidad</option>
                <option value="educacion">Educación</option>
              </select>
            </div>

            {/* Imagen */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen de la Noticia *
              </label>
              <FileUpload onFileSelect={handleFileSelect} accept="image/*" />
              {errors.imagen_noticia && (
                <p className="mt-1 text-sm text-red-600">
                  {String(errors.imagen_noticia.message)}
                </p>
              )}
            </div>

            {/* Contenido completo */}
            <div className="sm:col-span-2">
              <label htmlFor="contenido" className="block text-sm font-medium text-gray-700 mb-2">
                Contenido Completo
              </label>
              <textarea
                id="contenido"
                {...register('contenido')}
                rows={8}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                placeholder="Contenido completo de la noticia (opcional)"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Guardando...' : 'Guardar Noticia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 