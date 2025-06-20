'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  currentImageUrl?: string;
  className?: string;
}

export default function ImageUpload({ 
  onUploadComplete, 
  currentImageUrl, 
  className = ''
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl || '');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo debe ser menor a 5MB');
      return;
    }

    setError('');
    setIsConverting(true);

    try {
      // Usar una imagen de placeholder de Unsplash con timestamp único
      const timestamp = Date.now();
      const placeholderUrl = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&t=${timestamp}`;
      
      setPreviewUrl(placeholderUrl);
      onUploadComplete(placeholderUrl);
      setError('');
      
      setIsConverting(false);
    } catch (error) {
      console.error('Error processing image:', error);
      setError('Error al procesar la imagen');
      setIsConverting(false);
    }
  };

  const removeImage = () => {
    setPreviewUrl('');
    onUploadComplete('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    if (url && url.startsWith('http')) {
      setPreviewUrl(url);
      onUploadComplete(url);
      setError('');
    } else if (!url) {
      setPreviewUrl('');
      onUploadComplete('');
    }
  };

  const selectPredefinedImage = (url: string) => {
    setPreviewUrl(url);
    onUploadComplete(url);
    setError('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Área de upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upload de archivo */}
        <div>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isConverting ? (
                <Loader2 className="w-6 h-6 mb-2 text-gray-500 animate-spin" />
              ) : (
                <Upload className="w-6 h-6 mb-2 text-gray-500" />
              )}
              <p className="text-xs text-gray-500 text-center">
                {isConverting ? 'Procesando...' : 'Subir archivo'}
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isConverting}
            />
          </label>
        </div>

        {/* Preview */}
        <div className="flex items-center justify-center">
          {previewUrl ? (
            <div className="relative w-full h-32 border border-gray-300 rounded-lg overflow-hidden">
              <Image src={previewUrl} alt="Preview" width={128} height={128} className="rounded object-cover" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                disabled={isConverting}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="w-full h-32 border border-gray-300 border-dashed rounded-lg flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Vista previa</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
          {error}
        </div>
      )}

      {/* Input para URL manual */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          O ingresa una URL de imagen:
        </label>
        <input
          type="url"
          placeholder="https://ejemplo.com/imagen.jpg"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
          onChange={handleUrlChange}
          disabled={isConverting}
        />
      </div>

      {/* Imágenes predefinidas */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Imágenes de ejemplo:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => selectPredefinedImage('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face')}
            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={isConverting}
          >
            <Image src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face" alt="Desarrollador 1" width={60} height={60} className="rounded object-cover" />
            <p className="text-xs text-gray-600 mt-1">Desarrollador</p>
          </button>
          
          <button
            type="button"
            onClick={() => selectPredefinedImage('https://images.unsplash.com/photo-1494790108755-2616b9c3dd15?w=400&h=400&fit=crop&crop=face')}
            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={isConverting}
          >
            <Image src="https://images.unsplash.com/photo-1494790108755-2616b9c3dd15?w=60&h=60&fit=crop&crop=face" alt="Desarrolladora 1" width={60} height={60} className="rounded object-cover" />
            <p className="text-xs text-gray-600 mt-1">Desarrolladora</p>
          </button>

          <button
            type="button"
            onClick={() => selectPredefinedImage('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face')}
            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={isConverting}
          >
            <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face" alt="Desarrollador 2" width={60} height={60} className="rounded object-cover" />
            <p className="text-xs text-gray-600 mt-1">Programador</p>
          </button>

          <button
            type="button"
            onClick={() => selectPredefinedImage('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face')}
            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={isConverting}
          >
            <Image src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&h=60&fit=crop&crop=face" alt="Desarrolladora 2" width={60} height={60} className="rounded object-cover" />
            <p className="text-xs text-gray-600 mt-1">Ingeniera</p>
          </button>
        </div>
      </div>

      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
        💡 <strong>Tip:</strong> Puedes usar enlaces de Unsplash, LinkedIn, GitHub, o cualquier URL pública de imagen
      </div>
    </div>
  );
} 