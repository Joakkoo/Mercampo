-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "anio" INTEGER,
ADD COLUMN     "condicion" TEXT,
ADD COLUMN     "extraData" JSONB,
ADD COLUMN     "finalidad" TEXT,
ADD COLUMN     "localidad" TEXT,
ADD COLUMN     "marca" TEXT,
ADD COLUMN     "modelo" TEXT,
ADD COLUMN     "moneda" TEXT;
