# Asistente Inteligente de IA - Ruralket

## Descripción

Este asistente utiliza la API de OpenAI (GPT-4 Vision) para analizar imágenes de productos agrícolas y extraer automáticamente información como marca, modelo, características técnicas, y generar títulos y descripciones sugeridas.

## Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del backend con las siguientes variables:

```env
# API Key de OpenAI
OPENAI_API_KEY="tu_api_key_de_openai_aqui"

# Otras variables existentes...
DATABASE_URL="postgresql://username:password@localhost:5432/ruralket"
PORT=3001
JWT_SECRET="tu_jwt_secret_aqui"
```

### 2. Obtener API Key de OpenAI

1. Ve a [platform.openai.com](https://platform.openai.com)
2. Crea una cuenta o inicia sesión
3. Ve a "API Keys" en el menú lateral
4. Crea una nueva API key
5. Copia la key y pégala en tu archivo `.env`

### 3. Probar el Asistente

Una vez configurado, puedes probar que funcione correctamente:

```bash
cd Backend
node scripts/testAIAssistant.js
```

## Funcionalidades

### Análisis de Imágenes
- **Reconocimiento automático** de tipo de producto (tractor, cosechadora, etc.)
- **Extracción de datos** como marca, modelo, año estimado
- **Generación de datos técnicos** específicos por tipo de producto
- **Títulos y descripciones** comerciales atractivas

### Campos Técnicos para Tractores
- Línea del producto
- Potencia en HP
- Tipo de tracción (Simple/Doble)
- Dirección (Hidráulica/Mecánica/Asistida/Eléctrica)
- Tipo de motor (Diésel/Gas/Nafta/Eléctrico)
- Levante de tres puntos
- Cabina
- Variante de tracción
- Tipo de rodado
- Tipo de tractor

## Uso

### En el Frontend
1. El usuario selecciona categoría y subcategoría
2. Aparece el botón "Usar Asistente de IA"
3. Al hacer clic, se abre el modal del asistente
4. El usuario sube una foto de su producto
5. La IA analiza la imagen y extrae información
6. Se completa automáticamente el formulario
7. El usuario solo debe agregar precio, condición, cantidad y localidad

### Endpoints del Backend

- `POST /ai-assistant/analyze-image` - Analiza imagen de producto
- `POST /ai-assistant/generate-description` - Genera descripción
- `GET /ai-assistant/status` - Verifica estado del servicio

## Dependencias

```json
{
  "openai": "^4.0.0",
  "multer": "^1.4.5"
}
```

## Limitaciones

- **Tamaño máximo de imagen**: 10MB
- **Formatos soportados**: JPG, PNG, GIF, WebP
- **Precisión**: Depende de la calidad de la imagen y claridad del producto
- **Costo**: Cada análisis consume tokens de la API de OpenAI (más económico que Claude)

## Ventajas de OpenAI vs Claude

- **Más económico**: Precios más bajos por token
- **Mejor soporte**: API más estable y documentada
- **Más rápido**: Respuestas más rápidas
- **Mejor integración**: SDK más maduro y fácil de usar

## Mejoras Futuras

- [ ] Cache de análisis previos
- [ ] Soporte para múltiples idiomas
- [ ] Análisis de múltiples imágenes
- [ ] Validación de datos extraídos
- [ ] Historial de análisis por usuario
- [ ] Sugerencias de precios basadas en el mercado

## Solución de Problemas

### Error: "API key no válida"
- Verifica que `OPENAI_API_KEY` esté correctamente configurada
- Asegúrate de que la API key tenga permisos de uso

### Error: "Imagen demasiado grande"
- Comprime la imagen antes de subirla
- Usa formatos más eficientes como WebP

### Error: "No se pudo extraer información"
- La imagen puede ser de baja calidad
- El producto puede no estar claramente visible
- Intenta con una imagen más clara y bien iluminada

### Error: "Rate limit exceeded"
- Has alcanzado el límite de la API
- Espera unos minutos antes de intentar de nuevo
- Considera actualizar tu plan de OpenAI si es frecuente

## Soporte

Para problemas técnicos o sugerencias, contacta al equipo de desarrollo.
