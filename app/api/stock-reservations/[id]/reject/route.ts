// POST /api/stock-reservations/:id/reject
// Lo llama Payments App cuando el pago fue rechazado. 
// Recibe el ID de la reserva y hace lo contrario al confirm: devuelve las unidades de stockReserved a 
//    stockAvailable y elimina la IncomingOrder. 
// El stock queda libre para que otro comprador lo pueda comprar.

import { NextRequest, NextResponse } from "next/server";
import { validateServiceKey } from "@/lib/auth-service";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/api-error";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = validateServiceKey(req);
  if (authError) return authError;

  const { id } = await params;
  const orderId = parseInt(id);
  if (isNaN(orderId)) {
    return apiError("Invalid reservation ID", 400);
  }
  let body: { buyer_order_id?: string; rejected_at?: string } = {};
  try {
    body = await req.json();
  } catch {
  }
  try {
    const order = await prisma.incomingOrder.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return apiError("Reservation not found", 404);
    }
    if (order.status !== "pendiente") {
      return apiError(`Cannot cancel order with status "${order.status}"`, 409);
    }

    await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockAvailable: { increment: item.quantity },
            stockReserved: { decrement: item.quantity },
          },
        });
      }

      await tx.incomingOrder.delete({ where: { id: orderId } });
    });

    return NextResponse.json({
      buyer_order_id: body.buyer_order_id ?? order.buyerOrderId,
      status: "cancelled",
      released_at: body.rejected_at ?? new Date().toISOString(),
    });
  } catch (error) {
    console.error("[POST /api/stock-reservations/:id/reject]", error);
    return apiError("Error al rechazar la reserva", 500);
  }
}
