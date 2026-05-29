// app/onboarding/actions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createSeller(formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const address = formData.get("address") as string;
  const cityPostalCode = formData.get("cityPostalCode");

  if (!name || !email) return;

  await prisma.seller.create({
    data: {
      clerkUserId: userId,
      name,
      email,
      address: address || null,
      cityPostalCode: cityPostalCode ? parseInt(cityPostalCode as string) : null,
    },
  });

  redirect("/dashboard");
}