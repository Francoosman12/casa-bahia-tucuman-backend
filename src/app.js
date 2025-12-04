import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';

// IMPORTAR RUTAS
import productRoutes from './routes/productRoutes.js';
import financialRoutes from './routes/financialRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import userRoutes from './routes/userRoutes.js';

// 1. Configuración de Variables de Entorno
dotenv.config();

// 2. Conexión a Base de Datos (Usa el caché que configuramos antes)
connectDB();

// 3. Inicializar Express
const app = express();

// 4. Middlewares
// Permite conexiones desde cualquier origen. Para producción es mejor restringirlo, 
// pero para evitar bloqueos iniciales déjalo así.
app.use(cors()); 
app.use(morgan('dev'));
app.use(express.json());

// 5. Definición de Rutas (Endpoints)
app.use('/api/products', productRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

// Ruta de Salud (Root) con estilo HTML para confirmar visualmente
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send('<h1>🚀 API Casa Bahia Tucuman v1.0 ONLINE</h1>');
});

// 6. Arrancar el Servidor (Lógica Dual: Local vs Vercel)
// Vercel establece NODE_ENV=production automáticamente.
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo localmente en puerto ${PORT}`);
    });
}

// ⚠️ IMPORTANTE: Exportar la app para que Vercel la pueda ejecutar como función serverless
export default app;