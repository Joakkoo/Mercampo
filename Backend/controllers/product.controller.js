const productService = require("../services/product.service");


exports.getEnums = async (req, res) => {
    try {
        const enums = await productService.getEnums();
        res.json(enums);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener enums", error: error.message });
    }
};

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

exports.getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ message: "Error al obtener producto" });
  }
};
