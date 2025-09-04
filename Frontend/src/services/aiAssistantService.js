import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL;

export const aiAssistantService = {
  // Analizar imagen de producto
  async analyzeImage(imageFile) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await axios.post(
        `${API_URL}/ai-assistant/analyze-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error analizando imagen:', error);
      throw new Error(
        error.response?.data?.message || 'Error al analizar la imagen'
      );
    }
  },

  // Generar descripción de producto
  async generateDescription(productType, marca, modelo, datosTecnicos) {
    try {
      const response = await axios.post(
        `${API_URL}/ai-assistant/generate-description`,
        {
          productType,
          marca,
          modelo,
          datosTecnicos,
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error generando descripción:', error);
      throw new Error(
        error.response?.data?.message || 'Error al generar la descripción'
      );
    }
  },

  // Verificar estado del servicio
  async getStatus() {
    try {
      const response = await axios.get(`${API_URL}/ai-assistant/status`);
      return response.data;
    } catch (error) {
      console.error('Error verificando estado:', error);
      throw new Error(
        error.response?.data?.message || 'Error al verificar el estado del servicio'
      );
    }
  },
};
