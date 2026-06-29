// app/api/analytics/route.ts
// GET /api/analytics
// Lo llama el Analytics Dashboard para obtener todos los datos de Seller App en un solo request.

import { NextRequest, NextResponse } from "next/server";
import { validateServiceKey } from "@/lib/auth-service";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/api-error";

const TOP_PRODUCTOS_LIMIT = 10;
const TOP_VENDEDORES_LIMIT = 10;

export async function GET(req: NextRequest) {
  const authError = validateServiceKey(req);
  if (authError) return authError;

  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalVendedores,
      vendedoresActivos,
      sellers,
      totalProductos,
      precioPromedioAgg,
      productosSinStock,
      unidadesPorProducto,
      ventasPorSeller,
      ingresosPorSeller,
    ] = await Promise.all([
      prisma.seller.count(),
      prisma.seller.count({ where: { status: "active" } }),
      prisma.seller.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { name: "asc" },
      }),
      prisma.product.count(),
      prisma.product.aggregate({ _avg: { price: true } }),
      prisma.product.count({ where: { stockAvailable: 0 } }),
      prisma.incomingOrderItem.groupBy({
        by: ["productId"],
        _sum: { quantity: true },
      }),
      prisma.payoutNotification.groupBy({
        by: ["sellerId"],
        where: { createdAt: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
      prisma.payoutNotification.groupBy({
        by: ["sellerId"],
        where: { createdAt: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
    ]);

    const precioPromedio = precioPromedioAgg._avg.price ?? 0;

    // Mapa de ventas del mes por seller
    const ventasMap = new Map<number, number>(
      ventasPorSeller.map((v) => [v.sellerId, v._sum.amount ?? 0])
    );

    // Top productos
    const productIds = unidadesPorProducto.map((u) => u.productId);
    const productosVendidos = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { seller: true },
    });
    const productosById = new Map(productosVendidos.map((p) => [p.id, p]));

    const ranking = unidadesPorProducto
      .map((u) => {
        const producto = productosById.get(u.productId);
        const unidadesVendidas = u._sum.quantity ?? 0;
        return producto
          ? {
              id: String(producto.id),
              nombre: producto.name,
              categoria: producto.category,
              vendedorNombre: producto.seller.name,
              precio: producto.price,
              unidadesVendidas,
              ingresoTotal: producto.price * unidadesVendidas,
            }
          : null;
      })
      .filter((p): p is NonNullable<typeof p> => p !== null)
      .sort((a, b) => b.unidadesVendidas - a.unidadesVendidas);

    const totalUnidadesVendidas = ranking.reduce((sum, p) => sum + p.unidadesVendidas, 0);

    const unidadesPorCategoria = ranking.reduce<Record<string, number>>((acc, p) => {
      acc[p.categoria] = (acc[p.categoria] ?? 0) + p.unidadesVendidas;
      return acc;
    }, {});

    const ventasPorCategoria = Object.entries(unidadesPorCategoria).map(
      ([categoria, unidades]) => ({
        categoria,
        porcentaje:
          totalUnidadesVendidas > 0
            ? Math.round((unidades / totalUnidadesVendidas) * 100)
            : 0,
      })
    );

    // Top vendedores por ingresos del mes
    const sellerIds = ingresosPorSeller.map((i) => i.sellerId);
    const sellersConIngresos = await prisma.seller.findMany({
      where: { id: { in: sellerIds } },
    });
    const sellersById = new Map(sellersConIngresos.map((s) => [s.id, s]));

    const topVendedores = ingresosPorSeller
      .map((i) => {
        const seller = sellersById.get(i.sellerId);
        return seller
          ? { id: seller.id, nombre: seller.name, ingresos: i._sum.amount ?? 0 }
          : null;
      })
      .filter((v): v is NonNullable<typeof v> => v !== null)
      .sort((a, b) => b.ingresos - a.ingresos)
      .slice(0, TOP_VENDEDORES_LIMIT);

    return NextResponse.json({
      // Vendedores
      totalVendedores,
      vendedoresActivos,
      vendedores: sellers.map((s) => ({
        id: String(s.id),
        nombre: s.name,
        ciudad: s.city ?? "",
        totalProductos: s._count.products,
        estado: s.status === "active" ? "activo" : "inactivo",
        ventasMes: ventasMap.get(s.id) ?? 0,
      })),
      // Productos
      totalProductos,
      precioPromedio,
      productoMasVendido: ranking[0]?.nombre ?? null,
      unidadesProductoMasVendido: ranking[0]?.unidadesVendidas ?? 0,
      productosSinStock,
      ventasPorCategoria,
      topProductos: ranking.slice(0, TOP_PRODUCTOS_LIMIT),
      // Revenue
      topVendedores,
    });
  } catch (error) {
    console.error("[GET /api/analytics]", error);
    return apiError("Error al obtener analytics", 500);
  }
}