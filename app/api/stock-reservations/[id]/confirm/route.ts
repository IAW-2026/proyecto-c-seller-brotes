// POST /api/stock-reservations/:id/confirm
// Lo llama Payments App cuando el pago fue aprobado. 
// Recibe el ID de la reserva, cambia la IncomingOrder de pendiente a recibida, y descuenta las unidades de 
//    stockReserved — porque ya no están reservadas, están vendidas definitivamente. 


import { NextRequest, NextResponse } from "next/server";
import { validateServiceKey } from "@/lib/auth-service";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = validateServiceKey(req);
  if (authError) return authError;

  const{id} = await params;
  const orderId = parseInt(id);
  if (isNaN(orderId)) {
    return NextResponse.json({ error: "Invalid reservation ID" }, { status: 400 });
  }

  let body: { buyer_order_id?: string; confirmed_at?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const order = await prisma.incomingOrder.findUnique({ where: { id: orderId } });
  if (!order) {
    return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
  }
  if (order.status !== "pendiente") {
    return NextResponse.json(
      { error: `Cannot confirm order with status "${order.status}"` },
      { status: 409 }
    );
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

    // El stock reservado pasa a vendido: se descuenta de stockReserved
    for (const item of updated.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stockReserved: { decrement: item.quantity } },
      });
    }

    return updated;
  });

  return NextResponse.json({
    reservation_id: `res_${updated.id}`,
    status: "confirmed",
    payment_id: body.buyer_order_id ?? null,
    confirmed_at: body.confirmed_at ?? new Date().toISOString(),
  });
}
