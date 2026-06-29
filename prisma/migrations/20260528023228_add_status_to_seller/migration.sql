-- CreateEnum
CREATE TYPE "SellerStatus" AS ENUM ('active', 'inactive');

-- AlterTable
ALTER TABLE "sellers" ADD COLUMN     "status" "SellerStatus" NOT NULL DEFAULT 'active';
