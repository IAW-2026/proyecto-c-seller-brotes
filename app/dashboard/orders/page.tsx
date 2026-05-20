import { requireSeller } from "@/lib/auth";
import { getOrCreateSeller } from "@/lib/seller";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const ORDERS_PER_PAGE = 10;

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  await requireSeller();

  const user = await currentUser();
  const seller = await getOrCreateSeller({
    clerkUserId: user!.id,
    name: `${user!.firstName} ${user!.lastName}`,
    email: user!.emailAddresses[0].emailAddress,
  });

  const { page, status } = await searchParams;
  const currentPage = Number(page) || 1;
  const skip = (currentPage - 1) * ORDERS_PER_PAGE;

  const where = {
    sellerId: seller.id,
    ...(status ? { status: status as any } : {}),
  };

  const [orders, total] = await Promise.all([
    prisma.incomingOrder.findMany({
      where,
      skip,
      take: ORDERS_PER_PAGE,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    prisma.incomingOrder.count({ where }),
  ]);

  const totalPages = Math.ceil(total / ORDERS_PER_PAGE);

  const statusLabels: Record<string, string> = {
    recibida: "Recibida",
    en_preparacion: "En preparación",
    listo: "Listo",
    entregada: "Entregada",
  };

  const statusColors: Record<string, string> = {
    recibida: "bg-blue-100 text-blue-800",
    en_preparacion: "bg-yellow-100 text-yellow-800",
    listo: "bg-green-100 text-green-800",
    entregada: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[var(--color-verde-profundo)]">
        Pedidos
      </h1>

      <div className="flex gap-2">
        <a
          href="/dashboard/orders"
          className={`px-3 py-1 rounded text-sm ${!status ? "bg-[var(--color-verde-bosque)] text-white" : "bg-white border border-[var(--color-gris-piedra)]"}`}
        >
          Todos
        </a>
        {Object.entries(statusLabels).map(([value, label]) => (
          <a
            key={value}
            href={`/dashboard/orders?status=${value}`}
            className={`px-3 py-1 rounded text-sm ${status === value ? "bg-[var(--color-verde-bosque)] text-white" : "bg-white border border-[var(--color-gris-piedra)]"}`}
          >
            {label}
          </a>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="text-[var(--color-gris-piedra)]">No hay pedidos.</p>
      ) : (
        <table className="w-full bg-white rounded shadow text-sm">
          <thead className="bg-[var(--color-verde-suave)] text-[var(--color-verde-profundo)]">
            <tr>
              <th className="text-left px-4 py-3">#</th>
              <th className="text-left px-4 py-3">Fecha</th>
              <th className="text-left px-4 py-3">Items</th>
              <th className="text-left px-4 py-3">Total</th>
              <th className="text-left px-4 py-3">Estado</th>
              <th className="text-left px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-[var(--color-gris-piedra)]">
                <td className="px-4 py-3">#{order.id}</td>
                <td className="px-4 py-3">
                  {new Date(order.createdAt).toLocaleDateString("es-AR")}
                </td>
                <td className="px-4 py-3">{order.items.length} productos</td>
                <td className="px-4 py-3">${order.total}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`/dashboard/orders/${order.id}`}
                    className="text-[var(--color-verde-bosque)] hover:underline"
                  >
                    Ver detalle
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex gap-2 justify-center">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <a
            key={p}
            href={`?page=${p}${status ? `&status=${status}` : ""}`}
            className={`px-3 py-1 rounded ${
              p === currentPage
                ? "bg-[var(--color-verde-bosque)] text-white"
                : "bg-white border border-[var(--color-gris-piedra)]"
            }`}
          >
            {p}
          </a>
        ))}
      </div>
    </div>
  );
}
