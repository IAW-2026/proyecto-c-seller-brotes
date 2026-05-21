import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  await requireAdmin();

  const [totalSellers, totalProducts, totalOrders] = await Promise.all([
    prisma.seller.count(),
    prisma.product.count(),
    prisma.incomingOrder.count(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[var(--color-verde-profundo)]">
        Panel de administración
      </h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded shadow p-6 flex flex-col gap-2">
          <span className="text-sm text-gray-500">Sellers registrados</span>
          <span className="text-3xl font-bold text-[var(--color-verde-profundo)]">
            {totalSellers}
          </span>
          <a href="/admin/sellers" className="text-sm text-[var(--color-verde-bosque)] hover:underline">
            Ver todos
          </a>
        </div>
        <div className="bg-white rounded shadow p-6 flex flex-col gap-2">
          <span className="text-sm text-gray-500">Productos publicados</span>
          <span className="text-3xl font-bold text-[var(--color-verde-profundo)]">
            {totalProducts}
          </span>
          <a href="/admin/products" className="text-sm text-[var(--color-verde-bosque)] hover:underline">
            Ver todos
          </a>
        </div>
        <div className="bg-white rounded shadow p-6 flex flex-col gap-2">
          <span className="text-sm text-gray-500">Pedidos recibidos</span>
          <span className="text-3xl font-bold text-[var(--color-verde-profundo)]">
            {totalOrders}
          </span>
          <a href="/admin/orders" className="text-sm text-[var(--color-verde-bosque)] hover:underline">
            Ver todos
          </a>
        </div>
      </div>
    </div>
  );
}
