import { requireSeller } from "@/lib/auth";
import { getOrCreateSeller } from "@/lib/seller";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export default async function NotificationsPage() {
  await requireSeller();

  const user = await currentUser();
  const seller = await getOrCreateSeller({
    clerkUserId: user!.id,
    name: `${user!.firstName} ${user!.lastName}`,
    email: user!.emailAddresses[0].emailAddress,
  });

  const notifications = await prisma.payoutNotification.findMany({
    where: { sellerId: seller.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[var(--color-verde-profundo)]">
        Acreditaciones recibidas
      </h1>

      {notifications.length === 0 ? (
        <p className="text-[var(--color-gris-piedra)]">No hay notificaciones.</p>
      ) : (
        <div className="overflow-x-auto rounded shadow">
          <table className="w-full bg-white text-sm min-w-[560px]">
            <thead className="bg-[var(--color-verde-suave)] text-[var(--color-verde-profundo)]">
              <tr>
                <th scope="col" className="text-left px-4 py-3">Pago</th>
                <th scope="col" className="text-left px-4 py-3">Monto</th>
                <th scope="col" className="text-left px-4 py-3">Fecha</th>
                <th scope="col" className="text-left px-4 py-3">Estado</th>
                <th scope="col" className="text-left px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((n) => (
                <tr key={n.id} className="border-t border-[var(--color-gris-piedra)]">
                  <td className="px-4 py-3 font-mono text-xs">{n.paymentId}</td>
                  <td className="px-4 py-3">${n.amount} {n.currency}</td>
                  <td className="px-4 py-3">
                    {new Date(n.createdAt).toLocaleDateString("es-AR")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      n.read
                        ? "bg-[var(--color-gris-piedra)] text-white"
                        : "bg-[var(--color-verde-brote)] text-[var(--color-verde-profundo)]"
                    }`}>
                      {n.read ? "Leída" : "Nueva"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`/dashboard/notifications/${n.id}`}
                      className="text-[var(--color-verde-bosque)] hover:underline"
                    >
                      Ver detalle
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}