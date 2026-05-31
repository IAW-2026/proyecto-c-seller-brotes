import { requireSeller } from "@/lib/auth";
import { getOrCreateSeller } from "@/lib/seller";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { statusLabels, statusColors } from "@/lib/constants";
import { DashboardOrderFilters } from "./DashboardOrderFilters";
import { Suspense } from "react";
import { IncomingOrderStatus } from "@prisma/client";

const ORDERS_PER_PAGE = 10;

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; search?: string }>;
}) {
  await requireSeller();

  const user = await currentUser();
  const seller = await getOrCreateSeller({
    clerkUserId: user!.id,
    name: `${user!.firstName} ${user!.lastName}`,
    email: user!.emailAddresses[0].emailAddress,
  });

  const { page, status, search } = await searchParams;
  const currentPage = Number(page) || 1;
  const skip = (currentPage - 1) * ORDERS_PER_PAGE;

  const validStatus =
    status && Object.values(IncomingOrderStatus).includes(status as IncomingOrderStatus)
      ? (status as IncomingOrderStatus)
      : undefined;

  // Buscar IDs que empiecen con el número ingresado
  let matchingIds: number[] | null = null;
  if (search && search.trim() !== "") {
    const rows = await prisma.$queryRaw<{ id: number }[]>`
      SELECT id FROM incoming_orders
      WHERE seller_id = ${seller.id}
      AND CAST(id AS TEXT) LIKE ${search.trim() + "%"}
    `;
    matchingIds = rows.map((r) => r.id);
  }

  const where = {
    sellerId: seller.id,
    ...(validStatus ? { status: validStatus } : {}),
    ...(matchingIds !== null ? { id: { in: matchingIds } } : {}),
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

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[var(--color-verde-profundo)]">
        Pedidos
      </h1>

      <Suspense>
        <DashboardOrderFilters />
      </Suspense>

      {orders.length === 0 ? (
        <p className="text-[var(--color-gris-piedra)]">
          {search || validStatus
            ? "No se encontraron pedidos con ese criterio."
            : "No hay pedidos."}
        </p>
      ) : (
        <>
          <p className="text-xs text-[var(--color-gris-piedra)] -mt-3">
            {total} resultado{total !== 1 ? "s" : ""}
          </p>
          <div className="overflow-x-auto rounded shadow">
            <table className="w-full bg-white text-sm min-w-[560px]">
              <thead className="bg-[var(--color-verde-suave)] text-[var(--color-verde-profundo)]">
                <tr>
                  <th scope="col" className="text-left px-4 py-3">#</th>
                  <th scope="col" className="text-left px-4 py-3">Fecha</th>
                  <th scope="col" className="text-left px-4 py-3">Items</th>
                  <th scope="col" className="text-left px-4 py-3">Total</th>
                  <th scope="col" className="text-left px-4 py-3">Estado</th>
                  <th scope="col" className="text-left px-4 py-3">Acciones</th>
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
                        aria-label={`Ver detalle del pedido #${order.id}`}
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
              href={`?page=${p}${validStatus ? `&status=${validStatus}` : ""}${search ? `&search=${search}` : ""}`}
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