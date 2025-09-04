const cropService = require('../services/crop.service');

exports.getCrops = async (req, res) => {
  try {
    const crops = await cropService.listCrops();
    res.json(crops);
  } catch (error) {
    console.error('Error obteniendo cultivos:', error);
    res.status(500).json({ message: 'Error al obtener cultivos' });
  }
};
