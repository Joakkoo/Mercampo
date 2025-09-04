const { lookupSpecs } = require('../services/lecturaSpecs.service');

exports.lookup = async (req, res) => {
  try {
    const { marca, modelo } = req.query;
    if (!marca || !modelo) return res.status(400).json({ message: 'Parámetros requeridos: marca, modelo' });

    const data = await lookupSpecs({ brand: marca, model: modelo });
    res.json({ success: true, data });
  } catch (e) {
    console.error('Error lookup specs:', e);
    res.status(500).json({ success: false, message: 'Error obteniendo especificaciones' });
  }
};
