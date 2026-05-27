// POST /api/stock-reservations
// Lo llama Buyer App en el momento en que el comprador confirma la compra, antes de procesar el pago. 
// El flujo es: 
//  → verificar que haya stock suficiente para todos los items 
//  → crear la IncomingOrder en estado pendiente 
//  → mover el stock de stockAvailable a stockReserved. 
// Esto "aparta" las unidades para que otro comprador no las pueda llevarse mientras se procesa el pago. 
// Si no hay stock, devuelve 409 y no toca nada.

import { NextRequest, NextResponse } from "next/server";
import { validateServiceKey } from "@/lib/auth-service";
import { prisma } from "@/lib/prisma";

interface ReservationItem {
  product_id: number;
  quantity: number;
}

export async function POST(req: NextRequest) {
  const authError = validateServiceKey(req);
  if (authError) return authError;

  let body: { buyer_id?: string; seller_id?: string; items?: ReservationItem[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { buyer_id, seller_id, items } = body;

  if (!buyer_id || !seller_id || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Verificar stock disponible para todos los items antes de reservar
  const productIds = items.map((i) => i.product_id);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, status: "active" },
  });

  for (const item of items) {
    const product = products.find((p) => p.id === item.product_id);
    if (!product) {
      return NextResponse.json(
        { error: `Product ${item.product_id} not found or inactive` },
        { status: 404 }
      );
    }
    if (product.stockAvailable < item.quantity) {
      return NextResponse.json(
        { error: `Insufficient stock for product ${item.product_id}` },
        { status: 409 }
      );
    }
  }

  // Crear la IncomingOrder en estado "pendiente" y descontar stock disponible
  const result = await prisma.$transaction(async (tx) => {
    const total = items.reduce((acc, item) => {
      const product = products.find((p) => p.id === item.product_id)!;
      return acc + product.price * item.quantity;
    }, 0);

    const order = await tx.incomingOrder.create({
      data: {
        sellerId: parseInt(seller_id),
        buyerOrderId: "", // se completa cuando Buyer confirma la orden
        buyerId: buyer_id,
        total,
        status: "pendiente",
        items: {
          create: items.map((item) => {
            const product = products.find((p) => p.id === item.product_id)!;
            return {
              productId: item.product_id,
              productNameSnapshot: product.name,
              unitPriceSnapshot: product.price,
              quantity: item.quantity,
            };
          }),
        },
      },
    });

    // Mover stock de available → reserved
    for (const item of items) {
      await tx.product.update({
        where: { id: item.product_id },
        data: {
          stockAvailable: { decrement: item.quantity },
          stockReserved: { increment: item.quantity },
        },
      });
    }

    return order;
  });

  return NextResponse.json(
    {
      reservation_id: `res_${result.id}`,
      status: "reserved",
      items: items.map((i) => ({
        product_id: i.product_id,
        quantity: i.quantity,
      })),
      created_at: result.createdAt.toISOString(),
    },
    { status: 201 }
  );
}
