import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class AIService {
  static async analyzeProductImage(imageBuffer, imageType) {
    try {
      // Convertir el buffer a base64
      const base64Image = imageBuffer.toString('base64');
      
      // Prompt especializado para productos agrícolas
      const prompt = `Eres un experto en maquinaria agrícola argentina. Analiza esta imagen y extrae la siguiente información en formato JSON:

{
  "tipo_producto": "string (ej: tractor, cosechadora, sembradora, etc.)",
  "marca": "string (ej: John Deere, Massey Ferguson, etc.)",
  "modelo": "string (ej: 6700, 8R 410, etc.)",
  "anio_estimado": "number (año aproximado de fabricación)",
  "titulo_sugerido": "string (título atractivo para la publicación)",
  "descripcion_sugerida": "string (descripción detallada del producto)",
  "categoria_sugerida": "string (categoría principal)",
  "subcategoria_sugerida": "string (subcategoría específica)",
  "datos_tecnicos": {
    // Campos específicos según el tipo de producto
    // Para tractores incluir: linea, cabina, traccion, direccion, tipo_motor, potencia_hp, tipo_rodado, tipo_tractor, variante_traccion, levante_tres_puntos
    // Para cosechadoras incluir: potencia_hp, cultivo_uso, tipo_plataforma, sistema_cosecha, ancho_labor, capacidad_tolva, descargaporsegundo
    // Para sembradoras incluir: cultivo_uso, ancho_trabajo, cantidad_tolvas, cantidad_surcos, distancia_surcos, sistema_labranza, sistema_siembra
    // Para otros productos incluir campos relevantes
  }
}

IMPORTANTE:
- Puedes usar esta pagina como guia: https://www.lectura-specs.es/es
- Si es un tractor, cosechadora o sembradora, incluir TODOS los campos técnicos mencionadosºº
- Si no puedes identificar algún campo, usar "No identificado"
- Ser específico con marcas y modelos argentinos
- La descripción debe ser comercial y atractiva
- Usar terminología técnica correcta del sector agrícola
- Responde SOLO con el JSON, sin texto adicional`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${imageType};base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.1
      });

      // Extraer y parsear la respuesta JSON
      const responseText = response.choices[0].message.content;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('No se pudo extraer información estructurada de la respuesta');
      }

      const productInfo = JSON.parse(jsonMatch[0]);
      return productInfo;

    } catch (error) {
      console.error('Error en análisis de imagen:', error);
      throw new Error(`Error al analizar la imagen: ${error.message}`);
    }
  }

  static async generateProductDescription(productType, marca, modelo, datosTecnicos) {
    try {
      const prompt = `Genera una descripción comercial atractiva para un ${productType} ${marca} ${modelo} con las siguientes características técnicas:

${JSON.stringify(datosTecnicos, null, 2)}

La descripción debe:
- Ser comercial y persuasiva
- Incluir beneficios del producto
- Usar terminología técnica correcta
- Tener entre 300-500 palabras
- Estar en español argentino
- Ser apropiada para una plataforma de venta online`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      });

      return response.choices[0].message.content.trim();

    } catch (error) {
      console.error('Error generando descripción:', error);
      return 'Descripción del producto generada automáticamente.';
    }
  }
}
