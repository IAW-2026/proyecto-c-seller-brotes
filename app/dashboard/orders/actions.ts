"use server";

import { prisma } from "@/lib/prisma";
import { requireSeller } from "@/lib/auth";
import { getOrCreateSeller } from "@/lib/seller";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { IncomingOrderStatus } from "@prisma/client";

export async function updateOrderStatus(
  id: number,
  newStatus: IncomingOrderStatus
) {
  await requireSeller();

  const user = await currentUser();
  const seller = await getOrCreateSeller({
    clerkUserId: user!.id,
    name: `${user!.firstName} ${user!.lastName}`,
    email: user!.emailAddresses[0].emailAddress,
  });

  const order = await prisma.incomingOrder.update({
    where: { id, sellerId: seller.id },
    data: { status: newStatus },
  });

  // Notificar a Buyer App
  await fetch(`${process.env.BUYER_APP_URL}/api/orders/${order.buyerOrderId}/status-update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.BUYER_SERVICE_API_KEY}`,
    },
    body: JSON.stringify({
      order_id: order.buyerOrderId,
      status: newStatus,
      updated_at: new Date().toISOString(),
    }),
  });

  redirect(`/dashboard/orders/${id}`);
}
