import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function RedirectPage() {
  const { sessionClaims } = await auth();

  const roles = (sessionClaims?.metadata as string[]) ?? [];

  if (roles.includes("admin")) redirect("/admin");
  if (roles.includes("seller")) redirect("/dashboard");

  redirect("/sign-in");
}