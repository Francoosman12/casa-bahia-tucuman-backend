import express from 'express';
import { getProducts, createProduct, deleteProduct,  getProductById, updateProduct  } from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js'; // 1. IMPORTAR MULTER

const router = express.Router();

// GET es Público (El cliente final ve el catálogo)
router.get('/', getProducts);
router.get('/:id', getProductById);

// POST Protegido (Solo el dueño carga productos) + Subida de Imágenes
// 'images' debe coincidir con el campo Key en Postman/Frontend
// '5' es el máximo de fotos permitidas
router.post('/', protect, upload.array('images', 5), createProduct); 
router.delete('/:id', protect, deleteProduct);
router.put('/:id', protect, upload.array('images', 5), updateProduct);

export default router;