import mongoose from 'mongoose';

// Agrega 'export' aquí abajo 👇
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Borra la línea de abajo que tenías antes
// export default connectDB;