import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'catalogo-casa-bahia', // Nombre de la carpeta en tu Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], // Formatos web
        // Transformación automática para optimizar tamaño (opcional pero recomendada)
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
    }
});

const upload = multer({ storage });

export default upload;