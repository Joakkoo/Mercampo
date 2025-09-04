const { bulkUpsertCrops } = require('../services/crop.service');

function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

const groups = {
  Cereales: [
    'Trigo','Maíz','Arroz','Cebada','Avena','Centeno','Sorgo','Mijo','Quinoa'
  ],
  'Tubérculos y raíces': [
    'Papa','Batata / Camote','Yuca / Mandioca','Ñame','Remolacha','Zanahoria','Rábano'
  ],
  Legumbres: [
    'Soja','Poroto / Frijol','Garbanzo','Lenteja','Arveja / Guisante','Haba'
  ],
  Oleaginosas: [
    'Girasol','Maní','Canola / Colza','Sésamo / Ajonjolí','Algodón'
  ],
  Frutales: [
    'Uva','Manzana','Pera','Durazno / Melocotón','Ciruela','Cereza','Naranja','Mandarina','Limón','Pomelo','Banana / Plátano','Mango','Palta / Aguacate','Ananá / Piña','Sandía','Melón','Frutilla / Fresa','Arándano','Kiwi'
  ],
  Hortalizas: [
    'Lechuga','Tomate','Pimiento / Morrón','Pepino','Calabaza / Zapallo','Zucchini','Espinaca','Acelga','Repollo','Coliflor','Brócoli','Berenjena','Cebolla','Ajo'
  ],
  'Especias y hierbas': [
    'Albahaca','Perejil','Cilantro','Orégano','Romero','Tomillo','Menta','Laurel'
  ],
  'Otros cultivos importantes': [
    'Café','Cacao','Tabaco','Caña de azúcar','Te'
  ]
};

const crops = Object.entries(groups).flatMap(([group, items]) =>
  items.map(name => ({ name, slug: slugify(name), group }))
);

async function seed() {
  try {
    await bulkUpsertCrops(crops);
    console.log(`✔️  Cultivos insertados/actualizados: ${crops.length}`);
    process.exit(0);
  } catch (e) {
    console.error('Error al insertar cultivos:', e);
    process.exit(1);
  }
}

seed();
