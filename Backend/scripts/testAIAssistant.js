import { AIService } from '../services/aiService.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Configurar variables de entorno
dotenv.config();

async function testAIAssistant() {
  try {
    console.log('🧪 Probando el Asistente de IA...\n');

    // Verificar que la API key esté configurada
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ Error: OPENAI_API_KEY no está configurada en el archivo .env');
      console.log('📝 Crea un archivo .env con tu API key de OpenAI');
      return;
    }

    console.log('✅ API Key configurada correctamente');
    console.log('🔍 Probando generación de descripción...\n');

    // Probar generación de descripción
    const description = await AIService.generateProductDescription(
      'tractor',
      'John Deere',
      '6700',
      {
        linea: '6700',
        potencia_hp: '135',
        traccion: 'Doble',
        direccion: 'Hidráulica',
        tipo_motor: 'Diésel'
      }
    );

    console.log('📝 Descripción generada:');
    console.log(description);
    console.log('\n✅ Prueba de generación de descripción exitosa!');

    console.log('\n🎯 El asistente está funcionando correctamente!');
    console.log('🚀 Puedes usar la aplicación ahora.');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
    
    if (error.message.includes('API key')) {
      console.log('\n💡 Solución: Verifica que tu OPENAI_API_KEY sea válida');
    } else if (error.message.includes('rate limit')) {
      console.log('\n💡 Solución: Has alcanzado el límite de la API, espera un momento');
    } else {
      console.log('\n💡 Revisa la consola para más detalles del error');
    }
  }
}

// Ejecutar la prueba
testAIAssistant();
