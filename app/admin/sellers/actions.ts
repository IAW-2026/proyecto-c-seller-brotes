"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deactivateSeller(sellerId: number) {
  await prisma.seller.update({
    where: { id: sellerId },
    data: { status: "inactive" },
  });
  revalidatePath("/admin/sellers");
}

export async function activateSeller(sellerId: number) {
  await prisma.seller.update({
    where: { id: sellerId },
    data: { status: "active" },
  });
  revalidatePath("/admin/sellers");
}