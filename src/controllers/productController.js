import Product from '../models/Product.js';
import FinancialConfig from '../models/FinancialConfig.js';

// GET ALL PRODUCTS con Precios Calculados
export const getProducts = async (req, res) => {
    try {
        // 1. Obtener Configuración Financiera
        let config = await FinancialConfig.findOne({ configName: 'MAIN' });
        
        // Valores por defecto
        const cashDiscount = config ? config.cashDiscount : 0;
        const plans = config ? config.cardPlans : [];

        // --- 👇 CAMBIO PRINCIPAL AQUÍ 👇 ---
        // Definir el filtro: Si piden "all", traemos todo (Admin). Si no, solo activos (Público).
        const filter = req.query.all === 'true' ? {} : { isActive: true };

        // 2. Obtener Productos con el filtro dinámico y categoría poblada
        const products = await Product.find(filter)
                                      .sort({ createdAt: -1 }) // Opcional: Ordenar por más nuevos primero
                                      .populate('category', 'name slug');

        // 3. MAPEO: Calcular precios al vuelo (Esto sigue igual)
        const productsWithPricing = products.map(p => {
            const product = p.toObject(); 

            // A. Precio Contado (Base - Descuento)
            const priceCash = product.priceBase * (1 - (cashDiscount / 100));

            // B. Calcular opciones de tarjetas
            const financing = plans
                .filter(plan => plan.isActive)
                .map(plan => {
                    // Precio Lista + Interés del plan
                    const finalPrice = product.priceBase * (1 + (plan.interestRate / 100));
                    return {
                        planName: plan.name,
                        installments: plan.installments,
                        totalPrice: Math.round(finalPrice),
                        installmentValue: Math.round(finalPrice / plan.installments)
                    };
                });

            return {
                ...product,
                prices: {
                    base: product.priceBase,
                    cash: Math.round(priceCash),
                    discountPct: cashDiscount,
                    financing: financing 
                }
            };
        });

        res.json(productsWithPricing);

    } catch (error) {
        console.error("Error en getProducts:", error);
        res.status(500).json({ message: "Error del servidor", error: error.message });
    }
};

// CREAR PRODUCTO (Actualizado para recibir Imágenes)
export const createProduct = async (req, res) => {
    try {
        let imagesData = [];

        // 1. Si hay archivos (subidos por Multer/Cloudinary)
        if (req.files && req.files.length > 0) {
            req.files.map(file => {
                imagesData.push({
                    url: file.path,       // Link seguro de Cloudinary
                    public_id: file.filename // ID para poder borrarla
                });
            });
        }

        // 2. Crear objeto combinando el texto (body) con el array de fotos
        const newProduct = new Product({
            ...req.body,        // SKU, Name, Description, PriceBase, etc.
            isActive: req.body.isActive !== undefined ? req.body.isActive : true, 
            images: imagesData  // Array de fotos
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);

    } catch (error) {
        console.error("Error creating product:", error);
        res.status(400).json({ message: "Error al crear producto", error: error.message });
    }
};

// OBTENER UN SOLO PRODUCTO POR ID (Agrega esto)
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if(product){
           // AQUÍ DEBERÍAS REPETIR LA LÓGICA DE PRECIOS DEL GETALL
           // (Para hacerlo rápido puedes copiar y pegar la lógica de mapeo solo para este objeto)
           // O extraer la lógica de cálculo a un "helper" reutilizable (Best practice).
           res.json(product); // (Devuelve raw, o calculado si lo implementas)
        } else {
           res.status(404).json({message: 'Producto no encontrado'});
        }
    } catch (error) { }
};

export const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Producto eliminado" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar" });
    }
};

// ACTUALIZAR PRODUCTO (PUT)
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        let imagesData = [];

        // 1. Buscamos el producto actual
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Producto no encontrado" });

        // 2. Si subieron fotos nuevas, las procesamos
        if (req.files && req.files.length > 0) {
            req.files.map(file => {
                imagesData.push({
                    url: file.path,
                    public_id: file.filename
                });
            });
            product.images.push(...imagesData); 
        }

        // 3. Actualizamos los campos de texto
        product.name = req.body.name || product.name;
        product.sku = req.body.sku || product.sku;
        product.priceBase = req.body.priceBase || product.priceBase;
        product.stock = req.body.stock || product.stock;
        product.description = req.body.description || product.description;
        product.category = req.body.category || product.category;
        product.videoUrl = req.body.videoUrl !== undefined ? req.body.videoUrl : product.videoUrl;

        // 👇 4. ACTUALIZACIÓN DEL ESTADO (NUEVO)
        // Verificamos si 'isActive' viene en el body. Si viene, lo asignamos.
        // Nota: Con FormData "false" llega como string, pero Mongoose lo arregla.
        if (req.body.isActive !== undefined) {
            product.isActive = req.body.isActive;
        }

        // 5. Guardar cambios
        const updatedProduct = await product.save();
        res.json(updatedProduct);

    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Error al actualizar producto" });
    }
};