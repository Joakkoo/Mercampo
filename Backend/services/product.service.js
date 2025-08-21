const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//Función para crear producto
exports.createProduct = async (data, userId) => {
    if (!data) throw new Error("No se enviaron datos para crear el producto");

    const { title, description, price, quantity, categoryId, images } = data;

    return await prisma.product.create({
        data: {
            title,
            description,
            price: parseFloat(price),
            quantity: parseInt(quantity),
            user: { connect: { id: userId } },            // Conecta el usuario
            createdBy: { connect: { id: userId } },       // Conecta el creador
            category: categoryId ? { connect: { id: Number(categoryId) } } : undefined,
            images: {
                create: images?.map(url => ({ url })) || []
              }
            },
            include: { images: true }
          });
};

//Función para obtener todos los productos
exports.getAllProducts = async () => {
    return await prisma.product.findMany({
        where: { deletedAt: null, status: "activo" },
        include: {
            category: true,
            user: { select: { id: true, email: true } },
        },
    });
};

//Función para obtener un producto por ID
// ...código existente...
exports.createProduct = async (data, userId) => {
    if (!data) throw new Error("No se enviaron datos para crear el producto");

    const {
        title, description, price, quantity, categoryId, images,
        finalidad, condicion, marca, modelo, anio, moneda, localidad, whatsapp,
        extraData // objeto con campos técnicos variables
    } = data;

    return await prisma.product.create({
        data: {
            title,
            description,
            price: parseFloat(price),
            quantity: parseInt(quantity),
            user: { connect: { id: userId } },
            createdBy: { connect: { id: userId } },
            category: categoryId ? { connect: { id: Number(categoryId) } } : undefined,
            finalidad,
            condicion,
            marca,
            modelo,
            anio: anio ? parseInt(anio) : null,
            moneda,
            localidad,
            whatsapp,
            extraData: extraData ? extraData : undefined,
            images: {
                create: images?.map(url => ({ url })) || []
            }
        },
        include: { images: true }
    });
};
