import { requireSeller } from "@/lib/auth";
import { getOrCreateSeller } from "@/lib/seller";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { statusLabels, statusColors } from "@/lib/constants";
import { IconBox, IconPlant, IconAlert, IconUserEdit, IconWallet } from "@/components/icons";
import StatCard from "@/components/StatCard";

export default async function DashboardPage() {
  await requireSeller();

  const user = await currentUser();

  const seller = await getOrCreateSeller({
    clerkUserId: user!.id,
    name: `${user!.firstName} ${user!.lastName}`,
    email: user!.emailAddresses[0].emailAddress,
  });

  const [pendingOrders, activeProducts, outOfStockProducts, recentOrders, topProducts] =
    await Promise.all([
      prisma.incomingOrder.count({
        where: { sellerId: seller.id, status: { in: ["pendiente", "recibida"] } },
      }),
      prisma.product.count({
        where: { sellerId: seller.id, status: "active" },
      }),
      prisma.product.count({
        where: { sellerId: seller.id, stockAvailable: 0 },
      }),
      prisma.incomingOrder.findMany({
        where: { sellerId: seller.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.incomingOrderItem.groupBy({
        by: ["productId", "productNameSnapshot"],
        where: { incomingOrder: { sellerId: seller.id } },
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
    ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-verde-profundo)]">
          Bienvenida, {seller.name}
        </h1>
        <p className="text-gray-500">Panel de vendedor</p>
      </div>

      <div className="flex items-center gap-2">
        <a
          href="/dashboard/profile"
          className="flex items-center gap-2 text-sm font-medium text-[var(--color-verde-bosque)] border border-[var(--color-verde-bosque)] rounded-lg px-4 py-2 hover:bg-[var(--color-verde-bosque)] hover:text-white transition-colors"
        >
          <IconUserEdit size={16} />
          Editar perfil
        </a>
        <a
          href={`${process.env.PAYMENTS_APP_URL}/payouts`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium text-[var(--color-verde-bosque)] border border-[var(--color-verde-bosque)] rounded-lg px-4 py-2 hover:bg-[var(--color-verde-bosque)] hover:text-white transition-colors"
        >
          <IconWallet size={16} />
          Ver pagos
        </a>
      </div>
    </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Pedidos pendientes"
          value={pendingOrders}
          href="/dashboard/orders"
          icon={<IconBox size={28} />}
          bg="bg-[var(--color-verde-suave)]"
          iconColor="text-[var(--color-verde-bosque)]"
          accent="var(--color-verde-bosque)"
        />
        <StatCard
          label="Productos activos"
          value={activeProducts}
          href="/dashboard/products"
          icon={<IconPlant size={28} />}
          bg="bg-[var(--color-verde-brote)]"
          iconColor="text-[var(--color-verde-profundo)]"
          accent="var(--color-verde-hoja)"
        />
        <StatCard
          label="Productos sin stock"
          value={outOfStockProducts}
          href="/dashboard/products"
          icon={<IconAlert size={28} />}
          bg={outOfStockProducts > 0 ? "bg-red-50" : "bg-[var(--color-beige)]"}
          iconColor={outOfStockProducts > 0 ? "text-red-400" : "text-[var(--color-gris-piedra)]"}
          accent={outOfStockProducts > 0 ? "#e57373" : "var(--color-gris-piedra)"}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-[var(--color-gris-piedra)] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[var(--color-verde-profundo)]">Últimos pedidos</h2>
            <a href="/dashboard/orders" className="text-xs text-[var(--color-verde-bosque)] underline">Ver todos</a>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-400">Todavía no recibiste pedidos.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {recentOrders.map((order) => (
                <li key={order.id} className="flex items-center justify-between text-sm">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-700">Pedido #{order.id}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("es-AR", {
                        day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">
                      ${order.total.toLocaleString("es-AR")}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {statusLabels[order.status] ?? order.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-lg border border-[var(--color-gris-piedra)] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[var(--color-verde-profundo)]">Productos más vendidos</h2>
            <a href="/dashboard/products" className="text-xs text-[var(--color-verde-bosque)] underline">Ver todos</a>
          </div>
          {topProducts.length === 0 ? (
            <p className="text-sm text-gray-400">Todavía no hay ventas registradas.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {topProducts.map((item, index) => (
                <li key={item.productId} className="flex items-center gap-3 text-sm">
                  <span className="text-lg font-bold text-[var(--color-gris-piedra)] w-5 text-center">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-gray-700 truncate">{item.productNameSnapshot}</span>
                  <span className="font-medium text-[var(--color-verde-bosque)]">
                    {item._sum.quantity} uds.
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}