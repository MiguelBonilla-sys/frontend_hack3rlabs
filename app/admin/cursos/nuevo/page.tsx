'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '@/lib/api';
import { Save, ArrowLeft } from 'lucide-react';

const cursoSchema = z.object({
  nombre_curso: z.string().min(1, 'El nombre es requerido').max(120),
  fechainicial_curso: z.string().optional(),
  fechafinal_curso: z.string().optional(),
  link_curso: z.string().url('Debe ser una URL válida'),
  descripcion_curso: z.string().min(1, 'La descripción es requerida').max(1200),
});

type CursoForm = z.infer<typeof cursoSchema>;

export default function NuevoCursoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CursoForm>({
    resolver: zodResolver(cursoSchema),
  });

  const onSubmit = async (data: CursoForm) => {
    setIsLoading(true);
    try {
      // El creador debería ser el ID del usuario actual
      await apiClient.createCurso({
        ...data,
        creador: 1, // Este debería ser el ID del usuario actual
      });
      router.push('/admin/cursos');
    } catch (error) {
      console.error('Error creating curso:', error);
      alert('Error al crear el curso');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          Nuevo Curso
        </h1>
        <p className="mt-2 text-gray-600">
          Crea un nuevo curso de formación
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Curso *
            </label>
            <input
              {...register('nombre_curso')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Ej: Introducción a la Ciberseguridad"
            />
            {errors.nombre_curso && (
              <p className="mt-1 text-sm text-red-600">{errors.nombre_curso.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Inicio
              </label>
              <input
                {...register('fechainicial_curso')}
                type="datetime-local"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              {errors.fechainicial_curso && (
                <p className="mt-1 text-sm text-red-600">{errors.fechainicial_curso.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Fin
              </label>
              <input
                {...register('fechafinal_curso')}
                type="datetime-local"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              {errors.fechafinal_curso && (
                <p className="mt-1 text-sm text-red-600">{errors.fechafinal_curso.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enlace del Curso *
            </label>
            <input
              {...register('link_curso')}
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="https://ejemplo.com/curso"
            />
            {errors.link_curso && (
              <p className="mt-1 text-sm text-red-600">{errors.link_curso.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              {...register('descripcion_curso')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Describe el contenido, objetivos y metodología del curso..."
            />
            {errors.descripcion_curso && (
              <p className="mt-1 text-sm text-red-600">{errors.descripcion_curso.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Guardando...' : 'Guardar Curso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
