import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminSellersPage() {
  await requireAdmin();

  const sellers = await prisma.seller.findMany({
    orderBy: { id: "asc" },
    include: {
      _count: {
        select: {
          products: true,
          incomingOrders: true,
        },
      },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[var(--color-verde-profundo)]">
        Sellers
      </h1>

      {sellers.length === 0 ? (
        <p className="text-[var(--color-gris-piedra)]">No hay sellers registrados.</p>
      ) : (
        <table className="w-full bg-white rounded shadow text-sm">
          <thead className="bg-[var(--color-verde-suave)] text-[var(--color-verde-profundo)]">
            <tr>
              <th className="text-left px-4 py-3">#</th>
              <th className="text-left px-4 py-3">Nombre</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Productos</th>
              <th className="text-left px-4 py-3">Pedidos</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr key={seller.id} className="border-t border-[var(--color-gris-piedra)]">
                <td className="px-4 py-3">{seller.id}</td>
                <td className="px-4 py-3">{seller.name}</td>
                <td className="px-4 py-3">{seller.email}</td>
                <td className="px-4 py-3">{seller._count.products}</td>
                <td className="px-4 py-3">{seller._count.incomingOrders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
