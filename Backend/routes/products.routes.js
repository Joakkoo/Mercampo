const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddlewares");
const productController = require("../controllers/product.controller");

// Crear producto (requiere estar logueado)
router.post("/", authMiddleware, productController.createProduct);

// (opcional) listar productos
router.get("/", productController.getAllProducts);

module.exports = router;
