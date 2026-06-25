// app/api/analytics/products/route.ts
// GET /api/analytics/products
// Lo llama el Analytics Dashboard para la sección de "Catálogo".
// Devuelve totales de catálogo (cantidad de productos, precio promedio, productos sin
// stock), distribución de ventas por categoría y el ranking de productos más vendidos,
// calculado a partir de las unidades vendidas en incoming_order_items.

import { NextRequest, NextResponse } from "next/server";
import { validateServiceKey } from "@/lib/auth-service";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/api-error";

const TOP_PRODUCTOS_LIMIT = 10;

export async function GET(req: NextRequest) {
  const authError = validateServiceKey(req);
  if (authError) return authError;

  try {
    const [totalProductos, precioPromedioAgg, productosSinStock, unidadesPorProducto] =
      await Promise.all([
        prisma.product.count(),
        prisma.product.aggregate({ _avg: { price: true } }),
        prisma.product.count({ where: { stockAvailable: 0 } }),
        prisma.incomingOrderItem.groupBy({
          by: ["productId"],
          _sum: { quantity: true },
        }),
      ]);

    const precioPromedio = precioPromedioAgg._avg.price ?? 0;

    // Traemos los productos involucrados en ventas para poder ordenarlos y armar
    // el detalle (nombre, categoría, vendedor, precio, ingreso total).
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
              id: producto.id,
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

    const productoMasVendido = ranking[0]?.nombre ?? null;
    const unidadesProductoMasVendido = ranking[0]?.unidadesVendidas ?? 0;

    const totalUnidadesVendidas = ranking.reduce(
      (sum, p) => sum + p.unidadesVendidas,
      0
    );

    const unidadesPorCategoria = ranking.reduce<Record<string, number>>(
      (acc, p) => {
        acc[p.categoria] = (acc[p.categoria] ?? 0) + p.unidadesVendidas;
        return acc;
      },
      {}
    );

    const ventasPorCategoria = Object.entries(unidadesPorCategoria).map(
      ([categoria, unidades]) => ({
        categoria,
        porcentaje:
          totalUnidadesVendidas > 0
            ? Math.round((unidades / totalUnidadesVendidas) * 100)
            : 0,
      })
    );

    return NextResponse.json({
      totalProductos,
      precioPromedio,
      productoMasVendido,
      unidadesProductoMasVendido,
      productosSinStock,
      ventasPorCategoria,
      topProductos: ranking.slice(0, TOP_PRODUCTOS_LIMIT),
    });
  } catch (error) {
    console.error("[GET /api/analytics/products]", error);
    return apiError("Error al obtener analytics de productos", 500);
  }
}