const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddlewares");
const productController = require("../controllers/product.controller");


// Obtener enums
router.get("/enums", productController.getEnums);

// Crear producto (requiere estar logueado)
router.post("/", authMiddleware, productController.createProduct);

// Obtener todos los productos
router.get("/", productController.getAllProducts);

// Obtener producto por ID
router.get("/:id", productController.getProductById);

module.exports = router;
