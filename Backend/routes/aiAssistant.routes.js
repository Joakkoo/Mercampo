import express from 'express';
import multer from 'multer';
import { AIAssistantController } from '../controllers/aiAssistant.controller.js';

const router = express.Router();

// Configuración de multer para manejar archivos de imagen
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB máximo
  },
  fileFilter: (req, file, cb) => {
    // Solo permitir imágenes
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  },
});

// Ruta para analizar imagen de producto
router.post('/analyze-image', upload.single('image'), AIAssistantController.analyzeImage);

// Ruta para generar descripción de producto
router.post('/generate-description', AIAssistantController.generateDescription);

// Ruta para verificar estado del servicio
router.get('/status', AIAssistantController.getAnalysisStatus);

export default router;
