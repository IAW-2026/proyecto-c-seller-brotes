// app/api/analytics/revenue/route.ts
// GET /api/analytics/revenue
// Lo llama el Analytics Dashboard para la sección de "Ventas".
// Devuelve el ranking de vendedores según ingresos acreditados (payout notifications)
// dentro del mes calendario actual.

import { NextRequest, NextResponse } from "next/server";
import { validateServiceKey } from "@/lib/auth-service";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/api-error";

const TOP_VENDEDORES_LIMIT = 10;

export async function GET(req: NextRequest) {
  const authError = validateServiceKey(req);
  if (authError) return authError;

  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const ingresosPorSeller = await prisma.payoutNotification.groupBy({
      by: ["sellerId"],
      where: { createdAt: { gte: startOfMonth } },
      _sum: { amount: true },
    });

    const sellerIds = ingresosPorSeller.map((i) => i.sellerId);
    const sellers = await prisma.seller.findMany({
      where: { id: { in: sellerIds } },
    });
    const sellersById = new Map(sellers.map((s) => [s.id, s]));

    const topVendedores = ingresosPorSeller
      .map((i) => {
        const seller = sellersById.get(i.sellerId);
        return seller
          ? {
              id: seller.id,
              nombre: seller.name,
              ingresos: i._sum.amount ?? 0,
            }
          : null;
      })
      .filter((v): v is NonNullable<typeof v> => v !== null)
      .sort((a, b) => b.ingresos - a.ingresos)
      .slice(0, TOP_VENDEDORES_LIMIT);

    return NextResponse.json({ topVendedores });
  } catch (error) {
    console.error("[GET /api/analytics/revenue]", error);
    return apiError("Error al obtener analytics de ingresos", 500);
  }
}