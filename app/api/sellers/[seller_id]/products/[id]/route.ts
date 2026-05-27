// GET /api/sellers/:seller_id/products/:id
// Lo llama Buyer App cuando el comprador entra al detalle de un producto específico. 
// Recibe el ID del seller y el ID del producto, verifica que ese producto pertenezca a ese seller, y 
//  devuelve toda la info incluyendo el stock reservado además del disponible.

import { NextRequest, NextResponse } from "next/server";
import { validateServiceKey } from "@/lib/auth-service";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ seller_id: string; id: string }> }
) {
  const authError = validateServiceKey(req);
  if (authError) return authError;

  const { seller_id, id } = await params;
  const sellerId = parseInt(seller_id);
  const productId = parseInt(id);

  if (isNaN(sellerId) || isNaN(productId)) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const product = await prisma.product.findFirst({
    where: { id: productId, sellerId },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: product.id,
    seller_id: product.sellerId,
    name: product.name,
    description: product.description ?? null,
    category: product.category,
    price: { amount: product.price, currency: "ARS" },
    stock: {
      available: product.stockAvailable,
      reserved: product.stockReserved,
      status: product.stockAvailable > 0 ? "in_stock" : "out_of_stock",
    },
    image_url: product.imageUrl ?? null,
    estado: product.status,
    created_at: product.createdAt.toISOString(),
  });
}
