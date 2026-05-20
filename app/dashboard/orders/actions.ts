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

  await prisma.incomingOrder.update({
    where: { id, sellerId: seller.id },
    data: { status: newStatus },
  });

  redirect(`/dashboard/orders/${id}`);
}
