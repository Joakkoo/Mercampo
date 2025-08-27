/*
  Warnings:

  - The `condicion` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `finalidad` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `moneda` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."Moneda" AS ENUM ('ARS', 'USD');

-- CreateEnum
CREATE TYPE "public"."Finalidad" AS ENUM ('Venta', 'Compra', 'Alquilo');

-- CreateEnum
CREATE TYPE "public"."Condicion" AS ENUM ('Nuevo', 'Usado');

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "condicion",
ADD COLUMN     "condicion" "public"."Condicion",
DROP COLUMN "finalidad",
ADD COLUMN     "finalidad" "public"."Finalidad",
DROP COLUMN "moneda",
ADD COLUMN     "moneda" "public"."Moneda";
