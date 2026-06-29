-- CreateTable
CREATE TABLE "sellers" (
    "id" SERIAL NOT NULL,
    "clerk_user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "city" TEXT,
    "address" TEXT,
    "icon_url" TEXT,

    CONSTRAINT "sellers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "seller_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "image_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incoming_orders" (
    "id" SERIAL NOT NULL,
    "seller_id" INTEGER NOT NULL,
    "buyer_order_id" TEXT NOT NULL,
    "buyer_id" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'recibida',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "incoming_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incoming_order_items" (
    "id" SERIAL NOT NULL,
    "incoming_order_id" INTEGER NOT NULL,
    "product_id" TEXT NOT NULL,
    "product_name_snapshot" TEXT NOT NULL,
    "unit_price_snapshot" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "incoming_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sellers_clerk_user_id_key" ON "sellers"("clerk_user_id");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "sellers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incoming_orders" ADD CONSTRAINT "incoming_orders_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "sellers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incoming_order_items" ADD CONSTRAINT "incoming_order_items_incoming_order_id_fkey" FOREIGN KEY ("incoming_order_id") REFERENCES "incoming_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
