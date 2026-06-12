import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { sessionClaims, userId } = await auth();
  const baseUrl = request.nextUrl.origin;

  if (!userId) {
    return new NextResponse(
      `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Redirigiendo...</title>
    <script>
      let attempts = 0;
      const maxAttempts = 10;

      async function tryRedirect() {
        attempts++;
        try {
          const res = await fetch('/redirect', { method: 'GET', credentials: 'include' });
          if (res.redirected) {
            window.location.href = res.url;
          } else if (res.ok) {
            window.location.reload();
          } else if (attempts < maxAttempts) {
            setTimeout(tryRedirect, 500);
          } else {
            window.location.href = '/sign-in';
          }
        } catch {
          if (attempts < maxAttempts) setTimeout(tryRedirect, 500);
          else window.location.href = '/sign-in';
        }
      }

      setTimeout(tryRedirect, 600);
    </script>
  </head>
  <body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;">
    <p style="color:#666;">Redirigiendo...</p>
  </body>
</html>`,
      {
        status: 200,
        headers: { "Content-Type": "text/html" },
      }
    );
  }

  const roles = (sessionClaims?.metadata as string[]) ?? [];

  if (roles.includes("admin")) {
    return NextResponse.redirect(new URL("/admin", baseUrl));
  }

  if (roles.includes("seller")) {
    const seller = await prisma.seller.findUnique({
      where: { clerkUserId: userId! },
    });

    if (!seller) {
      return NextResponse.redirect(new URL("/onboarding", baseUrl));
    }

    if (seller.status === "inactive") {
      return NextResponse.redirect(new URL("/account-disabled", baseUrl));
    }

    return NextResponse.redirect(new URL("/dashboard", baseUrl));
  }

  return NextResponse.redirect(new URL("/sign-in", baseUrl));
}