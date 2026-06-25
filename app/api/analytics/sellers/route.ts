// app/api/analytics/sellers/route.ts
// GET /api/analytics/sellers
// Lo llama el Analytics Dashboard para mostrar la sección de "Usuarios" (vendedores).
// Devuelve totales de vendedores y, por cada vendedor, su ciudad, cantidad de productos,
// estado de la cuenta (active/inactive) y ventas del mes calendario actual (suma de
// payout notifications acreditadas por Payments App).

import { NextRequest, NextResponse } from "next/server";
import { validateServiceKey } from "@/lib/auth-service";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/api-error";

export async function GET(req: NextRequest) {
  const authError = validateServiceKey(req);
  if (authError) return authError;

  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const sellers = await prisma.seller.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { name: "asc" },
    });

    const [totalVendedores, vendedoresActivos, ventasPorSeller] = await Promise.all([
      prisma.seller.count(),
      prisma.seller.count({ where: { status: "active" } }),
      prisma.payoutNotification.groupBy({
        by: ["sellerId"],
        where: { createdAt: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
    ]);

    const ventasMap = new Map<number, number>(
      ventasPorSeller.map((v) => [v.sellerId, v._sum.amount ?? 0])
    );

    return NextResponse.json({
      totalVendedores,
      vendedoresActivos,
      vendedores: sellers.map((s) => ({
        id: s.id,
        nombre: s.name,
        ciudad: s.city ?? null,
        totalProductos: s._count.products,
        estado: s.status,
        ventasMes: ventasMap.get(s.id) ?? 0,
      })),
    });
  } catch (error) {
    console.error("[GET /api/analytics/sellers]", error);
    return apiError("Error al obtener analytics de vendedores", 500);
  }
}