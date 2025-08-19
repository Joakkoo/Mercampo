const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getCategories = async () => {
    return await prisma.category.findMany({
        where: { deletedAt: null },
        include: {
            children: true
        }
    });
};

exports.createCategory = async (data) => {
    return await prisma.category.create({
        data: {
            ...data
        }
    });
};

