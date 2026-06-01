-- CreateTable
CREATE TABLE "payout_notifications" (
    "id" SERIAL NOT NULL,
    "seller_id" INTEGER NOT NULL,
    "payment_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payout_notifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "payout_notifications" ADD CONSTRAINT "payout_notifications_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "sellers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
