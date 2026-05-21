import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { sessionClaims } = await auth();
  const baseUrl = request.nextUrl.origin;

  const roles = (sessionClaims?.metadata as string[]) ?? [];

  if (roles.includes("admin")) {
    return NextResponse.redirect(new URL("/admin", baseUrl));
  }
  if (roles.includes("seller")) {
    return NextResponse.redirect(new URL("/dashboard", baseUrl));
  }

  return NextResponse.redirect(new URL("/sign-in", baseUrl));
}