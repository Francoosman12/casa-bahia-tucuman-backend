import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js'; // Importación nombrada con { }

// IMPORTAR RUTAS
import productRoutes from './routes/productRoutes.js';
import financialRoutes from './routes/financialRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import userRoutes from './routes/userRoutes.js';

// 1. Configuración de Variables de Entorno
dotenv.config();

// 2. Conexión a Base de Datos
connectDB();

// 3. Inicializar Express
const app = express();

// 4. Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// 5. Definición de Rutas (Endpoints)
app.use('/api/products', productRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

// Ruta de Salud (Check)
app.get('/', (req, res) => {
    res.send('API Casa Bahia Tucuman v1.0 ONLINE');
});

// 6. Arrancar el Servidor
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

export default app; // Opcional, útil si quisieras hacer testing luego