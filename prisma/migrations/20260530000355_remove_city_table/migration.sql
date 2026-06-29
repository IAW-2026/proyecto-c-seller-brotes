/*
  Warnings:

  - You are about to drop the column `city_postal_code` on the `sellers` table. All the data in the column will be lost.
  - You are about to drop the `cities` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "sellers" DROP CONSTRAINT "sellers_city_postal_code_fkey";

-- AlterTable
ALTER TABLE "sellers" DROP COLUMN "city_postal_code",
ADD COLUMN     "city" TEXT;

-- DropTable
DROP TABLE "cities";
