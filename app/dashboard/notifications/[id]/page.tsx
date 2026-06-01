import { requireSeller } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { markAsRead } from "../actions";

export default async function NotificationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireSeller();

  const { id } = await params;
  const notification = await prisma.payoutNotification.findUnique({
    where: { id: parseInt(id) },
  });

  if (!notification) notFound();

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div className="flex items-center gap-4">
        <a
          href="/dashboard/notifications"
          className="text-[var(--color-verde-bosque)] hover:underline text-sm"
        >
          ← Volver
        </a>
        <h1 className="text-2xl font-bold text-[var(--color-verde-profundo)]">
          Detalle de acreditación
        </h1>
      </div>

      <div className="bg-white rounded shadow p-6 flex flex-col gap-4 text-sm">
        <div className="flex justify-between">
          <span className="text-[var(--color-gris-piedra)]">Payment ID</span>
          <span className="font-mono">{notification.paymentId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--color-gris-piedra)]">Monto</span>
          <span className="font-semibold">${notification.amount} {notification.currency}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--color-gris-piedra)]">Fecha</span>
          <span>{new Date(notification.createdAt).toLocaleString("es-AR")}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--color-gris-piedra)]">Estado</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            notification.read
              ? "bg-[var(--color-gris-piedra)] text-white"
              : "bg-[var(--color-verde-brote)] text-[var(--color-verde-profundo)]"
          }`}>
            {notification.read ? "Leída" : "Nueva"}
          </span>
        </div>
      </div>

      {!notification.read && (
        <form action={markAsRead.bind(null, notification.id)}>
          <button
            type="submit"
            className="bg-[var(--color-verde-bosque)] text-white px-4 py-2 rounded hover:bg-[var(--color-verde-hoja)]"
          >
            Marcar como leída
          </button>
        </form>
      )}
    </div>
  );
}