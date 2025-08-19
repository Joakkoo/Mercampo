const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller.js");

// Ruta para registrar un nuevo usuario
router.post('/register', authController.registerUser);
// Ruta para iniciar sesión
router.post('/login', authController.loginUser);
// Ruta para cerrar sesión
router.post("/logout", authController.logoutUser);

module.exports = router;