import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { sessionClaims, userId } = await auth();
  const baseUrl = request.nextUrl.origin;

  const roles = (sessionClaims?.metadata as string[]) ?? [];

  if (roles.includes("admin")) {
    return NextResponse.redirect(new URL("/admin", baseUrl));
  }

  if (roles.includes("seller")) {
    const seller = await prisma.seller.findUnique({
      where: { clerkUserId: userId! },
    });

    if (seller?.status === "inactive") {
      return NextResponse.redirect(new URL("/account-disabled", baseUrl));
    }

    return NextResponse.redirect(new URL("/dashboard", baseUrl));
  }

  return NextResponse.redirect(new URL("/sign-in", baseUrl));
}