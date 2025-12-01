import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    sku: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    priceBase: { type: Number, required: true }, // PRECIO LISTA
    stock: { type: Number, default: 0 },
    images: [{
        public_id: String, // Cloudinary ID
        url: String
    }],
    videoUrl: { type: String }, // YouTube link
    isFeatured: { type: Boolean, default: false }, // Destacado
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);