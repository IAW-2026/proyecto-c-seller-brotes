/*
  Warnings:

  - You are about to drop the column `stock` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `sellers` table. All the data in the column will be lost.
  - Changed the type of `product_id` on the `incoming_order_items` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
ALTER TYPE "IncomingOrderStatus" ADD VALUE 'pendiente';

-- AlterTable
ALTER TABLE "incoming_order_items" DROP COLUMN "product_id",
ADD COLUMN     "product_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "incoming_orders" ALTER COLUMN "status" SET DEFAULT 'pendiente';

-- AlterTable
ALTER TABLE "products" DROP COLUMN "stock",
ADD COLUMN     "stock_available" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stock_reserved" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "sellers" DROP COLUMN "city",
ADD COLUMN     "city_postal_code" INTEGER;

-- CreateTable
CREATE TABLE "cities" (
    "postal_code" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("postal_code")
);

-- AddForeignKey
ALTER TABLE "sellers" ADD CONSTRAINT "sellers_city_postal_code_fkey" FOREIGN KEY ("city_postal_code") REFERENCES "cities"("postal_code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incoming_order_items" ADD CONSTRAINT "incoming_order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
