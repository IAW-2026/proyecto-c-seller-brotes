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
  console.log("[stock-reservations/reject] request recibida", { id });

  if (!id) {
    console.warn("[stock-reservations/reject] id ausente en params");
    return apiError("Invalid reservation ID", 400);
  }

  let body: { buyer_order_id?: string; rejected_at?: string } = {};
  try {
    body = await req.json();
    console.log("[stock-reservations/reject] body recibido", body);
  } catch {
    console.log("[stock-reservations/reject] sin body / body vacío");
  }

  try {
    const order = await prisma.incomingOrder.findUnique({
      where: { buyerOrderId: id },
      include: { items: true },
    });

    if (!order) {
      console.warn("[stock-reservations/reject] orden no encontrada", { buyerOrderId: id });
      return apiError("Reservation not found", 404);
    }

    console.log("[stock-reservations/reject] orden encontrada", {
      orderId: order.id,
      buyerOrderId: order.buyerOrderId,
      status: order.status,
      itemsCount: order.items.length,
    });

    if (order.status !== "pendiente") {
      console.warn("[stock-reservations/reject] estado inválido para cancelar", {
        buyerOrderId: id,
        status: order.status,
      });
      return apiError(`Cannot cancel order with status "${order.status}"`, 409);
    }

    console.log(
      "[stock-reservations/reject] liberando stock",
      order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }))
    );

    await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        const updated = await tx.product.update({
          where: { id: item.productId },
          data: {
            stockAvailable: { increment: item.quantity },
            stockReserved: { decrement: item.quantity },
          },
        });
        console.log("[stock-reservations/reject] stock actualizado", {
          productId: updated.id,
          stockAvailable: updated.stockAvailable,
          stockReserved: updated.stockReserved,
        });
      }

      // Borrar primero los items hijos para no violar el FK constraint
      const deletedItems = await tx.incomingOrderItem.deleteMany({
        where: { incomingOrderId: order.id },
      });
      console.log("[stock-reservations/reject] items eliminados", {
        orderId: order.id,
        count: deletedItems.count,
      });

      await tx.incomingOrder.delete({ where: { buyerOrderId: id } });
      console.log("[stock-reservations/reject] incomingOrder eliminada", { buyerOrderId: id });
    });

    const responsePayload = {
      buyer_order_id: body.buyer_order_id ?? order.buyerOrderId,
      status: "cancelled",
      released_at: body.rejected_at ?? new Date().toISOString(),
    };

    console.log("[stock-reservations/reject] reserva cancelada OK", responsePayload);

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error("[POST /api/stock-reservations/:id/reject]", error);
    return apiError("Error al rechazar la reserva", 500);
  }
}