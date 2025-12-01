import mongoose from 'mongoose';

const financialConfigSchema = new mongoose.Schema({
    configName: { type: String, default: 'MAIN', unique: true }, // Singleton
    cashDiscount: { type: Number, default: 10 }, // % Descuento efectivo
    cardPlans: [{
        name: { type: String, required: true }, // "Visa 3 cuotas"
        installments: { type: Number, required: true }, // 3
        interestRate: { type: Number, required: true }, // % Interes, ej: 15
        isActive: { type: Boolean, default: true }
    }]
}, { timestamps: true });

export default mongoose.model('FinancialConfig', financialConfigSchema);