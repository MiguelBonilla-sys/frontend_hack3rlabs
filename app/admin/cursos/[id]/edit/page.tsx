'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Curso } from '@/types/api';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

export default function EditCursoPage() {
  const router = useRouter();
  const params = useParams();
  const [curso, setCurso] = useState<Curso | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    nombre_curso: '',
    modalidad_curso: '',
    fechainicial_curso: '',
    fechafinal_curso: '',
    descripcion_curso: '',
    duracion_curso: 0,
    estado_curso: true,
  });

  const fetchCurso = useCallback(async () => {
    try {
      setIsLoading(true);
      const cursoData = await apiClient.getCurso(Number(params.id));
      setCurso(cursoData);
      setFormData({
        nombre_curso: cursoData.nombre_curso ?? '',
        modalidad_curso: cursoData.modalidad_curso ?? '',
        fechainicial_curso: cursoData.fechainicial_curso ?? '',
        fechafinal_curso: cursoData.fechafinal_curso ?? '',
        descripcion_curso: cursoData.descripcion_curso ?? '',
        duracion_curso: cursoData.duracion_curso ?? 0,
        estado_curso: cursoData.estado_curso ?? true,
      });
    } catch (error) {
      console.error('Error fetching curso:', error);
      alert('Error al cargar el curso');
      router.push('/admin/cursos');
    } finally {
      setIsLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    fetchCurso();
  }, [fetchCurso]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await apiClient.updateCurso(Number(params.id), formData);
      alert('Curso actualizado exitosamente');
      router.push('/admin/cursos');
    } catch (error) {
      console.error('Error updating curso:', error);
      alert('Error al actualizar el curso');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: string | number | boolean = value;
    
    if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      newValue = Number(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!curso) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Curso no encontrado</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => router.push('/admin/cursos')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Cursos
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          Editar Curso: {curso.nombre_curso}
        </h1>
        <p className="mt-2 text-gray-600">
          Modifica la información del curso
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nombre_curso" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Curso *
              </label>
              <input
                type="text"
                id="nombre_curso"
                name="nombre_curso"
                value={formData.nombre_curso}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label htmlFor="modalidad_curso" className="block text-sm font-medium text-gray-700 mb-2">
                Modalidad
              </label>
              <select
                id="modalidad_curso"
                name="modalidad_curso"
                value={formData.modalidad_curso}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Seleccionar modalidad</option>
                <option value="Presencial">Presencial</option>
                <option value="Virtual">Virtual</option>
                <option value="Híbrido">Híbrido</option>
              </select>
            </div>

            <div>
              <label htmlFor="fechainicial_curso" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Inicio
              </label>
              <input
                type="date"
                id="fechainicial_curso"
                name="fechainicial_curso"
                value={formData.fechainicial_curso}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label htmlFor="fechafinal_curso" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Fin
              </label>
              <input
                type="date"
                id="fechafinal_curso"
                name="fechafinal_curso"
                value={formData.fechafinal_curso}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label htmlFor="duracion_curso" className="block text-sm font-medium text-gray-700 mb-2">
                Duración (horas)
              </label>
              <input
                type="number"
                id="duracion_curso"
                name="duracion_curso"
                value={formData.duracion_curso}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="estado_curso"
                  checked={formData.estado_curso}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Curso Activo
                </span>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="descripcion_curso" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              id="descripcion_curso"
              name="descripcion_curso"
              value={formData.descripcion_curso}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Describe el contenido y objetivos del curso..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/cursos')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
