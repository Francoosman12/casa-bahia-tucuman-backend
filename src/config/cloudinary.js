import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// 1. Cargar variables inmediatamente
dotenv.config();

// 2. Validación de Seguridad: ¿Existe la variable?
const cloudinaryUrl = process.env.CLOUDINARY_URL;

if (!cloudinaryUrl) {
    throw new Error('❌ FALLO CRÍTICO: Falta CLOUDINARY_URL en el archivo .env');
}

// 3. Hack de Estabilidad: Parseo Manual
// La URL viene así: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
// Vamos a separarla nosotros mismos para que no falle nunca.
try {
    // Quitamos 'cloudinary://'
    const [credentials, cloudName] = cloudinaryUrl.replace('cloudinary://', '').split('@');
    const [apiKey, apiSecret] = credentials.split(':');

    console.log("-------------------------------------");
    console.log("☁️  Configurando Cloudinary...");
    console.log(`✅ Cloud Name detectado: ${cloudName}`);
    console.log(`✅ API Key detectada: ${apiKey ? '***********' + apiKey.slice(-4) : 'No detectada'}`);
    console.log("-------------------------------------");

    // 4. Configuración Explícita
    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true
    });

} catch (error) {
    console.error("❌ Error al parsear CLOUDINARY_URL. Revisa el formato.");
    console.error(error);
}

export default cloudinary;