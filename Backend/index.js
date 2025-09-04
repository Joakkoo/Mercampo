import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import productsRoutes from './routes/products.routes.js'
import categoryRoutes from './routes/category.routes.js';
import aiAssistantRoutes from './routes/aiAssistant.routes.js';
import specsRoutes from './routes/specs.routes.js';
import cropsRoutes from './routes/crops.routes.js';

import cors from 'cors';

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/products', productsRoutes);
app.use('/categories', categoryRoutes);
app.use('/ai-assistant', aiAssistantRoutes);
app.use('/crops', cropsRoutes);
app.use('/specs', specsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});