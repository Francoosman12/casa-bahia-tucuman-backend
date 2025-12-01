import FinancialConfig from '../models/FinancialConfig.js';

// OBTENER LA CONFIGURACIÓN ACTUAL
export const getFinancialConfig = async (req, res) => {
    try {
        let config = await FinancialConfig.findOne({ configName: 'MAIN' });
        
        // Si no existe aún (primera vez), devolvemos valores por defecto
        if (!config) {
            return res.json({
                configName: 'MAIN',
                cashDiscount: 0,
                cardPlans: []
            });
        }
        res.json(config);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener config financiera", error: error.message });
    }
};

// CREAR O ACTUALIZAR CONFIGURACIÓN
export const updateFinancialConfig = async (req, res) => {
    try {
        // Busca por nombre 'MAIN', si no está lo crea, y devuelve el nuevo valor
        const config = await FinancialConfig.findOneAndUpdate(
            { configName: 'MAIN' },
            { 
                $set: {
                    cashDiscount: req.body.cashDiscount,
                    cardPlans: req.body.cardPlans // Array completo de planes
                }
            },
            { new: true, upsert: true } // Opciones críticas
        );
        res.json(config);
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar tasas", error: error.message });
    }
};