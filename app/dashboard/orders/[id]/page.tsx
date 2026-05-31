import { requireSeller } from "@/lib/auth";
import { getOrCreateSeller } from "@/lib/seller";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateOrderStatus } from "../actions";
import { IncomingOrderStatus } from "@prisma/client";
import { statusLabels } from "@/lib/constants";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireSeller();

  const user = await currentUser();
  const seller = await getOrCreateSeller({
    clerkUserId: user!.id,
    name: `${user!.firstName} ${user!.lastName}`,
    email: user!.emailAddresses[0].emailAddress,
  });

  const { id } = await params;
  const order = await prisma.incomingOrder.findFirst({
    where: { id: parseInt(id), sellerId: seller.id },
    include: { items: true },
  });

  if (!order) notFound();

  const nextStatus: Record<string, IncomingOrderStatus | null> = {
    pendiente: IncomingOrderStatus.recibida,
    recibida: IncomingOrderStatus.en_preparacion,
    en_preparacion: IncomingOrderStatus.listo,
    listo: IncomingOrderStatus.entregada,
    entregada: null,
  };

  const nextStatusLabel: Record<string, string> = {
    pendiente: "Marcar como recibida",
    recibida: "Marcar en preparación",
    en_preparacion: "Marcar como listo",
    listo: "Marcar como entregada",
    entregada: "",
  };

  const next = nextStatus[order.status];
  const updateOrderWithId = next
    ? updateOrderStatus.bind(null, order.id, next)
    : null;

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-[var(--color-verde-profundo)]">
            Pedido #{order.id}
          </h1>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString("es-AR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <span className="px-3 py-1 rounded text-sm font-medium bg-[var(--color-verde-suave)] text-[var(--color-verde-profundo)]">
          {statusLabels[order.status]}
        </span>
      </div>

      <div className="bg-white rounded shadow p-6 flex flex-col gap-4">
        <h2 className="font-semibold text-[var(--color-verde-profundo)]">
          Productos
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[400px]">
            <thead className="bg-[var(--color-verde-suave)] text-[var(--color-verde-profundo)]">
              <tr>
                <th className="text-left px-3 py-2">Producto</th>
                <th className="text-left px-3 py-2">Precio unitario</th>
                <th className="text-left px-3 py-2">Cantidad</th>
                <th className="text-left px-3 py-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-t border-[var(--color-gris-piedra)]">
                  <td className="px-3 py-2">{item.productNameSnapshot}</td>
                  <td className="px-3 py-2">${item.unitPriceSnapshot}</td>
                  <td className="px-3 py-2">{item.quantity}</td>
                  <td className="px-3 py-2">
                    ${item.unitPriceSnapshot * item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end font-semibold text-[var(--color-verde-profundo)]">
          Total: ${order.total}
        </div>
      </div>

      <div className="flex gap-4 justify-between">
        <a
          href="/dashboard/orders"
          className="px-4 py-2 border border-[var(--color-gris-piedra)] rounded hover:bg-[var(--color-beige)]"
        >
          Volver
        </a>
        {updateOrderWithId && (
          <form action={updateOrderWithId}>
            <button
              type="submit"
              className="px-4 py-2 bg-[var(--color-verde-bosque)] text-white rounded hover:bg-[var(--color-verde-hoja)]"
            >
              {nextStatusLabel[order.status]}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}