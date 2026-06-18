/*
  Warnings:

  - A unique constraint covering the columns `[buyer_order_id]` on the table `incoming_orders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "incoming_orders_buyer_order_id_key" ON "incoming_orders"("buyer_order_id");
