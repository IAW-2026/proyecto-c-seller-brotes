"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markAsRead(id: number) {
  await prisma.payoutNotification.update({
    where: { id },
    data: { read: true },
  });
  revalidatePath("/dashboard/notifications");
  revalidatePath(`/dashboard/notifications/${id}`);
}