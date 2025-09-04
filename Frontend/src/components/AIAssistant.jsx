import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, Sparkles, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { aiAssistantService } from '../services/aiAssistantService';

export default function AIAssistant({ onAnalysisComplete, onClose }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (file) => {
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('La imagen es demasiado grande. Máximo 10MB permitido');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await aiAssistantService.analyzeImage(file);
      
      if (result.success) {
        setAnalysisResult(result.data);
        // Pasar el resultado al componente padre
        onAnalysisComplete(result.data);
      } else {
        setError(result.message || 'Error al analizar la imagen');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
    setError(null);
    setDragActive(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Asistente Inteligente
                </h2>
                <p className="text-gray-600">
                  Sube una foto y te ayudo a completar la publicación
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="sr-only">Cerrar</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!analysisResult && !isAnalyzing && (
            <div className="space-y-6">
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      Sube una foto de tu producto
                    </p>
                    <p className="text-gray-500 mt-1">
                      Arrastra y suelta o haz clic para seleccionar
                    </p>
                  </div>
                  <button
                    onClick={openFileDialog}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                    Seleccionar Imagen
                  </button>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">💡 Consejos para mejores resultados:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Asegúrate de que la imagen sea clara y esté bien iluminada</li>
                  <li>• Incluye el producto completo en la foto</li>
                  <li>• Evita sombras o reflejos que puedan interferir</li>
                  <li>• Para tractores, incluye la cabina y el motor si es posible</li>
                </ul>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isAnalyzing && (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Analizando tu imagen...
              </h3>
              <p className="text-gray-600">
                Nuestro asistente está extrayendo información de tu producto
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-red-900 mb-2">
                Error en el análisis
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={resetAnalysis}
                className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                Intentar de nuevo
              </button>
            </div>
          )}

          {/* Analysis Result */}
          {analysisResult && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  ¡Análisis completado!
                </h3>
                <p className="text-gray-600">
                  Hemos extraído la siguiente información de tu imagen
                </p>
              </div>

              {/* Product Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-gray-900">Información del Producto</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Tipo:</span>
                    <span className="ml-2 font-medium">{analysisResult.tipo_producto}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Marca:</span>
                    <span className="ml-2 font-medium">{analysisResult.marca}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Modelo:</span>
                    <span className="ml-2 font-medium">{analysisResult.modelo}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Año:</span>
                    <span className="ml-2 font-medium">{analysisResult.anio_estimado}</span>
                  </div>
                </div>
              </div>

              {/* Technical Data */}
              {analysisResult.datos_tecnicos && Object.keys(analysisResult.datos_tecnicos).length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <h4 className="font-medium text-gray-900">Datos Técnicos</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {Object.entries(analysisResult.datos_tecnicos).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-gray-600 capitalize">
                          {key.replace(/_/g, ' ')}:
                        </span>
                        <span className="ml-2 font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Title */}
              {analysisResult.titulo_sugerido && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Título Sugerido</h4>
                  <p className="text-gray-700">{analysisResult.titulo_sugerido}</p>
                </div>
              )}

              {/* Suggested Description */}
              {analysisResult.descripcion_sugerida && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Descripción Sugerida</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {analysisResult.descripcion_sugerida}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={resetAnalysis}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Analizar otra imagen
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Usar esta información
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
      </motion.div>
    </motion.div>
  );
}
