import { prisma } from "./prisma";

export async function getOrCreateSeller({
  clerkUserId,
  name,
  email,
}: {
  clerkUserId: string;
  name: string;
  email: string;
}) {
  const existing = await prisma.seller.findUnique({
    where: { clerkUserId },
  });

  if (existing) return existing;

  return await prisma.seller.create({
    data: {
      clerkUserId,
      name,
      email,
    },
  });
}
