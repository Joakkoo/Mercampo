# 🚀 Configuración Rápida del Asistente de IA

## ⚡ Pasos para activar el asistente en 5 minutos:

### 1. 📝 Crear archivo .env
```bash
# En la carpeta Backend, crea un archivo .env
cp env.example .env
```

### 2. 🔑 Obtener API Key de OpenAI
1. Ve a [platform.openai.com](https://platform.openai.com)
2. Inicia sesión o crea cuenta
3. Ve a "API Keys" → "Create new secret key"
4. Copia la key

### 3. ⚙️ Configurar .env
```bash
# Edita el archivo .env y agrega tu API key:
OPENAI_API_KEY="sk-...tu-api-key-aqui..."
```

### 4. 🧪 Probar el asistente
```bash
cd Backend
node scripts/testAIAssistant.js
```

### 5. 🎯 ¡Listo!
Si la prueba es exitosa, el asistente ya está funcionando en tu aplicación.

---

## 💡 Consejos:

- **API Key**: Nunca compartas tu API key públicamente
- **Créditos**: Monitorea tu uso en [platform.openai.com](https://platform.openai.com)
- **Imágenes**: Usa fotos claras y bien iluminadas para mejores resultados
- **Tamaño**: Máximo 10MB por imagen

## 🆘 Si algo falla:

1. Verifica que tu API key sea válida
2. Asegúrate de tener créditos en tu cuenta de OpenAI
3. Revisa la consola para errores específicos
4. Ejecuta el script de prueba para diagnosticar

---

**🎉 ¡Disfruta de tu asistente inteligente!**
