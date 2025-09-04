const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.listCrops = async () => {
  return await prisma.crop.findMany({
    where: { deletedAt: null },
    orderBy: [{ group: 'asc' }, { name: 'asc' }]
  });
};

exports.bulkUpsertCrops = async (crops) => {
  const ops = crops.map(crop =>
    prisma.crop.upsert({
      where: { slug: crop.slug },
      update: { name: crop.name, group: crop.group },
      create: { name: crop.name, slug: crop.slug, group: crop.group }
    })
  );
  await prisma.$transaction(ops);
};
