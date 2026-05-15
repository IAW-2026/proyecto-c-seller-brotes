import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function requireSeller() {
  const { userId, sessionClaims } = await auth();

  if (!userId) redirect("/sign-in");

  const roles = (sessionClaims?.role as string[]) ?? [];

  if (!roles.includes("seller")) redirect("/unauthorized");

  return { userId, roles };
}