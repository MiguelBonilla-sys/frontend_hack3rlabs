'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  currentFile?: File | null;
  accept?: string;
  className?: string;
  preview?: boolean;
}

export default function FileUpload({ 
  onFileSelect, 
  currentFile, 
  accept = 'image/*',
  className = '',
  preview = true
}: FileUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File | null) => {
    if (!file) return;

    // Validar tipo de archivo
    if (accept === 'image/*' && !file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo debe ser menor a 5MB');
      return;
    }

    setError('');
    
    // Crear preview si es imagen
    if (preview && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }

    onFileSelect(file);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeFile = () => {
    setPreviewUrl('');
    setError('');
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Área de upload */}
      <div
        className={`relative border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
          dragOver
            ? 'border-green-400 bg-green-50'
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <div className="p-6 text-center">
          {currentFile || previewUrl ? (
            <div className="space-y-2">
              {preview && previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mx-auto h-24 w-24 object-cover rounded-lg"
                />
              )}
              <div className="flex items-center justify-center gap-2">
                <ImageIcon className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">
                  {currentFile?.name || 'Archivo seleccionado'}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Click para subir archivo o arrastra aquí
                </p>
                <p className="text-xs text-gray-500">
                  {accept === 'image/*' ? 'PNG, JPG, GIF hasta 5MB' : 'Archivos hasta 5MB'}
                </p>
              </div>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleInputChange}
        />
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
          {error}
        </div>
      )}

      {/* Información del archivo */}
      {currentFile && (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <div className="flex justify-between">
            <span>Tamaño: {(currentFile.size / 1024).toFixed(1)} KB</span>
            <span>Tipo: {currentFile.type}</span>
          </div>
        </div>
      )}
    </div>
  );
} 