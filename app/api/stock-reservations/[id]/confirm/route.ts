// POST /api/stock-reservations/:id/confirm
// Lo llama Payments App cuando el pago fue aprobado. 
// Recibe el ID de la reserva, cambia la IncomingOrder de pendiente a recibida, y descuenta las unidades de 
//    stockReserved — porque ya no están reservadas, están vendidas definitivamente. 

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

  let body: { buyer_order_id?: string; confirmed_at?: string };
  try {
    body = await req.json();
  } catch {
    return apiError("Invalid JSON", 400);
  }

  try {
    const order = await prisma.incomingOrder.findUnique({ where: { id: orderId } });
    if (!order) {
      return apiError("Reservation not found", 404);
    }
    if (order.status !== "pendiente") {
      return apiError(`Cannot confirm order with status "${order.status}"`, 409);
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updated = await tx.incomingOrder.update({
        where: { id: orderId },
        data: {
          status: "recibida",
          buyerOrderId: body.buyer_order_id ?? order.buyerOrderId,
        },
        include: { items: true },
      });

      for (const item of updated.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockReserved: { decrement: item.quantity } },
        });
      }

      return updated;
    });

    return NextResponse.json({
      buyer_order_id: body.buyer_order_id ?? updated.buyerOrderId,
      status: "confirmed",
      payment_id: null, // Payments App no lo manda, se deja null
      confirmed_at: body.confirmed_at ?? new Date().toISOString(),
    });
  } catch (error) {
    console.error("[POST /api/stock-reservations/:id/confirm]", error);
    return apiError("Error al confirmar la reserva", 500);
  }
}