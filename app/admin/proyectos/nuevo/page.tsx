'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '@/lib/api';
import { Integrante } from '@/types/api';
import { ArrowLeft, Save } from 'lucide-react';

const proyectoSchema = z.object({
  nombre_proyecto: z.string().min(1, 'El nombre es requerido'),
  description_proyecto: z.string().min(1, 'La descripción es requerida'),
  link_proyecto: z.string().url('Debe ser una URL válida'),
  fecha_proyecto: z.string().min(1, 'La fecha es requerida'),
  integrantes: z.array(z.number()).min(1, 'Debe seleccionar al menos un integrante'),
});

type ProyectoForm = z.infer<typeof proyectoSchema>;

export default function NuevoProyecto() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [integrantes, setIntegrantes] = useState<Integrante[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProyectoForm>({
    resolver: zodResolver(proyectoSchema),
    defaultValues: {
      fecha_proyecto: new Date().toISOString().split('T')[0],
      integrantes: [],
    },
  });

  const selectedIntegrantes = watch('integrantes');

  useEffect(() => {
    const fetchIntegrantes = async () => {
      try {
        const response = await apiClient.getIntegrantes();
        setIntegrantes(response.results);
      } catch (err) {
        console.error('Error fetching integrantes:', err);
      }
    };

    fetchIntegrantes();
  }, []);

  const onSubmit = async (data: ProyectoForm) => {
    setIsLoading(true);
    setError('');

    try {
      await apiClient.createProyecto({
        ...data,
        creador: 1, // Esto debería venir del usuario autenticado
      });
      router.push('/admin/proyectos');
    } catch (err) {
      setError('Error al crear el proyecto');
      console.error('Error creating proyecto:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIntegranteToggle = (integranteId: number) => {
    const current = selectedIntegrantes || [];
    const newSelection = current.includes(integranteId)
      ? current.filter(id => id !== integranteId)
      : [...current, integranteId];
    setValue('integrantes', newSelection);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Nuevo Proyecto
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Crea un nuevo proyecto para la comunidad
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre del Proyecto
            </label>
            <input
              {...register('nombre_proyecto')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Nombre del proyecto"
            />
            {errors.nombre_proyecto && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.nombre_proyecto.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              {...register('description_proyecto')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Descripción del proyecto"
            />
            {errors.description_proyecto && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.description_proyecto.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Link del Proyecto
            </label>
            <input
              {...register('link_proyecto')}
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="https://github.com/usuario/proyecto"
            />
            {errors.link_proyecto && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.link_proyecto.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fecha del Proyecto
            </label>
            <input
              {...register('fecha_proyecto')}
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.fecha_proyecto && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.fecha_proyecto.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Integrantes del Proyecto
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-4">
              {integrantes.map((integrante) => (
                <label key={integrante.idintegrantes} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedIntegrantes?.includes(integrante.idintegrantes) || false}
                    onChange={() => handleIntegranteToggle(integrante.idintegrantes)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {integrante.nombre_integrante}
                  </span>
                </label>
              ))}
            </div>
            {errors.integrantes && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.integrantes.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 transition-colors"
            >
              <Save className="h-4 w-4" />
              {isLoading ? 'Guardando...' : 'Guardar Proyecto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
