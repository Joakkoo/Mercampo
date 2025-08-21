const { createCategory } = require('../services/category.service');

// Función para generar slug
function slugify(text) {
    return text
        .toString()
        .normalize('NFD') // Quita acentos
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Espacios por guiones
        .replace(/[^\w\-]+/g, '') // Quita caracteres no válidos
        .replace(/\-\-+/g, '-'); // Quita guiones dobles
}

const categories = [
    {
        name: 'Maquinaria Agrícola',
        children: [
            'Tractores', 'Cosechadoras', 'Sembradoras', 'Pulverizadoras', 'Fertilizadoras',
            'Tolvas', 'Arados', 'Rastras', 'Segadoras', 'Desmalezadoras', 'Enfardadoras',
            'Rotoenfardadoras', 'Picadoras', 'Mixers Agrícolas', 'Plataformas y Cabezales',
            'Niveladoras', 'Chimangos', 'Tolvas autodescargables', 'Accesorios de maquinaria'
        ]
    },
    {
        name: 'Maquinaria Vial',
        children: []
    },
    {
        name: 'Herramientas',
        children: []
    },
    {
        name: 'Infraestructura',
        children: []
    },
    {
        name: 'Repuestos',
        children: []
    },
    {
        name: 'Vehículos',
        children: []
    },
    {
        name: 'Insumos Agrícolas',
        children: [
            'Semillas', 'Fertilizantes', 'Herbicidas', 'Insecticidas', 'Fungicidas',
            'Bioinsumos', 'Sustratos y enmiendas', 'Bolsas silo'
        ]
    },
    {
        name: 'Inmuebles Rurales',
        children: []
    },
    {
        name: 'Hacienda (Ganado)',
        children: [
            'Bovinos', 'Ovinos', 'Porcinos', 'Equinos', 'Caprinos', 'Aves'
        ]
    },
    {
        name: 'Insumos para Ganadería',
        children: []
    },
    {
        name: 'Construcción',
        children: []
    },
    {
        name: 'Servicios',
        children: [
            'Flete de granos y hacienda',
            'Servicios de maquinaria (siembra, pulverización, cosecha)',
            'Asesoramiento técnico (agronomía, veterinaria, ingeniería)',
            'Servicios financieros (seguros, créditos)'
        ]
    },
    {
        name: 'Tecnología para el Agro',
        children: []
    },
    {
        name: 'Viveros y Jardines',
        children: []
    },
    {
        name: 'Mascotas',
        children: []
    },
    {
        name: 'Otros productos',
        children: []
    }
];

async function seed() {
    for (const category of categories) {
        // Crear categoría principal
        const parent = await createCategory({ name: category.name, slug: slugify(category.name) });
        // Crear subcategorías si existen
        for (const childName of category.children) {
            await createCategory({ name: childName, parentId: parent.id, slug: slugify(childName) });
        }
    }
    console.log('Categorías y subcategorías insertadas.');
    process.exit();
}

seed().catch(e => {
    console.error(e);
    process.exit(1);
});