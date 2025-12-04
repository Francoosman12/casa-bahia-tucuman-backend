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

dotenv.config();

// ❌ AQUÍ BORRAMOS EL 'connectDB()' SUELTO QUE TENÍAS ANTES ❌

const app = express();

app.use(cors()); 
app.use(morgan('dev'));
app.use(express.json());

// 👇 MIDDLEWARE DE CONEXIÓN DATABASE (SOLUCIÓN) 👇
// Esto asegura que la DB esté conectada antes de procesar CUALQUIER solicitud.
app.use(async (req, res, next) => {
    try {
        await connectDB(); // Espera a que conecte
        next(); // Continúa a las rutas
    } catch (error) {
        console.error("❌ Error de conexión a la BD en Vercel:", error);
        res.status(500).json({ error: "Error de conexión a la base de datos" });
    }
});

// 5. Definición de Rutas
app.use('/api/products', productRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send('<h1>🚀 API Casa Bahia Tucuman v1.0 ONLINE</h1>');
});

// 6. Arrancar (Solo local)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo localmente en puerto ${PORT}`);
    });
}

export default app;