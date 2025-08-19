const productService = require("../services/product.service");

exports.createProduct = async (req, res) => {
    try {
        const userId = req.user.id;
        const productData = req.body;

        const newProduct = await productService.createProduct(productData, userId);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error al crear producto:", error);
        res.status(500).json({ message: "Error al crear producto", error: error.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener productos", error: error.message });
    }
};