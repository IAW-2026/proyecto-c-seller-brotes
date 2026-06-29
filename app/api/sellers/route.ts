// GET /api/sellers
// Lo llama Buyer App para listar los vendedores disponibles. Devuelve nombre, ciudad, dirección y 
//     cuántos productos activos tiene cada seller. 
// Buyer lo usa, por ejemplo, para mostrar una página de "vendedores" o filtrar el catálogo por tienda.

import { NextRequest, NextResponse } from "next/server";
import { validateServiceKey } from "@/lib/auth-service";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/api-error";

export async function GET(req: NextRequest) {
  const authError = validateServiceKey(req);
  if (authError) return authError;

  try {
    const sellers = await prisma.seller.findMany({
      where: { status: "active" },
      include: {
        _count: { select: { products: { where: { status: "active" } } } },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      sellers: sellers.map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        clerk_id: s.clerkUserId,
        city: s.city ?? null,    
        address: s.address ?? null,
        icon_url: s.iconUrl ?? null,
        products_count: s._count.products,
      })),
    });
  } catch (error) { 
    console.error("[GET /api/sellers]", error);
    return apiError("Error al obtener los vendedores", 500);
  }
}
