import { AIService } from '../services/aiService.js';

export class AIAssistantController {
  static async analyzeImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No se proporcionó ninguna imagen'
        });
      }

      const imageBuffer = req.file.buffer;
      const imageType = req.file.mimetype;

      // Validar tipo de imagen
      if (!imageType.startsWith('image/')) {
        return res.status(400).json({
          success: false,
          message: 'El archivo debe ser una imagen válida'
        });
      }

      // Analizar la imagen con IA
      const productInfo = await AIService.analyzeProductImage(imageBuffer, imageType);

      res.json({
        success: true,
        data: productInfo,
        message: 'Análisis de imagen completado exitosamente'
      });

    } catch (error) {
      console.error('Error en controlador de análisis de imagen:', error);
      res.status(500).json({
        success: false,
        message: 'Error al analizar la imagen',
        error: error.message
      });
    }
  }

  static async generateDescription(req, res) {
    try {
      const { productType, marca, modelo, datosTecnicos } = req.body;

      if (!productType || !marca || !modelo) {
        return res.status(400).json({
          success: false,
          message: 'Faltan datos requeridos: productType, marca, modelo'
        });
      }

      // Generar descripción con IA
      const description = await AIService.generateProductDescription(
        productType,
        marca,
        modelo,
        datosTecnicos || {}
      );

      res.json({
        success: true,
        data: { description },
        message: 'Descripción generada exitosamente'
      });

    } catch (error) {
      console.error('Error generando descripción:', error);
      res.status(500).json({
        success: false,
        message: 'Error al generar la descripción',
        error: error.message
      });
    }
  }

  static async getAnalysisStatus(req, res) {
    try {
      // Endpoint para verificar el estado del servicio de IA
      res.json({
        success: true,
        message: 'Servicio de IA funcionando correctamente',
        status: 'active'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error en el servicio de IA',
        error: error.message
      });
    }
  }
}
