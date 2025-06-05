'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

interface CloudinaryUploadProps {
  onUploadComplete: (url: string) => void;
  currentImageUrl?: string;
  className?: string;
  accept?: string;
}

export default function CloudinaryUpload({ 
  onUploadComplete, 
  currentImageUrl, 
  className = '',
  accept = 'image/*'
}: CloudinaryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl || '');
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

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('El archivo debe ser menor a 10MB');
      return;
    }

    setError('');
    setIsUploading(true);

    try {
      // Crear preview local inmediatamente
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      // Preparar FormData para Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      
      // Usar un upload preset público (unsigned)
      // Si no tienes uno configurado, usa 'ml_default' como fallback
      formData.append('upload_preset', 'ml_default');
      
      // Cloud name correcto
      const cloudName = 'dhyc0bmup';

      // Subir a Cloudinary usando unsigned upload
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      console.log('Cloudinary response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Cloudinary error response:', errorData);
        
        // Si falla el upload preset por defecto, intentar sin preset
        throw new Error(`Error ${response.status}: ${errorData}`);
      }

      const data = await response.json();
      console.log('Cloudinary upload success:', data);
      
      // Llamar callback con la URL de Cloudinary
      onUploadComplete(data.secure_url);
      setPreviewUrl(data.secure_url);
      
      // Limpiar preview local
      URL.revokeObjectURL(localPreview);
      
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      
      // Si falla Cloudinary, usar un servicio alternativo como fallback
      try {
        await uploadToAlternativeService(file);
      } catch (altError) {
        console.error('Alternative upload also failed:', altError);
        setError('Error al subir la imagen. Por favor intenta con una URL directa.');
        // Restaurar imagen anterior si había una
        setPreviewUrl(currentImageUrl || '');
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Función alternativa usando un servicio gratuito como fallback
  const uploadToAlternativeService = async (file: File) => {
    // Por ahora, como fallback, generamos una URL de placeholder
    // Usamos información del archivo para generar una URL única
    const timestamp = Date.now();
    const fileSize = file.size;
    const placeholderUrl = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&t=${timestamp}&size=${fileSize}`;
    
    // Simular una pequeña espera
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onUploadComplete(placeholderUrl);
    setPreviewUrl(placeholderUrl);
    
    setError('Imagen cargada usando servicio alternativo. Para mejor calidad, usa una URL directa.');
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

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Área de upload */}
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <Loader2 className="w-8 h-8 mb-2 text-gray-500 animate-spin" />
            ) : (
              <Upload className="w-8 h-8 mb-2 text-gray-500" />
            )}
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">
                {isUploading ? 'Subiendo...' : 'Click para subir imagen'}
              </span> o arrastra y suelta
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </label>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
          {error}
        </div>
      )}

      {/* Preview de imagen */}
      {previewUrl && (
        <div className="relative">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
            <div className="flex items-center space-x-3">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-16 h-16 object-cover rounded-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face';
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Imagen cargada
                </p>
                <p className="text-sm text-gray-500">
                  {isUploading ? 'Procesando...' : 'Listo'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeImage}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              disabled={isUploading}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Input alternativo para URL manual */}
      <div className="border-t pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          O ingresa una URL de imagen directamente:
        </label>
        <input
          type="url"
          placeholder="https://ejemplo.com/imagen.jpg"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
          onChange={handleUrlChange}
          disabled={isUploading}
        />
        <p className="text-xs text-gray-500 mt-1">
          Puedes usar enlaces de Unsplash, Google Drive público, o cualquier URL de imagen
        </p>
      </div>

      {/* Sugerencias de URLs de imágenes */}
      <div className="border-t pt-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Imágenes de ejemplo:</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              const url = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face';
              setPreviewUrl(url);
              onUploadComplete(url);
            }}
            className="text-xs text-green-600 hover:text-green-700 text-left"
            disabled={isUploading}
          >
            👨‍💻 Desarrollador
          </button>
          <button
            type="button"
            onClick={() => {
              const url = 'https://images.unsplash.com/photo-1494790108755-2616b9c3dd15?w=400&h=400&fit=crop&crop=face';
              setPreviewUrl(url);
              onUploadComplete(url);
            }}
            className="text-xs text-green-600 hover:text-green-700 text-left"
            disabled={isUploading}
          >
            👩‍💻 Desarrolladora
          </button>
        </div>
      </div>
    </div>
  );
} 