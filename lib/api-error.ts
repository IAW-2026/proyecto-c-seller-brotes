// lib/api-error.ts
// Helper para devolver errores con formato consistente en todos los endpoints.
// Uso: return apiError("Producto no encontrado", 404)

import { NextResponse } from "next/server";

type ErrorCode =
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "BAD_REQUEST"
  | "CONFLICT"
  | "INTERNAL_ERROR";

const statusToCode: Record<number, ErrorCode> = {
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  500: "INTERNAL_ERROR",
};

export function apiError(message: string, status: number = 500) {
  const code = statusToCode[status] ?? "INTERNAL_ERROR";

  return NextResponse.json(
    {
      error: {
        message,
        code,
        status,
      },
    },
    { status }
  );
}
