const categoryService= require("../services/category.service.js");

exports.getCategories = async (req, res) => {
    try {
        const categories = await categoryService.getCategories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las categorías" });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { name, slug } = req.body;
        const newCategory = await categoryService.createCategory({ name, slug });
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la categoría", error: error.message });
    }
};
