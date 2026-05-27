// POST /api/stock-reservations/:id/reject
// Lo llama Payments App cuando el pago fue rechazado. 
// Recibe el ID de la reserva y hace lo contrario al confirm: devuelve las unidades de stockReserved a 
//    stockAvailable y elimina la IncomingOrder. 
// El stock queda libre para que otro comprador lo pueda comprar.

import { NextRequest, NextResponse } from "next/server";
import { validateServiceKey } from "@/lib/auth-service";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = validateServiceKey(req);
  if (authError) return authError;

  const { id } = await params;
  const orderId = parseInt(id);
  if (isNaN(orderId)) {
    return NextResponse.json({ error: "Invalid reservation ID" }, { status: 400 });
  }

  const order = await prisma.incomingOrder.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
  }
  if (order.status !== "pendiente") {
    return NextResponse.json(
      { error: `Cannot cancel order with status "${order.status}"` },
      { status: 409 }
    );
  }

  await prisma.$transaction(async (tx) => {
    // Devolver el stock reservado a disponible
    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stockAvailable: { increment: item.quantity },
          stockReserved: { decrement: item.quantity },
        },
      });
    }

    // Marcar la orden con un estado que indique cancelación
    // Usamos "pendiente" → no existe "cancelada" en el enum, así que la dejamos
    // en un estado descriptivo. Si querés agregar "cancelada" al enum, avisame.
    await tx.incomingOrder.delete({ where: { id: orderId } });
  });

  return NextResponse.json({
    reservation_id: `res_${orderId}`,
    status: "cancelled",
    released_at: new Date().toISOString(),
  });
}
