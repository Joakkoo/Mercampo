const authService = require('../services/auth.service');

// Controlador para registrar un nuevo usuario
exports.registerUser = async (req, res) => {
try {
    const result = await authService.registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Controlador para iniciar sesión
exports.loginUser = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Controlador para cerrar sesión
exports.logoutUser = async (req, res) => {
  try{
      const userId = req.user.id;
      const result = await authService.logoutUser(userId);
      res.status(200).json(result);
  } catch (error) {
      res.status(400).json({ message: error.message })
  }
};