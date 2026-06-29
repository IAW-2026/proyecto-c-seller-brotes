import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPayoutNotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireAdmin();

  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const PER_PAGE = 10;
  const skip = (currentPage - 1) * PER_PAGE;

  const [notifications, total] = await Promise.all([
    prisma.payoutNotification.findMany({
      skip,
      take: PER_PAGE,
      orderBy: { createdAt: "desc" },
      include: { seller: true },
    }),
    prisma.payoutNotification.count(),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[var(--color-verde-profundo)]">
        Todas las acreditaciones
      </h1>

      {notifications.length === 0 ? (
        <p className="text-[var(--color-gris-piedra)]">No hay notificaciones.</p>
      ) : (
        <>
          <p className="text-xs text-[var(--color-gris-piedra)] -mt-3">
            {total} resultado{total !== 1 ? "s" : ""}
          </p>
          <div className="overflow-x-auto rounded shadow">
            <table className="w-full bg-white text-sm min-w-[640px]">
              <thead className="bg-[var(--color-verde-suave)] text-[var(--color-verde-profundo)]">
                <tr>
                  <th scope="col" className="text-left px-4 py-3">Pago</th>
                  <th scope="col" className="text-left px-4 py-3">Seller</th>
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
                    <td className="px-4 py-3">{n.seller.name}</td>
                    <td className="px-4 py-3">
                      ${n.amount} {n.currency}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(n.createdAt).toLocaleDateString("es-AR")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          n.read
                            ? "bg-[var(--color-gris-piedra)] text-white"
                            : "bg-[var(--color-verde-brote)] text-[var(--color-verde-profundo)]"
                        }`}
                      >
                        {n.read ? "Leída" : "Nueva"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`/admin/notifications/${n.id}`}
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
        </>
      )}

      {totalPages > 1 && (
        <nav aria-label="Paginación" className="flex gap-2 justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`?page=${p}`}
              aria-current={p === currentPage ? "page" : undefined}
              aria-label={`Página ${p}`}
              className={`px-3 py-1 rounded ${
                p === currentPage
                  ? "bg-[var(--color-verde-bosque)] text-white"
                  : "bg-white border border-[var(--color-gris-piedra)]"
              }`}
            >
              {p}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}