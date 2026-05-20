/*
  Warnings:

  - Changed the type of `category` on the `products` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('suculentas', 'plantas_de_interior', 'aromaticas', 'frutales', 'cactus', 'colecciones_raras', 'macetas_y_kits');

-- AlterTable
ALTER TABLE "products" DROP COLUMN "category",
ADD COLUMN     "category" "ProductCategory" NOT NULL;
