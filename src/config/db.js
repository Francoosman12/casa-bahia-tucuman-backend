import mongoose from 'mongoose';

// Variable global para cachear la conexión entre ejecuciones "calientes"
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  // 1. Si ya hay conexión activa, úsala (Rápido ⚡)
  if (cached.conn) {
    return cached.conn;
  }

  // 2. Si no hay conexión, créala
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Desactivar buffer para errores inmediatos
    };

    console.log("🔄 Estableciendo NUEVA conexión a MongoDB Atlas...");
    
    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB Conectado");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ Error de conexión MongoDB:", e);
    throw e;
  }

  return cached.conn;
};