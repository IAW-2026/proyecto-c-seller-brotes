// GET /api/products
// Lo llama Buyer App para mostrar el catálogo. Devuelve todos los productos con status: active paginados. 
// Buyer manda ?page=1&limit=20 y se le devuelve los productos con precio, stock y datos del seller. 
// Si no manda parámetros, por defecto es página 1 con 20 productos.

import { NextRequest, NextResponse } from "next/server";
import { validateServiceKey } from "@/lib/auth-service";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const authError = validateServiceKey(req);
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20")));
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: { status: "active" },
      include: { seller: true },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where: { status: "active" } }),
  ]);

  const data = products.map((p) => ({
    id: p.id,
    seller_id: p.sellerId,
    name: p.name,
    category: p.category,
    price: { amount: p.price, currency: "ARS" },
    stock: {
      available: p.stockAvailable,
      status: p.stockAvailable > 0 ? "in_stock" : "out_of_stock",
    },
    image_url: p.imageUrl ?? null,
  }));

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    },
  });
}
