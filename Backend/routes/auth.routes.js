import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/auth.controller.js';

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', registerUser);
// Ruta para iniciar sesión
router.post('/login', loginUser);
// Ruta para cerrar sesión
router.post("/logout", logoutUser);

export default router;