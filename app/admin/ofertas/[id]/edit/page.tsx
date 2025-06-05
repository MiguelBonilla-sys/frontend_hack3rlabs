'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '@/lib/api';
import { OfertaEmpleo } from '@/types/api';
import { useAuth } from '@/lib/auth';
import FileUpload from '@/components/admin/FileUpload';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

const ofertaSchema = z.object({
  titulo_empleo: z.string().min(1, 'El título es requerido'),
  empresa: z.string().min(1, 'La empresa es requerida'),
  descripcion_empleo: z.string().min(1, 'La descripción es requerida'),
  link_oferta: z.string().url('Debe ser una URL válida').min(1, 'El link es requerido'),
});

type OfertaForm = z.infer<typeof ofertaSchema>;

export default function EditOfertaPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [oferta, setOferta] = useState<OfertaEmpleo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<OfertaForm>({
    resolver: zodResolver(ofertaSchema),
  });

  const fetchOferta = useCallback(async () => {
    try {
      setIsLoading(true);
      const ofertaData = await apiClient.getOferta(Number(params.id));
      setOferta(ofertaData);
      
      // Poblar el formulario con los datos existentes
      setValue('titulo_empleo', ofertaData.titulo_empleo || '');
      setValue('empresa', ofertaData.empresa || '');
      setValue('descripcion_empleo', ofertaData.descripcion_empleo || '');
      setValue('link_oferta', ofertaData.link_oferta || '');
    } catch (error) {
      console.error('Error fetching oferta:', error);
      setError('Error al cargar la oferta');
      router.push('/admin/ofertas');
    } finally {
      setIsLoading(false);
    }
  }, [params.id, router, setValue]);

  useEffect(() => {
    fetchOferta();
  }, [fetchOferta]);

  const onSubmit = async (data: OfertaForm) => {
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

      console.log('📝 Actualizando oferta con datos:', updateData);
      console.log('🖼️ Archivo de imagen:', imageFile);

      // Usar el método específico para actualizar con archivos
      await apiClient.updateOfertaWithFile(Number(params.id), updateData, imageFile || undefined);
      
      console.log('✅ Oferta actualizada exitosamente');
      router.push('/admin/ofertas');
    } catch (err) {
      console.error('❌ Error updating oferta:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error al actualizar la oferta: ${errorMessage}`);
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

  if (!oferta) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Oferta no encontrada</p>
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
            Editar Oferta de Empleo
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Modifica la información de la oferta laboral
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
                placeholder="Desarrollador Full Stack"
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
              Link de la Oferta *
            </label>
            <input
              {...register('link_oferta')}
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="https://empresa.com/empleos/123"
            />
            {errors.link_oferta && (
              <p className="mt-1 text-sm text-red-600">
                {errors.link_oferta.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              URL donde los candidatos pueden aplicar a la oferta
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción del Empleo *
            </label>
            <textarea
              {...register('descripcion_empleo')}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Describe los requisitos, responsabilidades, beneficios y cualquier información relevante..."
            />
            {errors.descripcion_empleo && (
              <p className="mt-1 text-sm text-red-600">
                {errors.descripcion_empleo.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo de la Empresa
            </label>
            
            {/* Mostrar imagen actual si existe */}
            {oferta.imagen && !imageFile && (
              <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <p className="text-sm text-gray-600 mb-2">Logo actual:</p>
                <img
                  src={oferta.imagen}
                  alt="Logo actual"
                  className="h-20 w-32 object-contain rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=300&fit=crop&crop=center';
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
              {oferta.imagen 
                ? 'Sube un nuevo logo para reemplazar el actual o deja vacío para mantenerlo' 
                : 'Sube el logo de la empresa'
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
              {isSaving ? 'Actualizando...' : 'Actualizar Oferta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 