/*
  Warnings:

  - The `status` column on the `incoming_orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `products` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "IncomingOrderStatus" AS ENUM ('recibida', 'en_preparacion', 'listo', 'entregada');

-- AlterTable
ALTER TABLE "incoming_orders" DROP COLUMN "status",
ADD COLUMN     "status" "IncomingOrderStatus" NOT NULL DEFAULT 'recibida';

-- AlterTable
ALTER TABLE "products" DROP COLUMN "status",
ADD COLUMN     "status" "ProductStatus" NOT NULL DEFAULT 'active';
