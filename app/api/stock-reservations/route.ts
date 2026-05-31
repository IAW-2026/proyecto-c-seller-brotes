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
import { apiError } from "@/lib/api-error"; 

interface ReservationItem {
  product_id: number;
  quantity: number;
}

export async function POST(req: NextRequest) {
  const authError = validateServiceKey(req);
  if (authError) return authError;

  let body: { buyer_id?: string; buyer_order_id?: string; items?: ReservationItem[] };
  try {
    body = await req.json();
  } catch {
    return apiError("Invalid JSON", 400);  
  }

  const { buyer_id, buyer_order_id, items } = body;
  if (!buyer_id || !buyer_order_id || !Array.isArray(items) || items.length === 0) {
    return apiError("Missing required fields", 400);  
  }

  if (!items) {
    return apiError("Items are required", 400);
  }

  for (const item of items) {
    if (!Number.isInteger(item.product_id) || item.product_id <= 0) {
      return apiError("Invalid product_id", 400);
    }
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      return apiError("Quantity must be a positive integer", 400);
    }
  }

  try {
    const productIds = items.map((i) => i.product_id);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, status: "active" },
    });

    for (const item of items) {
      const product = products.find((p) => p.id === item.product_id);
      if (!product) {
        return apiError(`Product ${item.product_id} not found or inactive`, 404); 
      }
      if (product.stockAvailable < item.quantity) {
        return apiError(`Insufficient stock for product ${item.product_id}`, 409);  
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      const total = items.reduce((acc, item) => {
        const product = products.find((p) => p.id === item.product_id)!;
        return acc + product.price * item.quantity;
      }, 0);
      
      const order = await tx.incomingOrder.create({
        data: {
          sellerId: products[0].sellerId,
          buyerOrderId: buyer_order_id,
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
        incoming_order_id: result.id,
        status: "reserved",
        items: items.map((i) => ({
          product_id: i.product_id,
          quantity: i.quantity,
        })),
        created_at: result.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/stock-reservations]", error);
    return apiError("Error al crear la reserva de stock", 500);
  }
}