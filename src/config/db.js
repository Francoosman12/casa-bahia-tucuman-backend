import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // 👇 CAMBIO AQUÍ: Activamos el buffer (o borra opts si quieres default)
    // Esto hace que si la conexión tarda un milisegundo más, Mongoose espere 
    // en lugar de lanzar error inmediatamente.
    const opts = {
      bufferCommands: true, 
    };

    console.log("🔄 Conectando a MongoDB en Vercel...");
    
    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
      console.log("✅ Conectado");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};