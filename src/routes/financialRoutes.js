import express from 'express';
import { getFinancialConfig, updateFinancialConfig } from '../controllers/financialController.js';
import { protect } from '../middleware/authMiddleware.js'; // IMPORTAMOS

const router = express.Router();

// Agregamos 'protect' antes del controlador
router.get('/', protect, getFinancialConfig); 
router.put('/', protect, updateFinancialConfig);

export default router;