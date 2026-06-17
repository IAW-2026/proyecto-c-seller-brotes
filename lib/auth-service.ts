// lib/auth-service.ts
// Valida que el request entre servicios incluya la SERVICE_API_KEY correcta.
// Uso: const error = validateServiceKey(request); if (error) return error;

import { NextRequest, NextResponse } from "next/server";

export function validateServiceKey(req: NextRequest): NextResponse | null {
  const authHeader = req.headers.get("authorization");
  const expected = `Bearer ${process.env.SELLER_SERVICE_API_KEY}`;

  if (!authHeader || authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
