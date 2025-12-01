import Category from '../models/Category.js';

// LISTAR CATEGORÍAS
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener categorías", error: error.message });
    }
};

// CREAR CATEGORÍA
export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        // Generar slug simple (ej: "Muebles de Oficina" -> "muebles-de-oficina")
        const slug = name.toLowerCase().split(' ').join('-');

        const category = new Category({ name, slug });
        const savedCategory = await category.save();
        
        res.status(201).json(savedCategory);
    } catch (error) {
        res.status(400).json({ message: "Error al crear categoría", error: error.message });
    }
};