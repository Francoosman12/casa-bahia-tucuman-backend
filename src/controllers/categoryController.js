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

// ACTUALIZAR CATEGORÍA
export const updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await Category.findById(req.params.id);

        if (!category) return res.status(404).json({ message: "Categoría no encontrada" });

        category.name = name || category.name;
        // Regeneramos el slug si cambió el nombre
        if (name) category.slug = name.toLowerCase().split(' ').join('-');

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar" });
    }
};

// ELIMINAR CATEGORÍA
export const deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: "Categoría eliminada" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar" });
    }
};